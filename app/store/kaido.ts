import { create } from "zustand";
import type { DomainResult, DomainStatus, QueryType } from "@/app/lib/types";

type Status = "idle" | "generating" | "checking" | "done" | "error";

type State = {
  query: string;
  queryType: QueryType;
  results: DomainResult[];
  status: Status;
  attempts: number;
  allTried: string[];
  error: string | null;
};

type Actions = {
  setQuery: (query: string) => void;
  setQueryType: (type: QueryType) => void;
  setStatus: (status: Status) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  startRun: () => void;
  addCandidates: (names: string[]) => void;
  setCardStatus: (name: string, status: DomainStatus) => void;
  incrementAttempt: () => void;
  setDone: () => void;
};

const initial: State = {
  query: "",
  queryType: "idea",
  results: [],
  status: "idle",
  attempts: 0,
  allTried: [],
  error: null,
};

export const useKaidoStore = create<State & Actions>((set) => ({
  ...initial,
  setQuery: (query) => set({ query }),
  setQueryType: (queryType) => set({ queryType }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initial }),
  startRun: () =>
    set({
      status: "generating",
      results: [],
      attempts: 0,
      allTried: [],
      error: null,
    }),
  addCandidates: (names) =>
    set((s) => ({
      results: [
        ...s.results,
        ...names.map<DomainResult>((n) => ({
          name: n,
          domain: `${n}.com`,
          status: "checking",
        })),
      ],
      allTried: [...s.allTried, ...names],
      status: "checking",
    })),
  setCardStatus: (name, status) =>
    set((s) => ({
      results: s.results.map((r) =>
        r.name === name
          ? { ...r, status, available: status === "available" }
          : r,
      ),
    })),
  incrementAttempt: () => set((s) => ({ attempts: s.attempts + 1 })),
  setDone: () => set({ status: "done" }),
}));
