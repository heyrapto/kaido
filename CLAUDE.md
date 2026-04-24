# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

**Kaido** is a Next.js (App Router) + Elysia domain/project name generator. Given a project idea, a competitor's name, or an existing name to riff on, it uses the Gemini API to produce tasteful, non-boring name candidates, then checks each for `.com` availability via the API-Ninjas domain endpoint. It retries with entirely new name sets until it surfaces 3 available, good-looking names. Speed is the primary UX goal — all generation and availability checks are parallelised.

### Directory layout

```
app/
├── api/
│   ├── generate/route.ts        # POST — calls Gemini, returns name candidates
│   └── availability/route.ts    # POST — checks domain availability via API-Ninjas
├── layout.tsx                   # Root layout with ZustandProvider + font variables
├── page.tsx                     # Single-page UI (input + results)
├── globals.css                  # CSS variables, font-face imports, base reset
├── components/
│   ├── SearchInput.tsx          # Tabbed input card (idea / competitor / seed)
│   ├── ResultCard.tsx           # Single domain result (name + availability pill)
│   ├── ResultsGrid.tsx          # Animated grid of ResultCards
│   ├── ExampleChips.tsx         # Quick-fill suggestion chips below the search card
│   └── ui/                      # Button, Spinner, EmptyState, ErrorBanner
├── store/
│   └── kaido.ts                 # Zustand store: input, results, loading, error state
├── hooks/
│   └── useNameSearch.ts         # Orchestration hook: generate → check → retry loop
├── lib/
│   ├── gemini.ts                # Gemini API client (gemini-2.5-flash, GoogleGenAI SDK)
│   ├── domain.ts                # API-Ninjas domain availability wrapper
│   └── quality.ts               # Name quality filter (rejects TechBoostifyly-style names)
└── config/
    └── prompts.ts               # Gemini system + user prompt templates
```

### Core flow

1. User submits an **idea string**, a **competitor name**, or a **seed name** (toggled via tabs).
2. `useNameSearch` calls `POST /api/generate` → Gemini returns 8 raw name candidates as a JSON array.
3. `quality.ts` filters out names that fail the non-boring heuristic (see below).
4. Filtered names are immediately rendered as cards in a **checking** state.
5. All domain checks fire in parallel via `Promise.all` — cards update to `available` or `taken` as results arrive.
6. If fewer than 3 names come back available, the hook calls `/api/generate` again with all previous names passed as negative context so Gemini never repeats itself.
7. Loop continues until 3 available names are found or a max-retry limit (5) is hit.
8. A retry note below the grid tells the user how many rounds it took.

### State management

A single Zustand store (`app/store/kaido.ts`) owns all state:

| Field | Type | Purpose |
|---|---|---|
| `query` | `string` | Current user input |
| `queryType` | `'idea' \| 'competitor' \| 'seed'` | Selected input mode |
| `results` | `DomainResult[]` | All name cards surfaced so far |
| `status` | `'idle' \| 'generating' \| 'checking' \| 'done' \| 'error'` | UI phase |
| `attempts` | `number` | Retry count (shown in the retry note) |
| `allTried` | `string[]` | Accumulates every name ever generated to exclude on retry |
| `error` | `string \| null` | Error message |

Never call Gemini or API-Ninjas directly from components — go through the Zustand actions or `useNameSearch`.

### AI — Gemini

- **Model**: `gemini-2.5-flash` (fast, free tier sufficient)
- **SDK**: `@google/genai` — import `GoogleGenAI` from it
- **Key**: set as `GEMINI_API_KEY` in `.env.local`; never hardcode
- All prompt logic lives in `app/config/prompts.ts`; the route handler in `app/api/generate/route.ts` is a thin wrapper
- Ask Gemini to return **JSON only** — a lowercase array of plain strings, no explanations, no markdown fences
- Pass previously generated names in the prompt as `exclude` so retries are genuinely different

Prompt shape (from `prompts.ts`):

```ts
const ctx = {
  idea:       `The user has a project idea: "${input}"`,
  competitor: `The user wants names with a similar feel to the brand: "${input}"`,
  seed:       `The user likes the vibe of the word/name "${input}" and wants related names`,
};

export function buildPrompt(input: string, type: QueryType, exclude: string[]): string {
  return `
You are a naming expert with exceptional taste. Generate 8 short, memorable project or startup names.

${ctx[type]}

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
```

### Domain availability — API-Ninjas

- **Endpoint**: `GET https://api.api-ninjas.com/v1/domain?domain=<n>.com`
- **Header**: `X-Api-Key: <NINJA_API_KEY>`
- **Key**: set as `NINJA_API_KEY` in `.env.local`
- Wrapper lives in `app/lib/domain.ts`; accepts an array of names, resolves with `DomainResult[]`
- Always append `.com` — other TLDs require a paid plan
- Run all checks in parallel: `Promise.all(names.map(checkDomain))`

```ts
// app/lib/domain.ts
export async function checkDomain(name: string): Promise<DomainResult> {
  const res = await fetch(
    `https://api.api-ninjas.com/v1/domain?domain=${name}.com`,
    { headers: { "X-Api-Key": process.env.NINJA_API_KEY! } }
  );
  const data = await res.json();
  return { name, domain: `${name}.com`, available: data.available };
}
```

### Name quality filter

`app/lib/quality.ts` exports `isGoodName(name: string): boolean`. A name passes if:

- Length between 3 and 12 characters
- No digits
- Does not end in `ify`, `ily`, `net`, `xpro`, or `hq`
- Does not contain: `boost`, `smart`, `tech`, `quantum`, `nexus`, `synergy`, `flux`

The filter runs **before** domain checks to avoid wasting API quota on junk names.

### Environment variables

```
GEMINI_API_KEY=...        # Gemini API key
NINJA_API_KEY=...         # API-Ninjas key (domain availability)
```

---

## Design system

### Personality

Kaido feels like a tool built by someone with taste. Warm, minimal, and editorial — closer to a well-designed notebook than a SaaS product. The headline leans into the problem with a bit of wit (*"Stop naming it TechBoostifyly."*). Every element earns its place.

### Colours

Defined as CSS variables in `app/globals.css`. Use these — never hardcode hex values.

```css
:root {
  --bg:           #FDFAF5;              /* warm parchment white — page background */
  --surface:      #FFFFFF;              /* card / input surfaces */
  --text:         #1C1612;              /* warm near-black — primary text */
  --muted:        #9A8D80;              /* secondary text, labels, hints */
  --subtle:       #B0A497;              /* placeholder, disabled states */
  --border:       rgba(28,22,18,0.09);  /* default border */
  --border-soft:  rgba(28,22,18,0.06);  /* dividers inside cards */
  --accent:       #C2490A;              /* burnt sienna — CTAs, logo dot, highlights */
  --available:    #2D7D46;              /* available pill text */
  --available-bg: #EBF5EE;              /* available pill background */
  --taken:        #B33A2A;              /* taken pill text */
  --taken-bg:     #FBF0EE;              /* taken pill background */
  --checking-bg:  #F5EDE5;              /* checking pill background */
}
```

### Typography

Fonts loaded via `@fontsource` packages (served from `cdn.jsdelivr.net`) — no Google Fonts dependency.

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / logo | `Fraunces` | 500, 700 italic | Page headline, logo, domain names on result cards |
| UI / body | `DM Mono` | 400, 500 | All other text: tabs, buttons, labels, inputs, pills |

```css
/* app/globals.css */
@import url('https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5/400-italic.css');
@import url('https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5/500.css');
@import url('https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5/700-italic.css');
@import url('https://cdn.jsdelivr.net/npm/@fontsource/dm-mono@5/400.css');
@import url('https://cdn.jsdelivr.net/npm/@fontsource/dm-mono@5/500.css');

--font-display: 'Fraunces', Georgia, 'Book Antiqua', serif;
--font-ui:      'DM Mono', 'Courier New', monospace;
```

Apply `font-family: var(--font-display)` to: logo, `h1`, domain names inside result cards.
Apply `font-family: var(--font-ui)` to everything else (body, tabs, buttons, inputs, pills).

### Layout

Single full-width page. All content is left-aligned and capped at `max-width: 560px`. The page has `padding: 2rem 2rem 3rem` on a `--bg` background.

Structure top-to-bottom:

```
topbar        (logo left, tagline right)
hero          (h1 + subheading paragraph)
search card   (tabs + textarea + button)
example chips (quick-fill suggestions)
results       (label + card grid + retry note)
```

### Components

**Topbar** — `display: flex; justify-content: space-between`. Logo in `--font-display` 700 italic 24px. The trailing dot on `kaido.` is coloured `--accent`. Tagline in `--font-ui` 10px uppercase `--subtle`.

**Hero headline** — `--font-display` 500 36px, `line-height: 1.12`. The phrase *"TechBoostifyly."* is wrapped in `<em>` coloured `--accent`. Subheading below in `--font-ui` 12px `--muted`, `max-width: 380px`, `line-height: 1.8`.

**Search card** — `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 14px`, `padding: 1.25rem`. Contains tabs, a thin divider, textarea, and the button row.

**Tabs** — three pills: `idea`, `competitor`, `seed name`. `--font-ui` 11px. Inactive: transparent bg, `--subtle` text. Active: `--text` background, `--bg` text. `border-radius: 7px`, `padding: 5px 13px`.

**Textarea** — borderless, transparent bg, `--font-ui` 13px, `--text` colour. Placeholder in `--subtle`. `min-height: 72px`, `line-height: 1.75`. No resize handle (`resize: none`).

**Button row** — `display: flex; justify-content: space-between; align-items: center`. Left: live character count in `--font-ui` 10px `--subtle`. Right: CTA button. Separated from textarea by a `1px solid var(--border-soft)` divider with `padding-top: 0.75rem`.

**CTA button** — `background: var(--accent)`, `color: var(--bg)`, `--font-ui` 12px 500, `border-radius: 8px`, `padding: 8px 20px`. Label: `find names →`. Hover: `opacity: 0.85`. Disabled: `opacity: 0.45`.

**Example chips** — small pill buttons rendered below the search card. `--font-ui` 10px, `background: rgba(28,22,18,0.05)`, `border: 1px solid var(--border)`, `border-radius: 6px`, `padding: 4px 10px`. Clicking one fills the textarea and auto-selects the correct mode tab. Prefixed with a faint `try:` label in `--subtle`.

**Results section** — revealed after first generation. Section label in `--font-ui` 10px uppercase `--muted`, updated live (e.g. `"checking 8 names…"` → `"3 available names found"`). Cards in `display: grid; grid-template-columns: repeat(auto-fill, minmax(158px, 1fr)); gap: 10px`.

**Result card** — `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 11px`, `padding: 1rem`. Domain name in `--font-display` 500 18px with `.com` extension in `--muted` 13px. Availability pill below. When `available`: card border becomes `rgba(42,125,70,0.28)`, background tints to `#FAFDF9`, and a `register →` link in `--accent` 10px appears at the bottom pointing to Namecheap. Card states transition in-place without re-mounting.

**Availability pills** — `font-size: 10px`, `border-radius: 20px`, `padding: 2px 9px`:

| State | Background | Text | Label |
|---|---|---|---|
| Checking | `--checking-bg` | `--muted` | `checking…` |
| Available | `--available-bg` | `--available` | `✓ available` |
| Taken | `--taken-bg` | `--taken` | `✗ taken` |

**Loading animation** — three 5px circles coloured `--accent` with a staggered `translateY` bounce (`animation: bop 1.3s infinite`, delays 0s / 0.18s / 0.36s). Rendered at `grid-column: 1 / -1` so it spans the full grid width. Accompanied by the copy `"asking ai for non-boring names…"` in `--font-ui` 12px `--muted`.

**Retry note** — `--font-ui` 11px italic `--muted`, rendered below the grid. Shows `"Only N available so far — generating a fresh batch…"` during active retries and `"Found after N rounds of generation."` on completion. Empty string when done on the first attempt.

### Tailwind usage

Use Tailwind for spacing, flex/grid layout, and responsive breakpoints. For anything touching brand colour, typography, or border-radius — use the CSS variables above rather than Tailwind colour/font classes. This keeps the entire visual identity in one place (`globals.css`).

### Hard rules

- No dark backgrounds anywhere on this page
- No fonts other than Fraunces and DM Mono
- No drop shadows, gradients, or blur effects
- No hardcoded colour hex values — always use a CSS variable
- Cards must render immediately in the `checking` state and update in-place — never hold back results until all checks are done

---

## Performance rules

- **Never await sequentially** when checks can be parallelised — use `Promise.all`
- Render name cards immediately in the `checking` state; update them in-place as API-Ninjas responds
- The Gemini call + quality filter should complete in under 1 s; domain checks in under 2 s per batch
- Target: user sees the first card update within 3 s of hitting the button
- Pass all previously tried names as `exclude` on every retry — Gemini must never repeat a name within a session
