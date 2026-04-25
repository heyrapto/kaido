"use client";

import type { QueryType } from "@/app/lib/types";
import { buildPrompt } from "@/app/config/prompts";
import {
  chatWithTimeout,
  ensurePuter,
  parseNamesFromResponse,
} from "@/app/lib/puterClient";

// Grok-via-Puter fallback. Used only when every Gemini model in gemini.ts
// has failed (rate limit, model error, etc.). Different provider so we're
// not just hitting the same upstream that just denied us.
const GROK_MODELS = [
  "x-ai/grok-4-fast-non-reasoning",
  "x-ai/grok-4-1-fast",
  "x-ai/grok-3-mini",
];

export async function generateNamesViaPuter(
  input: string,
  type: QueryType,
  exclude: string[],
): Promise<string[]> {
  const puter = await ensurePuter();
  const prompt = buildPrompt(input, type, exclude);

  let lastErr: unknown = null;
  for (const model of GROK_MODELS) {
    try {
      const response = await chatWithTimeout(puter, prompt, model);
      const names = parseNamesFromResponse(response);
      if (names.length > 0) return names;
    } catch (err) {
      lastErr = err;
    }
  }
  if (lastErr) throw lastErr;
  return [];
}
