"use client";

import { useToastStore } from "@/app/store/toast";
import { Toast } from "@/app/components/ui/Toast";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[min(340px,calc(100vw-3rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
