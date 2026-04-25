"use client";

import type { QueryType } from "@/app/lib/types";
import { filterNames } from "@/app/lib/quality";
import { creativeVariants } from "@/app/lib/mutate";
import { pickFromCorpus, pickInvented } from "@/app/lib/corpus";

const MAX_NAMES = 12;
const CORPUS_PICKS = 2;
const INVENTED_PICKS = 3;

// Same blending pipeline /api/generate used to do, now client-side so the
// LLM call (Gemini-via-Puter, Grok-via-Puter) and the augmentation can run
// in the same place without a server round-trip.
export function augmentNames(
  input: string,
  type: QueryType,
  exclude: string[],
  llmRaw: string[],
): string[] {
  const fromLLM = filterNames(llmRaw, exclude);

  const variants =
    type === "competitor" || type === "seed" ? creativeVariants(input) : [];
  const fromVariants = filterNames(variants, [...exclude, ...fromLLM]);

  const usedSoFar = [...exclude, ...fromLLM, ...fromVariants];
  const corpusPicks = pickFromCorpus(CORPUS_PICKS, usedSoFar);
  const fromCorpus = filterNames(corpusPicks, usedSoFar);

  const inventedPicks = pickInvented(INVENTED_PICKS, [
    ...usedSoFar,
    ...fromCorpus,
  ]);
  const fromInvented = filterNames(inventedPicks, [...usedSoFar, ...fromCorpus]);

  return [...fromLLM, ...fromVariants, ...fromCorpus, ...fromInvented].slice(
    0,
    MAX_NAMES,
  );
}
