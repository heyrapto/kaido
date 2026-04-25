import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaGithub } from "react-icons/fa6";
import type { ComponentType } from "react";

type Social = {
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number }>;
};

const SOCIALS: Social[] = [
  { label: "X", href: "https://x.com/heyrapto", Icon: FaXTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/caleb-kalejaiye-5a0730403/", Icon: FaLinkedinIn },
  { label: "Facebook", href: "https://facebook.com/heyrapto", Icon: FaFacebookF },
  { label: "Repository", href: "https://github.com/heyrapto/kaido", Icon: FaGithub },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-[color:var(--border-soft)] py-6">
      <div className="flex items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-display)] text-[12px] italic text-[color:var(--muted)]">
          made by{" "}
          <a
            href="https://x.com/heyrapto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--text)] transition-colors hover:text-[color:var(--accent)]"
          >
            Rapto
          </a>
        </span>
        <ul className="flex items-center gap-[14px]">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="block text-[color:var(--subtle)] transition-colors hover:text-[color:var(--accent)]"
              >
                <Icon size={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
