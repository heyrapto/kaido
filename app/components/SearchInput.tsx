"use client";

import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";
import { Button } from "@/app/components/ui/Button";

const PLACEHOLDERS: Record<QueryType, string> = {
  idea: "e.g. a tool that helps developers write cleaner commit messages...",
  competitor: "e.g. Linear, Vercel, Notion...",
  seed: "e.g. drift, luna, fern...",
};

const TABS: { value: QueryType; label: string }[] = [
  { value: "idea", label: "idea" },
  { value: "competitor", label: "competitor" },
  { value: "seed", label: "seed name" },
];

const TAB_BASE =
  "text-[11px] px-[13px] py-[5px] rounded-[7px] border border-transparent cursor-pointer transition-all tracking-[0.01em]";
const TAB_INACTIVE =
  "bg-transparent text-[color:var(--subtle)] hover:bg-[var(--hover-tint)] hover:text-[color:var(--text)]";

export function SearchInput({ onSubmit }: { onSubmit: () => void }) {
  const query = useKaidoStore((s) => s.query);
  const queryType = useKaidoStore((s) => s.queryType);
  const status = useKaidoStore((s) => s.status);
  const setQuery = useKaidoStore((s) => s.setQuery);
  const setQueryType = useKaidoStore((s) => s.setQueryType);

  const busy = status === "generating" || status === "checking";
  const canSubmit = query.trim().length > 0 && !busy;

  return (
    <div className="max-w-[560px] rounded-[14px] border border-[color:var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-4 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`${TAB_BASE} ${queryType === t.value ? "tab-on" : TAB_INACTIVE}`}
            onClick={() => setQueryType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mb-4 h-px bg-[var(--border-soft)]" />
      <textarea
        className="min-h-[72px] w-full resize-none border-none bg-transparent text-[13px] leading-[1.75] text-[color:var(--text)] outline-none placeholder:text-[color:var(--placeholder)]"
        rows={3}
        placeholder={PLACEHOLDERS[queryType]}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="mt-3 flex items-center justify-between border-t border-[color:var(--border-soft)] pt-3">
        <span className="text-[10px] text-[color:var(--placeholder)]">
          {query.length > 0 ? `${query.length} chars` : ""}
        </span>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          find names →
        </Button>
      </div>
    </div>
  );
}
