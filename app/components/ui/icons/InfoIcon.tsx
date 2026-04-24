export function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        className="svg-draw"
        style={{ strokeDasharray: 64, strokeDashoffset: 64 }}
      />
      <circle cx="12" cy="8" r="0.95" fill="currentColor" className="svg-pop" />
      <line
        x1="12"
        y1="11.5"
        x2="12"
        y2="16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="svg-fade"
      />
    </svg>
  );
}
