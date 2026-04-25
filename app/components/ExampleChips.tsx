"use client";

import {
  LuFileText,
  LuWallet,
  LuUsers,
  LuLeaf,
  LuLayers,
  LuMoon,
} from "react-icons/lu";
import type { ComponentType } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";

type Chip = {
  label: string;
  value: string;
  type: QueryType;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

const CHIPS: Chip[] = [
  { label: "Markdown editor", value: "a minimal markdown editor for developers", type: "idea", Icon: LuFileText },
  { label: "Budget app", value: "a budgeting app for freelancers", type: "idea", Icon: LuWallet },
  { label: "CRM tool", value: "a lightweight CRM for solo founders", type: "idea", Icon: LuUsers },
  { label: "Habit tracker", value: "a quiet, gentle habit tracker", type: "idea", Icon: LuLeaf },
  { label: "Linear-like", value: "Linear", type: "competitor", Icon: LuLayers },
  { label: "Vibe of luna", value: "luna", type: "seed", Icon: LuMoon },
];

export function ExampleChips() {
  const setQuery = useKaidoStore((s) => s.setQuery);
  const setQueryType = useKaidoStore((s) => s.setQueryType);

  return (
    <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3">
      {CHIPS.map(({ label, value, type, Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => {
            setQueryType(type);
            setQuery(value);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--chip-border)] bg-[color:var(--surface)]/60 px-[14px] text-[12px] text-[color:var(--text)] transition-colors hover:bg-[color:var(--surface)]"
        >
          <Icon size={14} className="text-[color:var(--muted)]" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
