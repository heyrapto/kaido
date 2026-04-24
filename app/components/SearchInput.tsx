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

export function SearchInput({ onSubmit }: { onSubmit: () => void }) {
  const query = useKaidoStore((s) => s.query);
  const queryType = useKaidoStore((s) => s.queryType);
  const status = useKaidoStore((s) => s.status);
  const setQuery = useKaidoStore((s) => s.setQuery);
  const setQueryType = useKaidoStore((s) => s.setQueryType);

  const busy = status === "generating" || status === "checking";
  const canSubmit = query.trim().length > 0 && !busy;

  return (
    <div className="card">
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`tab ${queryType === t.value ? "on" : ""}`.trim()}
            onClick={() => setQueryType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="divider" />
      <textarea
        className="qinput"
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
      <div className="btn-row">
        <span className="char-hint">
          {query.length > 0 ? `${query.length} chars` : ""}
        </span>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          find names →
        </Button>
      </div>
    </div>
  );
}
