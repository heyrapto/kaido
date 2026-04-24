"use client";

import type { DomainResult } from "@/app/lib/types";

const PILL_LABEL = {
  checking: "checking…",
  available: "✓ available",
  taken: "✗ taken",
} as const;

const PILL_CLASS = {
  checking: "p-checking",
  available: "p-avail",
  taken: "p-taken",
} as const;

export function ResultCard({ result }: { result: DomainResult }) {
  const { name, status } = result;
  const isAvail = status === "available";

  return (
    <div className={`ncard ${isAvail ? "avail" : ""}`.trim()}>
      <div className="dname">
        {name}
        <span className="dext">.com</span>
      </div>
      <span className={`pill ${PILL_CLASS[status]}`}>{PILL_LABEL[status]}</span>
      {isAvail && (
        <a
          className="reg-link"
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
