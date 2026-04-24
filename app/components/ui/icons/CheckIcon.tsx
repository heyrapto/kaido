export function CheckIcon({ size = 20 }: { size?: number }) {
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
      <path
        d="M7.5 12.5 L11 16 L17 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-draw-late"
        style={{ strokeDasharray: 20, strokeDashoffset: 20 }}
      />
    </svg>
  );
}
