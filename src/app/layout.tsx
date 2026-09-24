import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Inter is the face albertschool.com uses. Self-hosted from ./fonts
// (SIL OFL) so the build never has to reach Google Fonts.
const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-wght-normal.woff2" },
    { path: "./fonts/inter-latin-ext-wght-normal.woff2" },
  ],
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "StudentSwap",
    template: "%s — StudentSwap",
  },
  description:
    "Take over a classmate's apartment in Milan, Madrid, Geneva, Paris or Marseille.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="flex min-h-full flex-col bg-background">
        <Navbar />
        {/* Pages set their own width and padding: the browse grid is wide,
            the forms are narrow. */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
