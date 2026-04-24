export function Spinner({ label }: { label: string }) {
  return (
    <div className="loading-row">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <span>{label}</span>
    </div>
  );
}
