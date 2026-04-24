import { GoogleGenAI } from "@google/genai";
import type { QueryType } from "@/app/lib/types";
import { buildPrompt } from "@/app/config/prompts";

const MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  if (!client) client = new GoogleGenAI({ apiKey: key });
  return client;
}

function extractJsonArray(raw: string): unknown {
  const cleaned = raw.replace(/```[a-z]*|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function generateNames(
  input: string,
  type: QueryType,
  exclude: string[],
): Promise<string[]> {
  const prompt = buildPrompt(input, type, exclude);
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  const raw = response.text ?? "";
  const parsed = extractJsonArray(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((n): n is string => typeof n === "string");
}
