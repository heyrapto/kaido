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
    <div className="chips">
      <span className="chips-try">try:</span>
      {CHIPS.map((c) => (
        <button
          key={c.label}
          type="button"
          className="chip"
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
