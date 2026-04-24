import type { QueryType } from "@/app/lib/types";
import { PROMPT_AVOID } from "@/app/lib/blocklist";

const ctx: Record<QueryType, (input: string) => string> = {
  idea: (input) => `The user has a project idea: "${input}"`,
  competitor: (input) => `The user wants names with a similar feel to the brand: "${input}"`,
  seed: (input) => `The user likes the vibe of the word/name "${input}" and wants related names`,
};

export function buildPrompt(input: string, type: QueryType, exclude: string[]): string {
  const hardAvoid = PROMPT_AVOID.join(", ");
  const alreadyTried = exclude.length
    ? `Do NOT suggest any of these (already tried in this session): ${exclude.join(", ")}`
    : "";

  return `
You are a naming expert with exceptional taste. Generate 8 short, memorable project or startup names that have a real chance of being available as a .com domain.

${ctx[type](input)}

Strict rules:
- 1–2 syllables preferred (3 max)
- No portmanteaus with "ify", "ly", "pro", "boost", "tech", "quantum", "ai" unless genuinely elegant
- Think: Notion, Linear, Vercel, Arc, Zed, Loom, Figma, Gleam, Kaido — that register (inspiration only, DO NOT suggest these specific names)
- No numbers, no hyphens, 3–10 characters each
- Favour creative transformations over plain dictionary words: reverse a word (canva → avnac), drop inner vowels (tumblr, flickr), phonetic respell (lyft, digg), portmanteau two short words (pinterest = pin + interest), soft foreign suffix (-o, -a, -io, -ora, -elle), or unusual language roots (Japanese, Latin, Greek) — plain common English words (flow, hub, spark, pulse, etc.) are virtually all taken and waste the user's time
- Absolutely do NOT suggest: ${hardAvoid}
${alreadyTried}

Return ONLY a JSON array of lowercase strings. No explanation. No markdown fences.
Example: ["kaido","mellow","brimm"]
  `.trim();
}
