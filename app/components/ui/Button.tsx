import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", children, ...rest }: Props) {
  return (
    <button className={`gbtn ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
