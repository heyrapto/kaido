import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/app/components/ui/Toaster";
import { Modal } from "@/app/components/ui/Modal";

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
      <body>
        {children}
        <Toaster />
        <Modal />
      </body>
    </html>
  );
}
