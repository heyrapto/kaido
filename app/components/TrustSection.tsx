"use client";

type Brand = {
  name: string;
  className?: string;
};

const ROW_1: Brand[] = [
  { name: "Linear",   className: "tracking-[-0.03em] font-medium" },
  { name: "NOTION",   className: "tracking-[0.18em] text-[13px] font-medium" },
  { name: "Vercel",   className: "italic font-[family-name:var(--font-display)] tracking-[-0.02em]" },
  { name: "Loom",     className: "tracking-[-0.04em] font-semibold" },
];

const ROW_2: Brand[] = [
  { name: "figma",    className: "lowercase tracking-[0.04em] font-medium" },
  { name: "Arc",      className: "font-[family-name:var(--font-display)] italic font-medium" },
  { name: "ZED",      className: "tracking-[0.24em] text-[13px]" },
  { name: "Stripe",   className: "tracking-[-0.03em] font-semibold" },
  { name: "Gleam",    className: "font-[family-name:var(--font-display)] tracking-[-0.01em]" },
  { name: "drift.",   className: "font-medium" },
];

const ROW_3: Brand[] = [
  { name: "fern",     className: "font-[family-name:var(--font-display)] italic" },
  { name: "Plaid",    className: "tracking-[-0.02em] font-medium" },
  { name: "Rauch",    className: "tracking-[0.02em]" },
];

function LogoRow({ items }: { items: Brand[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
      {items.map((b) => (
        <span
          key={b.name}
          className={`text-[18px] text-[color:var(--text)]/65 ${b.className ?? ""}`}
        >
          {b.name}
        </span>
      ))}
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 pt-28 pb-20 text-center">
      <h2 className="mx-auto max-w-[680px] font-[family-name:var(--font-display)] text-[42px] font-medium leading-[1.12] text-[color:var(--text)]">
        Inspired by the names that<br />
        set the bar.
      </h2>
      <div className="mt-14 flex flex-col items-center gap-10">
        <LogoRow items={ROW_1} />
        <LogoRow items={ROW_2} />
        <LogoRow items={ROW_3} />
      </div>
    </section>
  );
}
