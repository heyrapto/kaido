"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnimationEvent } from "react";
import {
  useModalStore,
  type ModalPayload,
  type ModalVariant,
} from "@/app/store/modal";
import { WarningIcon } from "@/app/components/ui/icons/WarningIcon";
import { InfoIcon } from "@/app/components/ui/icons/InfoIcon";
import { CloseIcon } from "@/app/components/ui/icons/CloseIcon";
import { Button } from "@/app/components/ui/Button";

const VARIANT_COLOR: Record<ModalVariant, string> = {
  error: "var(--taken)",
  info: "var(--accent)",
};

function VariantIcon({ variant }: { variant: ModalVariant }) {
  return variant === "error" ? <WarningIcon size={28} /> : <InfoIcon size={28} />;
}

export function Modal() {
  const payload = useModalStore((s) => s.payload);
  const close = useModalStore((s) => s.close);
  const [local, setLocal] = useState<ModalPayload | null>(payload);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (payload) {
      setLocal(payload);
      setExiting(false);
    } else if (local) {
      setExiting(true);
    }
  }, [payload, local]);

  const dismiss = useCallback(() => {
    local?.onSecondary?.();
    close();
  }, [local, close]);

  const confirmPrimary = useCallback(() => {
    local?.onPrimary?.();
    close();
  }, [local, close]);

  useEffect(() => {
    if (!local || exiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [local, exiting, dismiss]);

  const onAnimEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (exiting && e.animationName === "overlay-exit") setLocal(null);
  };

  if (!local) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-6 modal-backdrop ${exiting ? "overlay-exit" : "overlay-enter"}`}
      onAnimationEnd={onAnimEnd}
      onClick={dismiss}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`glass relative w-full max-w-[400px] rounded-[14px] p-6 ${exiting ? "modal-exit" : "modal-enter"}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-3 top-3 text-[color:var(--subtle)] transition-colors hover:text-[color:var(--text)]"
        >
          <CloseIcon size={16} />
        </button>

        <div className="mb-3" style={{ color: VARIANT_COLOR[local.variant] }}>
          <VariantIcon variant={local.variant} />
        </div>

        <h2
          id="modal-title"
          className="font-[family-name:var(--font-display)] text-[22px] font-medium leading-[1.2] text-[color:var(--text)]"
        >
          {local.title}
        </h2>

        {local.description && (
          <p className="mt-[0.6rem] text-[12px] leading-[1.75] text-[color:var(--muted)]">
            {local.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-[8px] px-4 py-2 text-[11px] text-[color:var(--muted)] transition-colors hover:bg-[var(--hover-tint)] hover:text-[color:var(--text)]"
          >
            {local.secondaryLabel ?? "dismiss"}
          </button>
          {local.primaryLabel && (
            <Button onClick={confirmPrimary}>{local.primaryLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
