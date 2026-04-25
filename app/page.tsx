"use client";

import { TopNav } from "@/app/components/TopNav";
import { HeroBadge } from "@/app/components/HeroBadge";
import { SearchInput } from "@/app/components/SearchInput";
import { ExampleChips } from "@/app/components/ExampleChips";
import { ResultsGrid } from "@/app/components/ResultsGrid";
import { TrustSection } from "@/app/components/TrustSection";
import { Footer } from "@/app/components/Footer";
import { useNameSearch } from "@/app/hooks/useNameSearch";

export default function Page() {
  const runSearch = useNameSearch();

  return (
    <main className="grid-bracket-bg relative min-h-screen bg-[color:var(--bg)]">
      <h2 className="sr-only">
        Kaido — find available, non-boring domain names for your project using AI
      </h2>

      <TopNav />

      <section className="relative">
        <div className="relative mx-auto flex max-w-[1240px] flex-col items-center px-8 pt-24 pb-20 text-center">
          <HeroBadge />

          <h1 className="mt-8 font-[family-name:var(--font-display)] text-[64px] font-medium leading-[1.04] tracking-[-0.02em] text-[color:var(--text)]">
            Stop naming it<br />
            <em className="italic text-[color:var(--accent)]">TechBoostifyly.</em>
          </h1>

          <p className="mt-6 max-w-[560px] text-[14px] leading-[1.7] text-[color:var(--muted)]">
            Describe your idea, drop a competitor, or paste a name you like.
            Kaido finds you something good — then checks if it&apos;s actually
            free in under three seconds.
          </p>

          <div className="mt-10 w-full max-w-[820px]">
            <SearchInput onSubmit={runSearch} />
          </div>

          <ExampleChips />

          <div className="w-full max-w-[820px]">
            <ResultsGrid />
          </div>
        </div>
      </section>

      <TrustSection />

      <div className="mx-auto max-w-[1240px] px-8">
        <Footer />
      </div>
    </main>
  );
}
