"use client";

import { useKaidoStore } from "@/app/store/kaido";
import { ResultCard } from "@/app/components/ResultCard";
import { Spinner } from "@/app/components/ui/Spinner";

const MAX_ATTEMPTS = 5;
const TARGET_AVAILABLE = 3;

type Status = ReturnType<typeof useKaidoStore.getState>["status"];

function buildLabel(
  status: Status,
  total: number,
  availableCount: number,
  checkingCount: number,
): string {
  if (status === "generating") return "thinking…";
  if (status === "error") return "error";
  if (status === "checking") {
    if (checkingCount > 0) {
      return `checking ${total} name${total !== 1 ? "s" : ""}…`;
    }
    return `${availableCount} available name${availableCount !== 1 ? "s" : ""} found`;
  }
  if (status === "done") {
    return `${availableCount} available name${availableCount !== 1 ? "s" : ""} found`;
  }
  return "results";
}

export function ResultsGrid() {
  const status = useKaidoStore((s) => s.status);
  const results = useKaidoStore((s) => s.results);
  const attempts = useKaidoStore((s) => s.attempts);

  if (status === "idle") return null;

  const total = results.length;
  const availableCount = results.filter((r) => r.status === "available").length;
  const checkingCount = results.filter((r) => r.status === "checking").length;

  const showInitialSpinner = status === "generating" && total === 0;

  let retryNote = "";
  if (status === "done") {
    retryNote = attempts > 1 ? `Found after ${attempts} rounds of generation.` : "";
  } else if (
    status === "checking" &&
    checkingCount === 0 &&
    availableCount < TARGET_AVAILABLE &&
    attempts > 0 &&
    attempts < MAX_ATTEMPTS
  ) {
    retryNote = `Only ${availableCount} available so far — generating a fresh batch…`;
  }

  return (
    <div className="mt-8 max-w-[560px]">
      <div className="mb-4 text-[10px] uppercase tracking-[0.1em] text-[color:var(--muted)]">
        {buildLabel(status, total, availableCount, checkingCount)}
      </div>
      <div className="grid gap-[10px] grid-cols-[repeat(auto-fill,minmax(158px,1fr))]">
        {showInitialSpinner && <Spinner label="asking ai for non-boring names…" />}
        {results.map((r) => (
          <ResultCard key={r.name} result={r} />
        ))}
      </div>
      {retryNote && (
        <div className="mt-4 text-[11px] italic text-[color:var(--subtle)]">
          {retryNote}
        </div>
      )}
    </div>
  );
}
