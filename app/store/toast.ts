import { create } from "zustand";

export type ToastVariant = "error" | "success" | "info";

export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  durationMs: number;
};

type State = { toasts: Toast[] };

type Actions = {
  push: (t: Omit<Toast, "id" | "durationMs"> & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
};

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useToastStore = create<State & Actions>((set) => ({
  toasts: [],
  push: (t) => {
    const id = genId();
    set((s) => ({
      toasts: [...s.toasts, { id, durationMs: 5000, ...t }],
    }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export const toast = {
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ variant: "error", title, description }),
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ variant: "success", title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ variant: "info", title, description }),
};
