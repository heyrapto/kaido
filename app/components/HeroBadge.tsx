"use client";

export function HeroBadge() {
  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface)] text-[12px]">
      <span className="flex items-center px-[14px] py-[7px] text-[color:var(--text)]">
        Introducing kaido
      </span>
      <a
        href="#search"
        className="flex items-center gap-1.5 bg-[color:var(--text)] px-[14px] py-[7px] text-[color:var(--bg)] transition-opacity hover:opacity-90"
      >
        Try now
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
