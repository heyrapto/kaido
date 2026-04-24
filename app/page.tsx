"use client";

import { SearchInput } from "@/app/components/SearchInput";
import { ExampleChips } from "@/app/components/ExampleChips";
import { ResultsGrid } from "@/app/components/ResultsGrid";
import { useNameSearch } from "@/app/hooks/useNameSearch";

export default function Page() {
  const runSearch = useNameSearch();

  return (
    <main className="min-h-screen bg-[var(--bg)] px-8 pt-8 pb-12">
      <h2 className="sr-only">
        Kaido — find available, non-boring domain names for your project using AI
      </h2>

      <div className="mb-10 flex max-w-full items-center justify-between">
        <div className="font-[family-name:var(--font-display)] text-[24px] font-bold italic tracking-[-0.03em] text-[color:var(--text)]">
          kaido<span className="text-[color:var(--accent)]">.</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--subtle)]">
          names worth keeping
        </div>
      </div>

      <div className="mb-8 max-w-[560px]">
        <h1 className="font-[family-name:var(--font-display)] max-w-[440px] text-[36px] font-medium leading-[1.12] text-[color:var(--text)]">
          Stop naming it<br />
          <em className="italic text-[color:var(--accent)]">TechBoostifyly.</em>
        </h1>
        <p className="mt-[0.65rem] max-w-[380px] text-[12px] leading-[1.8] text-[color:var(--muted)]">
          Describe your idea, drop a competitor, or paste a name you like. AI finds
          you something good — then checks if it&apos;s actually free.
        </p>
      </div>

      <SearchInput onSubmit={runSearch} />

      <ExampleChips />

      <ResultsGrid />
    </main>
  );
}
