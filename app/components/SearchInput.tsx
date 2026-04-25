"use client";

import {
  LuLightbulb,
  LuTarget,
  LuSprout,
  LuArrowUp,
  LuMic,
} from "react-icons/lu";
import type { ComponentType } from "react";
import { useKaidoStore } from "@/app/store/kaido";
import type { QueryType } from "@/app/lib/types";

const PLACEHOLDERS: Record<QueryType, string> = {
  idea: "Describe your idea — e.g. a tool that helps developers write cleaner commit messages…",
  competitor: "Drop a competitor — e.g. Linear, Vercel, Notion…",
  seed: "Paste a seed name — e.g. drift, luna, fern…",
};

type ModeDef = {
  value: QueryType;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

const MODES: ModeDef[] = [
  { value: "idea", label: "Idea", Icon: LuLightbulb },
  { value: "competitor", label: "Competitor", Icon: LuTarget },
  { value: "seed", label: "Seed name", Icon: LuSprout },
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
    <div
      id="search"
      className="relative w-full overflow-hidden rounded-[16px] bg-[color:var(--prompt-bg)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_18px_40px_-20px_rgba(28,22,18,0.35)]"
    >
      <div className="flex min-h-[150px] items-start gap-2 px-5 pt-5">
        <textarea
          className="prompt-textarea h-[110px] w-full resize-none bg-transparent text-[15px] leading-[1.65] text-[color:var(--prompt-text)] outline-none placeholder:text-[color:var(--prompt-muted)]"
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
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-2">
          {MODES.map(({ value, label, Icon }) => {
            const active = queryType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setQueryType(value)}
                aria-pressed={active}
                title={label}
                className={[
                  "inline-flex h-9 items-center gap-2 rounded-[10px] border px-3 text-[12px] transition-all",
                  active
                    ? "border-white/15 bg-[color:var(--prompt-bg-alt)] text-[color:var(--prompt-text)]"
                    : "border-transparent bg-white/[0.04] text-[color:var(--prompt-muted)] hover:bg-white/[0.07] hover:text-[color:var(--prompt-text)]",
                ].join(" ")}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] tracking-[0.06em] text-[color:var(--prompt-muted)] md:inline">
            {query.length > 0 ? `${query.length} chars` : "⌘ + ↵"}
          </span>
          <button
            type="button"
            disabled
            aria-label="Voice input (coming soon)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.04] text-[color:var(--prompt-muted)] opacity-60"
          >
            <LuMic size={14} />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-label="Find names"
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-[10px] transition-all",
              canSubmit
                ? "bg-[color:var(--prompt-text)] text-[color:var(--prompt-bg)] hover:opacity-90"
                : "bg-white/[0.06] text-[color:var(--prompt-muted)]",
            ].join(" ")}
          >
            <LuArrowUp size={15} />
          </button>
        </div>
      </div>

      <div className="h-3 w-full bg-[color:var(--prompt-bg-alt)]/60 [mask-image:radial-gradient(circle_at_center,#000_30%,transparent_75%)]" />
    </div>
  );
}
