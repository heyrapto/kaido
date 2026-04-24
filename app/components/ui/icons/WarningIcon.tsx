export function WarningIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 L21 19 L3 19 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="svg-draw"
        style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
      />
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="svg-fade"
      />
      <circle
        cx="12"
        cy="16.5"
        r="0.95"
        fill="currentColor"
        className="svg-pop"
      />
    </svg>
  );
}
