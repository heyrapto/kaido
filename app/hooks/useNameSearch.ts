"use client";

import { useCallback } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";
import { toast } from "@/app/store/toast";
import { modal } from "@/app/store/modal";

const MAX_ATTEMPTS = 5;
const TARGET_AVAILABLE = 3;
const CONFIRM_AFTER = 3;

type GenerateResponse = { names: string[]; error?: string };
type AvailabilityResponse = {
  results: { name: string; domain: string; available: boolean }[];
  error?: string;
};

function looksLikeConfigError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("api_key is not set") ||
    m.includes("api key is not set") ||
    m.includes("gemini_api_key")
  );
}

async function requestNames(
  input: string,
  type: QueryType,
  exclude: string[],
): Promise<string[]> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, type, exclude }),
  });
  const data = (await res.json()) as GenerateResponse;
  if (!res.ok) throw new Error(data.error ?? "Failed to generate names");
  return data.names ?? [];
}

async function requestAvailability(
  names: string[],
): Promise<AvailabilityResponse["results"]> {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ names }),
  });
  const data = (await res.json()) as AvailabilityResponse;
  if (!res.ok) throw new Error(data.error ?? "Failed to check availability");
  return data.results ?? [];
}

export function useNameSearch() {
  const startRun = useKaidoStore((s) => s.startRun);
  const addCandidates = useKaidoStore((s) => s.addCandidates);
  const setCardStatus = useKaidoStore((s) => s.setCardStatus);
  const incrementAttempt = useKaidoStore((s) => s.incrementAttempt);
  const setDone = useKaidoStore((s) => s.setDone);
  const setStatus = useKaidoStore((s) => s.setStatus);

  return useCallback(async () => {
    const state = useKaidoStore.getState();
    const query = state.query.trim();
    if (!query) return;

    startRun();

    try {
      let availableCount = 0;
      let attempt = 0;

      while (attempt < MAX_ATTEMPTS && availableCount < TARGET_AVAILABLE) {
        // After N rounds with not enough availability, ask before burning more
        if (attempt === CONFIRM_AFTER && availableCount < TARGET_AVAILABLE) {
          const cont = await modal.confirm({
            variant: "info",
            title: "Keep searching?",
            description:
              availableCount === 0
                ? `No free names after ${CONFIRM_AFTER} rounds. Want me to try up to ${MAX_ATTEMPTS - CONFIRM_AFTER} more?`
                : `Only ${availableCount} free after ${CONFIRM_AFTER} rounds. Want me to try up to ${MAX_ATTEMPTS - CONFIRM_AFTER} more?`,
            primaryLabel: "keep going",
            secondaryLabel: "stop here",
          });
          if (!cont) break;
        }

        incrementAttempt();
        attempt += 1;

        const exclude = useKaidoStore.getState().allTried;
        const names = await requestNames(query, state.queryType, exclude);

        if (names.length === 0) {
          if (attempt === 1) {
            setStatus("done");
            toast.info(
              "No good names this round",
              "Try a different description or switch tabs.",
            );
            return;
          }
          break;
        }

        addCandidates(names);

        const results = await requestAvailability(names);
        for (const r of results) {
          setCardStatus(r.name, r.available ? "available" : "taken");
          if (r.available) availableCount += 1;
        }
      }

      setDone();
      if (availableCount === 0) {
        toast.info(
          "Nothing free this round",
          "Every suggestion was taken — try a different angle.",
        );
      } else if (availableCount < TARGET_AVAILABLE) {
        toast.info(
          `${availableCount} available name${availableCount === 1 ? "" : "s"} found`,
          "Stopped before hitting 3 — click again to keep searching.",
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");

      if (looksLikeConfigError(message)) {
        modal.error(
          "Server is missing an API key",
          "Add GEMINI_API_KEY to .env.local and restart the dev server.",
        );
      } else {
        toast.error("Something went wrong", message);
      }
    }
  }, [startRun, addCandidates, setCardStatus, incrementAttempt, setDone, setStatus]);
}
