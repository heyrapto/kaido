"use client";

import { useCallback } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";

const MAX_ATTEMPTS = 5;
const TARGET_AVAILABLE = 3;

type GenerateResponse = { names: string[]; error?: string };
type AvailabilityResponse = {
  results: { name: string; domain: string; available: boolean }[];
  error?: string;
};

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
  const setError = useKaidoStore((s) => s.setError);

  return useCallback(async () => {
    const state = useKaidoStore.getState();
    const query = state.query.trim();
    if (!query) return;

    startRun();

    try {
      let availableCount = 0;
      let attempt = 0;

      while (attempt < MAX_ATTEMPTS && availableCount < TARGET_AVAILABLE) {
        incrementAttempt();
        attempt += 1;

        const exclude = useKaidoStore.getState().allTried;
        const names = await requestNames(query, state.queryType, exclude);

        if (names.length === 0) {
          if (attempt === 1) {
            setError("No good names this round — try a different description.");
            setStatus("error");
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStatus("error");
    }
  }, [startRun, addCandidates, setCardStatus, incrementAttempt, setDone, setStatus, setError]);
}
