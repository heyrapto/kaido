"use client";

import { FaGithub } from "react-icons/fa6";

export function TopNav() {
  return (
    <header className="relative z-10 border-b border-[color:var(--border)]">
      <div className="mx-auto flex h-[64px] max-w-[1240px] items-center justify-between px-8">
        <a href="#" aria-label="kaido" className="flex items-center gap-2">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--text)]">
            <span className="block h-px w-3.5 bg-[color:var(--bg)]" />
            <span className="absolute inset-1 rounded-full border border-[color:var(--bg)]/30" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-[18px] font-bold italic tracking-[-0.02em] text-[color:var(--text)]">
            kaido<span className="text-[color:var(--accent)]">.</span>
          </span>
        </a>

        <div className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[color:var(--subtle)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          names worth keeping
        </div>

        <a
          href="https://github.com/heyrapto/kaido"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--hover-tint)] hover:text-[color:var(--text)]"
        >
          <FaGithub size={16} />
        </a>
      </div>
    </header>
  );
}
