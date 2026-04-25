"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationEvent } from "react";
import { useToastStore, type Toast as ToastType, type ToastVariant } from "@/app/store/toast";
import { WarningIcon } from "@/app/components/ui/icons/WarningIcon";
import { CheckIcon } from "@/app/components/ui/icons/CheckIcon";
import { InfoIcon } from "@/app/components/ui/icons/InfoIcon";
import { CloseIcon } from "@/app/components/ui/icons/CloseIcon";

const VARIANT_COLOR: Record<ToastVariant, string> = {
  error: "var(--taken)",
  success: "var(--available)",
  info: "var(--accent)",
};

function Icon({ variant }: { variant: ToastVariant }) {
  if (variant === "error") return <WarningIcon />;
  if (variant === "success") return <CheckIcon />;
  return <InfoIcon />;
}

export function Toast({ toast }: { toast: ToastType }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setExiting(true), toast.durationMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.durationMs]);

  const startClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExiting(true);
  };

  const onAnimEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (exiting && e.animationName === "toast-exit") dismiss(toast.id);
  };

  return (
    <div
      className={`glass flex w-full items-start gap-3 rounded-[12px] px-4 py-3 pointer-events-auto overflow-hidden ${exiting ? "toast-exit" : "toast-enter"}`}
      onAnimationEnd={onAnimEnd}
      role={toast.variant === "error" ? "alert" : "status"}
    >
      <div
        className="mt-[2px] shrink-0"
        style={{ color: VARIANT_COLOR[toast.variant] }}
      >
        <Icon variant={toast.variant} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium tracking-[0.01em] text-[color:var(--text)]">
          {toast.title}
        </div>
        {toast.description && (
          <div className="mt-[2px] text-[11px] leading-[1.55] text-[color:var(--muted)] truncate">
            {toast.description}
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={startClose}
        className="shrink-0 text-[color:var(--subtle)] transition-colors hover:text-[color:var(--text)]"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
