const WORD_RE = /^[a-z]{3,14}$/i;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function isSingleWord(s: string): boolean {
  return WORD_RE.test(s);
}

function reverseWord(s: string): string {
  return s.split("").reverse().join("");
}

function dropInnerVowels(s: string): string {
  const chars = s.split("");
  return chars
    .filter((c, i) => {
      if (i === 0 || i === chars.length - 1) return true;
      return !/[aeiou]/.test(c);
    })
    .join("");
}

function softSuffixes(s: string): string[] {
  const base = s.replace(/[aeiouy]+$/i, "") || s;
  return ["o", "a", "io", "ia", "ora", "elle"].map((suf) => base + suf);
}

/**
 * Vowel-preserving consonant shuffle. Keeps each vowel in its original
 * position and shuffles only the consonants — output stays pronounceable
 * (canva → navca, facebook → bacekoof) instead of producing junk like
 * "oofkabec" that a full Fisher–Yates scramble would.
 */
function scramble(s: string, seed: number): string {
  const chars = s.split("");
  const consIdx: number[] = [];
  const cons: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (!/[aeiouy]/.test(chars[i])) {
      consIdx.push(i);
      cons.push(chars[i]);
    }
  }
  if (cons.length < 2) return s;

  let rnd = Math.sin(seed) * 10000;
  const next = () => {
    rnd = Math.sin(rnd * 9301 + 49297) * 10000;
    return Math.abs(rnd - Math.floor(rnd));
  };
  for (let i = cons.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [cons[i], cons[j]] = [cons[j], cons[i]];
  }
  for (let i = 0; i < consIdx.length; i++) {
    chars[consIdx[i]] = cons[i];
  }
  return chars.join("");
}

export function isPronounceable(s: string): boolean {
  if (!/[aeiouy]/.test(s)) return false;
  if (/[^aeiouy]{4,}/.test(s)) return false;
  if (/[aeiouy]{4,}/.test(s)) return false;
  return true;
}

/**
 * Deterministic creative mutations of a single-word input.
 *
 * Returns a small set of diverse, pronounceable variants drawn from different
 * transformation families (reversal, vowel-drop, suffix, scramble). Returns
 * an empty array for multi-word or non-alphabetic inputs.
 */
export function creativeVariants(input: string, seed: number = Date.now()): string[] {
  const word = normalize(input);
  if (!isSingleWord(word)) return [];

  const candidates: string[] = [];

  candidates.push(reverseWord(word));

  const vowelDropped = dropInnerVowels(word);
  if (vowelDropped !== word) candidates.push(vowelDropped);

  const [suf1, suf2] = softSuffixes(word);
  if (suf1) candidates.push(suf1);
  if (suf2) candidates.push(suf2);

  candidates.push(scramble(word, seed));
  candidates.push(scramble(word, seed * 13 + 7));

  const seen = new Set<string>([word]);
  const out: string[] = [];
  for (const v of candidates) {
    if (seen.has(v)) continue;
    if (v.length < 3 || v.length > 10) continue;
    if (!isPronounceable(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out.slice(0, 4);
}
