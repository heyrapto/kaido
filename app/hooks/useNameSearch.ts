"use client";

import { useCallback } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";
import { toast } from "@/app/store/toast";
import { modal } from "@/app/store/modal";
import { generateNames } from "@/app/lib/gemini";
import { generateNamesViaPuter } from "@/app/lib/puter";
import { augmentNames } from "@/app/lib/augment";

// How many attempts per "round" before we pause and ask the user
const BATCH_SIZE = 3;
// Hard ceiling so we never loop forever
const MAX_ROUNDS = 5;

type AvailabilityResponse = {
  results: { name: string; domain: string; available: boolean }[];
  error?: string;
};

type Source = "gemini" | "grok";

async function requestNames(
  input: string,
  type: QueryType,
  exclude: string[],
): Promise<{ names: string[]; source: Source }> {
  let primaryErr: unknown = null;
  try {
    const llm = await generateNames(input, type, exclude);
    if (llm.length > 0) {
      return { names: augmentNames(input, type, exclude, llm), source: "gemini" };
    }
  } catch (err) {
    primaryErr = err;
  }
  try {
    const llm = await generateNamesViaPuter(input, type, exclude);
    return { names: augmentNames(input, type, exclude, llm), source: "grok" };
  } catch (fallbackErr) {
    throw primaryErr ?? fallbackErr;
  }
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

/**
 * Runs one "round" of BATCH_SIZE generation attempts, checking availability
 * for each batch. Returns the number of NEW available names found in this round.
 */
async function runRound(
  query: string,
  queryType: QueryType,
  addCandidates: (n: string[]) => void,
  setCardStatus: (name: string, status: "available" | "taken" | "checking") => void,
  incrementAttempt: () => void,
): Promise<{ found: number; emptyBatch: boolean }> {
  let found = 0;
  let notifiedPuterFallback = false;

  for (let i = 0; i < BATCH_SIZE; i++) {
    incrementAttempt();

    const exclude = useKaidoStore.getState().allTried;
    let names: string[];
    let source: Source;

    try {
      ({ names, source } = await requestNames(query, queryType, exclude));
    } catch {
      // If both LLMs fail on first attempt of a round, bail
      if (i === 0) return { found, emptyBatch: true };
      break;
    }

    if (source === "grok" && !notifiedPuterFallback) {
      notifiedPuterFallback = true;
      toast.info(
        "Switched to Grok fallback",
        "Gemini-via-Puter failed — using Grok-via-Puter for this round.",
      );
    }

    if (names.length === 0) {
      if (i === 0) return { found, emptyBatch: true };
      break;
    }

    addCandidates(names);

    const results = await requestAvailability(names);
    for (const r of results) {
      setCardStatus(r.name, r.available ? "available" : "taken");
      if (r.available) found += 1;
    }
  }

  return { found, emptyBatch: false };
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
      let totalAvailable = 0;
      let round = 0;

      while (round < MAX_ROUNDS) {
        round += 1;

        const { found, emptyBatch } = await runRound(
          query,
          state.queryType,
          addCandidates,
          setCardStatus,
          incrementAttempt,
        );
        totalAvailable += found;

        // If LLMs returned nothing at all on the first try, stop
        if (emptyBatch && round === 1) {
          setDone();
          toast.info(
            "No good names this round",
            "Try a different description or switch tabs.",
          );
          return;
        }
        if (emptyBatch) break;

        // Pause and ask the user if they want to keep going
        if (round < MAX_ROUNDS) {
          setDone();

          const label =
            totalAvailable === 0
              ? "No available names found yet."
              : `Found ${totalAvailable} available name${totalAvailable === 1 ? "" : "s"}.`;

          const keepGoing = await modal.confirm({
            variant: "info",
            title: label,
            description: "Want me to search for more?",
            primaryLabel: "keep going",
            secondaryLabel: "I'm good",
          });

          if (!keepGoing) return;

          // Resume generating status for the next round
          setStatus("generating");
        }
      }

      setDone();
      if (totalAvailable === 0) {
        toast.info(
          "Nothing free this round",
          "Every suggestion was taken — try a different angle.",
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      toast.error("Something went wrong", message);
    }
  }, [startRun, addCandidates, setCardStatus, incrementAttempt, setDone, setStatus]);
}
