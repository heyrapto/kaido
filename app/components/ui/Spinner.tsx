export function Spinner({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center gap-2 py-5 text-[12px] text-[color:var(--subtle)]">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <span>{label}</span>
    </div>
  );
}
