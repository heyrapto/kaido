import type { QueryType } from "@/app/lib/types";
import { PROMPT_AVOID } from "@/app/lib/blocklist";
import { OBSCURE_WORDS } from "@/app/lib/dictionary";

const ctx: Record<QueryType, (input: string) => string> = {
  idea: (input) => `The user has a project idea: "${input}"`,
  competitor: (input) => `The user wants names with a similar feel to the brand: "${input}"`,
  seed: (input) => `The user likes the vibe of the word/name "${input}" and wants related names`,
};

function getObscureWords(count: number): string {
  if (!OBSCURE_WORDS || OBSCURE_WORDS.length === 0) return "";
  const shuffled = [...OBSCURE_WORDS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map(w => `- ${w.word} (${w.def})`).join("\\n");
}

export function buildPrompt(input: string, type: QueryType, exclude: string[]): string {
  const hardAvoid = PROMPT_AVOID.join(", ");
  const alreadyTried = exclude.length
    ? `Do NOT suggest any of these (already tried in this session): ${exclude.join(", ")}`
    : "";
  const inspiration = getObscureWords(5);

  return `
You are a naming expert with exceptional taste. Generate 8 short, memorable project or startup names that have a real chance of being available as a .com domain.

${ctx[type](input)}

Strict rules:
- 1–2 syllables preferred (3 max)
- No portmanteaus with "ify", "ly", "pro", "boost", "tech", "quantum", "ai" unless genuinely elegant
- Think: Notion, Linear, Vercel, Arc, Zed, Loom, Figma, Gleam, Kaido — that register (inspiration only, DO NOT suggest these specific names)
- No numbers, no hyphens, 3–10 characters each
- CRITICAL: DO NOT suggest any unmodified English dictionary words (like cadre, trove, agora, cohort). Every single one is already registered as a .com.
- INSTEAD, you MUST invent new words: use a portmanteau (pinterest = pin + interest), drop inner vowels (tumblr, flickr), use phonetic respellings (lyft, digg), or combine an obscure word with a suffix (e.g. -io, -ora, -elle, -ova, -yx).
- Absolutely do NOT suggest: ${hardAvoid}
${alreadyTried}
${inspiration ? '\nFor inspiration, here are some obscure, rare words with their meanings to get you thinking:\n' + inspiration : ''}

Return ONLY a JSON array of lowercase strings. No explanation. No markdown fences.
Example: ["kaido","mellow","brimm"]
  `.trim();
}
