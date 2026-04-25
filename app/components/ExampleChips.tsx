"use client";

import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";

type Chip = { label: string; value: string };

const CHIPS_BY_MODE: Record<QueryType, Chip[]> = {
  idea: [
    { label: "minimal markdown editor", value: "a minimal markdown editor for developers" },
    { label: "budgeting for freelancers", value: "a budgeting app for freelancers" },
    { label: "tiny crm for solo founders", value: "a lightweight CRM for solo founders" },
    { label: "habit tracker", value: "a quiet, gentle habit tracker" },
  ],
  competitor: [
    { label: "Linear", value: "Linear" },
    { label: "Notion", value: "Notion" },
    { label: "Vercel", value: "Vercel" },
    { label: "Figma", value: "Figma" },
    { label: "Loom", value: "Loom" },
  ],
  seed: [
    { label: "arc", value: "arc" },
    { label: "drift", value: "drift" },
    { label: "luna", value: "luna" },
    { label: "fern", value: "fern" },
    { label: "ember", value: "ember" },
  ],
};

export function ExampleChips() {
  const queryType = useKaidoStore((s) => s.queryType);
  const setQuery = useKaidoStore((s) => s.setQuery);
  const chips = CHIPS_BY_MODE[queryType];

  return (
    <div className="mt-4 flex max-w-[560px] flex-wrap gap-[6px]">
      <span className="mr-[2px] self-center text-[10px] text-[color:var(--placeholder)]">
        try:
      </span>
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          className="cursor-pointer rounded-[6px] border border-[color:var(--chip-border)] bg-[var(--hover-tint)] px-[10px] py-1 text-[10px] tracking-[0.02em] text-[color:var(--muted)] transition-all hover:bg-[var(--hover-tint-2)] hover:text-[color:var(--text)]"
          onClick={() => setQuery(c.value)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
