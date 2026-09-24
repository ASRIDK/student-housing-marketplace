import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Root layout. Andrea owns this file: navbar, footer and the site font
// (via next/font) go here — see tasks/Andrea-CALLIES.txt.

// Manrope is self-hosted from src/app/fonts (SIL OFL) so the build does
// not depend on reaching Google Fonts.
const manrope = localFont({
  src: [
    { path: "./fonts/manrope-latin-wght-normal.woff2" },
    { path: "./fonts/manrope-latin-ext-wght-normal.woff2" },
  ],
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
});

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
    <html lang="en" className={`h-full antialiased ${manrope.variable}`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
