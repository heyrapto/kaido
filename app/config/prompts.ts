import type { QueryType } from "@/app/lib/types";

const ctx: Record<QueryType, (input: string) => string> = {
  idea: (input) => `The user has a project idea: "${input}"`,
  competitor: (input) => `The user wants names with a similar feel to the brand: "${input}"`,
  seed: (input) => `The user likes the vibe of the word/name "${input}" and wants related names`,
};

export function buildPrompt(input: string, type: QueryType, exclude: string[]): string {
  return `
You are a naming expert with exceptional taste. Generate 8 short, memorable project or startup names.

${ctx[type](input)}

Strict rules:
- 1–2 syllables preferred (3 max)
- No portmanteaus with "ify", "ly", "pro", "boost", "tech", "quantum", "ai" unless genuinely elegant
- Think: Notion, Linear, Vercel, Arc, Zed, Loom, Figma, Gleam, Kaido — that register
- Real words, invented words, or portmanteaus that feel human and pronounceable
- No numbers, no hyphens, 3–10 characters each
${exclude.length ? `Do NOT suggest any of these (already tried): ${exclude.join(", ")}` : ""}

Return ONLY a JSON array of lowercase strings. No explanation. No markdown fences.
Example: ["luna","drift","fern"]
  `.trim();
}
