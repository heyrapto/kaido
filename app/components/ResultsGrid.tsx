"use client";

import { useState } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import { ResultCard } from "@/app/components/ResultCard";
import { Spinner } from "@/app/components/ui/Spinner";



type Status = ReturnType<typeof useKaidoStore.getState>["status"];
type Filter = "all" | "available" | "taken";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "available", label: "available" },
  { value: "taken", label: "taken" },
];

const FILTER_BASE =
  "text-[10px] px-[9px] py-[3px] rounded-[6px] border border-transparent cursor-pointer transition-all tracking-[0.02em]";
const FILTER_INACTIVE =
  "bg-transparent text-[color:var(--subtle)] hover:bg-[var(--hover-tint)] hover:text-[color:var(--text)]";

function buildLabel(
  status: Status,
  total: number,
  availableCount: number,
  checkingCount: number,
  unknownCount: number,
): string {
  if (status === "generating") return "thinking…";
  if (status === "error") return "error";
  const availPhrase = `${availableCount} available name${availableCount !== 1 ? "s" : ""} found`;
  const unknownSuffix =
    unknownCount > 0
      ? ` · ${unknownCount} lookup${unknownCount !== 1 ? "s" : ""} incomplete`
      : "";
  if (status === "checking") {
    if (checkingCount > 0) {
      return `checking ${total} name${total !== 1 ? "s" : ""}…`;
    }
    return `${availPhrase}${unknownSuffix}`;
  }
  if (status === "done") {
    return `${availPhrase}${unknownSuffix}`;
  }
  return "results";
}

export function ResultsGrid() {
  const status = useKaidoStore((s) => s.status);
  const results = useKaidoStore((s) => s.results);
  const attempts = useKaidoStore((s) => s.attempts);

  const [filter, setFilter] = useState<Filter>("available");

  if (status === "idle") return null;

  const total = results.length;
  const availableCount = results.filter((r) => r.status === "available").length;
  const checkingCount = results.filter((r) => r.status === "checking").length;
  const unknownCount = results.filter((r) => r.status === "unknown").length;

  const showInitialSpinner = status === "generating" && total === 0;

  const visible =
    filter === "all"
      ? results
      : results.filter((r) =>
          filter === "available"
            ? r.status === "available" || r.status === "checking"
            : r.status === "taken",
        );

  const showFilter = total > 0;
  const filterEmpty = total > 0 && visible.length === 0 && !showInitialSpinner;

  let retryNote = "";
  if (status === "done" && attempts > 3) {
    retryNote = `Found after ${Math.ceil(attempts / 3)} rounds of generation.`;
  }

  return (
    <div className="mt-12 w-full text-left">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.1em] text-[color:var(--muted)]">
          {buildLabel(status, total, availableCount, checkingCount, unknownCount)}
        </div>
        {showFilter && (
          <div className="flex gap-[2px]">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`${FILTER_BASE} ${filter === f.value ? "tab-on" : FILTER_INACTIVE}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {showInitialSpinner && <Spinner label="asking ai for non-boring names…" />}
        {visible.map((r) => (
          <ResultCard key={r.name} result={r} />
        ))}
        {filterEmpty && (
          <div className="col-span-full py-2 text-[11px] italic text-[color:var(--subtle)]">
            no {filter} names {status === "checking" ? "yet" : "in this batch"}.
          </div>
        )}
      </div>
      {retryNote && (
        <div className="mt-4 text-[11px] italic text-[color:var(--subtle)]">
          {retryNote}
        </div>
      )}
    </div>
  );
}
