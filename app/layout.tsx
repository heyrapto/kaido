import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaido — names worth keeping",
  description:
    "Describe your idea, drop a competitor, or paste a name you like. AI finds you something good — then checks if it's actually free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
