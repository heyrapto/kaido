"use client";

import { SearchInput } from "@/app/components/SearchInput";
import { ExampleChips } from "@/app/components/ExampleChips";
import { ResultsGrid } from "@/app/components/ResultsGrid";
import { useNameSearch } from "@/app/hooks/useNameSearch";

export default function Page() {
  const runSearch = useNameSearch();

  return (
    <main
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        padding: "2rem 2rem 3rem",
      }}
    >
      <h2 className="sr-only">
        Kaido — find available, non-boring domain names for your project using AI
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          maxWidth: 560,
        }}
      >
        <div className="logo">
          kaido<span className="logo-dot">.</span>
        </div>
        <div className="topbar-hint">names worth keeping</div>
      </div>

      <div style={{ marginBottom: "2rem", maxWidth: 560 }}>
        <h1 className="hero-title">
          Stop naming it<br />
          <em>TechBoostifyly.</em>
        </h1>
        <p className="hero-sub">
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
