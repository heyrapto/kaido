"use client";

import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";

type Chip = { label: string; value: string; type: QueryType };

const CHIPS: Chip[] = [
  { label: "minimal markdown editor", value: "a minimal markdown editor for developers", type: "idea" },
  { label: "Linear", value: "Linear", type: "competitor" },
  { label: "arc", value: "arc", type: "seed" },
  { label: "budgeting for freelancers", value: "a budgeting app for freelancers", type: "idea" },
  { label: "Notion", value: "Notion", type: "competitor" },
];

export function ExampleChips() {
  const setQuery = useKaidoStore((s) => s.setQuery);
  const setQueryType = useKaidoStore((s) => s.setQueryType);

  return (
    <div className="mt-4 flex max-w-[560px] flex-wrap gap-[6px]">
      <span className="mr-[2px] self-center text-[10px] text-[color:var(--placeholder)]">
        try:
      </span>
      {CHIPS.map((c) => (
        <button
          key={c.label}
          type="button"
          className="cursor-pointer rounded-[6px] border border-[color:var(--chip-border)] bg-[var(--hover-tint)] px-[10px] py-1 text-[10px] tracking-[0.02em] text-[color:var(--muted)] transition-all hover:bg-[var(--hover-tint-2)] hover:text-[color:var(--text)]"
          onClick={() => {
            setQuery(c.value);
            setQueryType(c.type);
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
