"use client";

const SCRIPT_SRC = "https://js.puter.com/v2/";
const SCRIPT_ID = "puter-js";
const READY_TIMEOUT_MS = 6_000;

type PuterChatResponse = {
  message?: { content?: string | Array<{ text?: string }> };
  text?: string;
};

type PuterChatOpts = {
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
};

type PuterAI = {
  chat: (
    prompt: string,
    opts?: PuterChatOpts,
  ) => Promise<PuterChatResponse>;
};

export type PuterGlobal = { ai: PuterAI };

declare global {
  interface Window {
    puter?: PuterGlobal;
  }
}

function loadScriptOnce(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Puter is browser-only"));
  }
  if (window.puter) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Puter.js")),
        { once: true },
      );
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Puter.js"));
    document.head.appendChild(s);
  });
}

export async function ensurePuter(): Promise<PuterGlobal> {
  await loadScriptOnce();
  if (window.puter) return window.puter;
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (window.puter) return resolve(window.puter);
      if (Date.now() - start > READY_TIMEOUT_MS) {
        return reject(new Error("Puter.js did not initialise in time"));
      }
      setTimeout(tick, 80);
    };
    tick();
  });
}

function readContent(response: PuterChatResponse): string {
  if (typeof response.text === "string") return response.text;
  const c = response.message?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) return c.map((p) => p.text ?? "").join("");
  return "";
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

export function parseNamesFromResponse(response: PuterChatResponse): string[] {
  const raw = readContent(response);
  const parsed = extractJsonArray(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((n): n is string => typeof n === "string");
}

const PER_MODEL_TIMEOUT_MS = 8_000;

export async function chatWithTimeout(
  puter: PuterGlobal,
  prompt: string,
  model: string,
  timeoutMs: number = PER_MODEL_TIMEOUT_MS,
): Promise<PuterChatResponse> {
  return Promise.race([
    puter.ai.chat(prompt, { model }),
    new Promise<PuterChatResponse>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Puter model ${model} timed out after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}
