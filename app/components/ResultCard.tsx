"use client";

import type { DomainResult } from "@/app/lib/types";

const PILL_LABEL = {
  checking: "checking…",
  available: "✓ available",
  taken: "✗ taken",
} as const;

const PILL_CLASS = {
  checking: "pill-checking",
  available: "pill-avail",
  taken: "pill-taken",
} as const;

export function ResultCard({ result }: { result: DomainResult }) {
  const { name, status } = result;
  const isAvail = status === "available";

  return (
    <div
      className={[
        "rounded-[11px] border p-4 transition-colors",
        isAvail
          ? "border-[color:var(--available-border)] bg-[var(--available-surface)]"
          : "border-[color:var(--border)] bg-[var(--surface)]",
      ].join(" ")}
    >
      <div className="font-[family-name:var(--font-display)] text-[18px] font-medium text-[color:var(--text)]">
        {name}
        <span className="text-[13px] text-[color:var(--subtle)]">.com</span>
      </div>
      <span
        className={`mt-[9px] inline-block rounded-[20px] px-[9px] py-[2px] text-[10px] tracking-[0.03em] ${PILL_CLASS[status]}`}
      >
        {PILL_LABEL[status]}
      </span>
      {isAvail && (
        <a
          className="mt-[6px] block text-[10px] text-[color:var(--accent)] no-underline hover:underline"
          href={`https://www.namecheap.com/domains/registration/results/?domain=${name}.com`}
          target="_blank"
          rel="noopener noreferrer"
        >
          register →
        </a>
      )}
    </div>
  );
}
