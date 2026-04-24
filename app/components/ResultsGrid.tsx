"use client";

import { useKaidoStore } from "@/app/store/kaido";
import { ResultCard } from "@/app/components/ResultCard";
import { Spinner } from "@/app/components/ui/Spinner";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { ErrorBanner } from "@/app/components/ui/ErrorBanner";

const MAX_ATTEMPTS = 5;
const TARGET_AVAILABLE = 3;

function buildLabel(
  status: ReturnType<typeof useKaidoStore.getState>["status"],
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
  const error = useKaidoStore((s) => s.error);

  if (status === "idle") return null;

  const total = results.length;
  const availableCount = results.filter((r) => r.status === "available").length;
  const checkingCount = results.filter((r) => r.status === "checking").length;

  const showInitialSpinner = status === "generating" && total === 0;
  const showError = status === "error" && total === 0;

  let retryNote = "";
  if (status === "error" && error) {
    retryNote = "";
  } else if (status === "done") {
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
    <div className="section" style={{ marginTop: "2rem" }}>
      <div className="slabel">
        {buildLabel(status, total, availableCount, checkingCount)}
      </div>
      <div className="grid">
        {showInitialSpinner && <Spinner label="asking ai for non-boring names…" />}
        {showError && error && <ErrorBanner message={error} />}
        {!showError && !showInitialSpinner && total === 0 && status !== "generating" && (
          <EmptyState message="No good names this round — try a different description." />
        )}
        {results.map((r) => (
          <ResultCard key={r.name} result={r} />
        ))}
      </div>
      {retryNote && <div className="retry-note">{retryNote}</div>}
    </div>
  );
}
