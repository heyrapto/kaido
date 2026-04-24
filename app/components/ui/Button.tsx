import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", children, ...rest }: Props) {
  return (
    <button
      className={[
        "font-[family-name:var(--font-ui)]",
        "text-[12px] font-medium tracking-[0.02em]",
        "bg-[var(--accent)] text-[color:var(--bg)]",
        "rounded-[8px] px-5 py-2",
        "cursor-pointer transition-opacity hover:opacity-85",
        "disabled:opacity-[0.45] disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
