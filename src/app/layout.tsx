import type { Metadata } from "next";
import "./globals.css";

// Root layout. Andrea owns this file: navbar, footer and the site font
// (via next/font) go here — see tasks/Andrea-CALLIES.txt.

export const metadata: Metadata = {
  title: {
    default: "StudentSwap",
    template: "%s — StudentSwap",
  },
  description:
    "Apartment handover between students in Milan, Madrid, Geneva, Paris and Marseille.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
