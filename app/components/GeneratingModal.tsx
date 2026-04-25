"use client";

import { useEffect, useState } from "react";
import { useKaidoStore } from "@/app/store/kaido";

const MESSAGES = [
  "warming up the dictionary",
  "exploring short, sharp sounds",
  "rolling out the boring ones",
  "trying obscure roots and suffixes",
  "cross-checking what's still free",
  "almost there",
];

const GHOST_WORDS = ["drift", "luna", "ember", "fern", "arc", "zed", "gleam", "nova"];

export function GeneratingModal() {
  const status = useKaidoStore((s) => s.status);
  const query = useKaidoStore((s) => s.query);
  const queryType = useKaidoStore((s) => s.queryType);
  const open = status === "generating";

  const [messageIndex, setMessageIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
      setMessageIndex(0);
    } else if (mounted) {
      setExiting(true);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 1900);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % GHOST_WORDS.length);
    }, 1100);
    return () => clearInterval(id);
  }, [open]);

  if (!mounted) return null;

  const labelByType: Record<typeof queryType, string> = {
    idea: "your idea",
    competitor: "your reference",
    seed: "your seed",
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[55] flex items-center justify-center px-6 modal-backdrop ${exiting ? "overlay-exit" : "overlay-enter"}`}
    >
      <div
        className={`glass relative w-full max-w-[440px] rounded-[18px] px-7 py-8 ${exiting ? "modal-exit" : "modal-enter"}`}
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--muted)]">
            kaido is thinking
          </span>
        </div>

        <div className="relative h-[140px]">
          <svg
            viewBox="0 0 280 112"
            className="absolute inset-0 m-auto h-full w-full"
            aria-hidden
          >
            <g>
              <circle
                cx="140"
                cy="56"
                r="6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.2"
                className="gen-pulse-ring"
              />
              <circle
                cx="140"
                cy="56"
                r="6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                className="gen-pulse-ring gen-pulse-ring-2"
              />
              <circle
                cx="140"
                cy="56"
                r="6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.8"
                className="gen-pulse-ring gen-pulse-ring-3"
              />
            </g>

            <g className="gen-orbit">
              <circle cx="200" cy="56" r="2" fill="var(--accent)" opacity="0.55" />
              <circle cx="80" cy="56" r="1.5" fill="var(--accent)" opacity="0.35" />
            </g>
            <g className="gen-orbit-rev">
              <circle cx="140" cy="14" r="1.5" fill="var(--text)" opacity="0.4" />
              <circle cx="140" cy="98" r="1.5" fill="var(--text)" opacity="0.25" />
            </g>

            <circle cx="140" cy="56" r="3" fill="var(--accent)" />
          </svg>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-center justify-center">
            {GHOST_WORDS.map((w, i) => (
              <span
                key={w}
                aria-hidden
                className="absolute font-[family-name:var(--font-display)] text-[26px] italic text-[color:var(--text)]"
                style={{
                  opacity: i === wordIndex ? 1 : 0,
                  transform:
                    i === wordIndex
                      ? "translateY(0) scale(1)"
                      : "translateY(8px) scale(0.96)",
                  filter: i === wordIndex ? "blur(0)" : "blur(3px)",
                  transition: "opacity 360ms ease, transform 360ms ease, filter 360ms ease",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 min-h-[44px]">
          <div
            key={messageIndex}
            className="font-[family-name:var(--font-display)] text-[18px] italic leading-[1.3] text-[color:var(--text)] gen-word"
          >
            {MESSAGES[messageIndex]}
            <span className="text-[color:var(--accent)]">…</span>
          </div>
        </div>

        <div className="mt-5 h-[2px] w-full overflow-hidden rounded-full bg-[color:var(--border-soft)]">
          <div className="h-full w-full gen-shimmer" />
        </div>

        {query.trim().length > 0 && (
          <div className="mt-6 border-t border-[color:var(--border-soft)] pt-4">
            <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {labelByType[queryType]}
            </div>
            <p className="mt-1.5 line-clamp-2 font-[family-name:var(--font-display)] text-[13px] italic text-[color:var(--text)]/80">
              &ldquo;{query.trim()}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
