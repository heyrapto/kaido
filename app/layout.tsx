import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/app/components/ui/Toaster";
import { Modal } from "@/app/components/ui/Modal";
import { GeneratingModal } from "@/app/components/GeneratingModal";

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
        <GeneratingModal />
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
      </body>
    </html>
  );
}
