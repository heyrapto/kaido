import { create } from "zustand";

export type ModalVariant = "error" | "info";

export type ModalPayload = {
  variant: ModalVariant;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

type State = { payload: ModalPayload | null };
type Actions = {
  open: (p: ModalPayload) => void;
  close: () => void;
};

export const useModalStore = create<State & Actions>((set) => ({
  payload: null,
  open: (p) => set({ payload: p }),
  close: () => set({ payload: null }),
}));

type ConfirmOpts = {
  variant?: ModalVariant;
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export const modal = {
  error: (title: string, description?: string, opts?: Partial<ModalPayload>) =>
    useModalStore.getState().open({ variant: "error", title, description, ...opts }),
  info: (title: string, description?: string, opts?: Partial<ModalPayload>) =>
    useModalStore.getState().open({ variant: "info", title, description, ...opts }),
  confirm: (opts: ConfirmOpts): Promise<boolean> =>
    new Promise((resolve) => {
      let settled = false;
      const settle = (v: boolean) => {
        if (settled) return;
        settled = true;
        resolve(v);
      };
      useModalStore.getState().open({
        variant: opts.variant ?? "info",
        title: opts.title,
        description: opts.description,
        primaryLabel: opts.primaryLabel,
        secondaryLabel: opts.secondaryLabel,
        onPrimary: () => settle(true),
        onSecondary: () => settle(false),
      });
    }),
};
