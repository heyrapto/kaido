# kaido

> *names worth keeping*

Stop naming it **TechBoostifyly.** Kaido is a Next.js + Gemini name generator that helps you find a tasteful, available `.com` for your project — fast.

Describe an idea, paste a competitor, or drop a seed word; Kaido proposes 8–12 candidates, runs them through a quality filter, then checks `.com` availability in parallel. If fewer than 3 are free, it retries with new prompts until it surfaces a usable shortlist.

---

## Quickstart

```bash
git clone https://github.com/heyrapto/kaido.git
cd kaido
npm install
cp .env.local.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open <http://localhost:3000>.

### Environment

| Var | Required | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | yes | <https://aistudio.google.com/apikey> |

That's it. Domain availability uses the free Verisign **RDAP** service — no key, no signup.

---

## How a search runs

```
input ──▶ /api/generate ──▶ Gemini (8 candidates)
                       └─▶ creative variants  (reverse, vowel-drop, suffix, scramble)
                       └─▶ niche corpus       (obscure Pokémon, mythology, anime, gems)
                       └─▶ invented compounds (prefix + suffix syllable bank)
                              │
                              ▼
                       quality filter  ──▶  /api/availability  ──▶  RDAP
                              │
                              ▼
                          card grid (renders in `checking` state, updates in place)
```

If after **3 rounds** there are still fewer than 3 available names, Kaido pauses and asks via modal whether to keep going or stop. Hard cap at 5 rounds.

### Why four name sources?

LLM output alone is heavily biased toward tasteful dictionary words — and tasteful dictionary words on `.com` are virtually all squatted. Each source covers a different gap:

| Source | What it does | Typical hit rate vs RDAP |
|---|---|---|
| **Gemini 2.5 Flash** | Generates 8 thematic candidates per round | ~10% |
| **Creative variants** | For competitor/seed input: reverse (`canva → avnac`), inner-vowel drop (`tumblr`), soft suffixes, vowel-preserving consonant scramble | ~25% |
| **Curated corpus** | Hand-picked niche names from obscure Pokémon, minor mythology, less-mainstream anime, Japanese natural-world words, lesser-known stars, uncommon gems | ~12% |
| **Invented compounds** | Runtime prefix + suffix syllable bank (6–10 chars) — never-before-registered combinations | ~33% |

The compound generator is the highest-leverage source. Squatters can't pre-register what doesn't exist yet.

---

## Project layout

```
app/
├── api/
│   ├── generate/route.ts        Gemini + variants + corpus + invented
│   └── availability/route.ts    RDAP availability check
├── components/
│   ├── SearchInput.tsx          Tabbed input (idea / competitor / seed)
│   ├── ExampleChips.tsx         Quick-fill suggestions, mode-aware
│   ├── ResultCard.tsx           Single domain card
│   ├── ResultsGrid.tsx          Animated grid of cards
│   ├── Footer.tsx               Social links via react-icons
│   └── ui/
│       ├── Button.tsx
│       ├── Spinner.tsx
│       ├── Toast.tsx, Toaster.tsx     Glass toast queue
│       ├── Modal.tsx                  Glass dialog (incl. confirm())
│       └── icons/                     Animated SVG warning / check / info
├── hooks/
│   └── useNameSearch.ts         Generate → check → retry loop
├── lib/
│   ├── gemini.ts                @google/genai client (gemini-2.5-flash)
│   ├── domain.ts                RDAP wrapper, Promise.allSettled
│   ├── quality.ts               Length + suffix + blocklist filter
│   ├── blocklist.ts             COMMON_WORDS + KNOWN_BRANDS sets
│   ├── mutate.ts                creativeVariants, isPronounceable
│   └── corpus.ts                COOL_WORDS + pickFromCorpus + pickInvented
├── store/
│   ├── kaido.ts                 Search state (query, results, status, attempts)
│   ├── toast.ts                 Toast queue + toast.error/success/info
│   └── modal.ts                 Modal payload + modal.confirm() promise
├── config/
│   └── prompts.ts               Gemini prompt builder
├── globals.css                  CSS vars, glass surface, keyframes
├── layout.tsx                   Mounts <Toaster /> + <Modal />
└── page.tsx                     Single-page UI
```

---

## Stack

- **Next.js 15** (App Router, React 19)
- **Gemini 2.5 Flash** via `@google/genai`
- **Verisign RDAP** for domain availability (free, no key)
- **Zustand** for state
- **Tailwind v3** for layout/spacing; CSS variables for brand colors, fonts, radii
- **Fraunces + DM Mono** via `@fontsource` (jsdelivr)
- **react-icons** for social glyphs

---

## Design system

Warm parchment-on-paper, editorial. Accent is a single burnt sienna (`#C2490A`). No dark backgrounds, no drop shadows, no gradients. The only blur in the codebase is the toast/modal glass surface — used sparingly so it still reads editorial rather than iOS-y.

Everything brand-related lives in `app/globals.css` as CSS variables; component classes use Tailwind utilities + arbitrary-value refs (`bg-[var(--surface)]`, `text-[color:var(--text)]`, `font-[family-name:var(--font-display)]`).

---

## Made by

Caleb Kalejaiye — [x.com/heyrapto](https://x.com/heyrapto) · [linkedin](https://www.linkedin.com/in/caleb-kalejaiye-5a0730403/) · [github](https://github.com/heyrapto)

Source: <https://github.com/heyrapto/kaido>
