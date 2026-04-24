import { COMMON_WORDS, KNOWN_BRANDS } from "@/app/lib/blocklist";

const BAD_SUFFIXES = ["ify", "ily", "net", "xpro", "hq"];
const BAD_WORDS = ["boost", "smart", "tech", "quantum", "nexus", "synergy", "flux"];

export function isGoodName(name: string): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  if (n.length < 3 || n.length > 12) return false;
  if (/\d/.test(n)) return false;
  if (/[^a-z]/.test(n)) return false;
  if (BAD_SUFFIXES.some((s) => n.endsWith(s))) return false;
  if (BAD_WORDS.some((b) => n.includes(b))) return false;
  if (COMMON_WORDS.has(n)) return false;
  if (KNOWN_BRANDS.has(n)) return false;
  return true;
}

export function filterNames(names: unknown, alreadyTried: string[]): string[] {
  if (!Array.isArray(names)) return [];
  const tried = new Set(alreadyTried.map((n) => n.toLowerCase()));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    if (typeof raw !== "string") continue;
    const n = raw.trim().toLowerCase();
    if (!isGoodName(n)) continue;
    if (tried.has(n) || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}
