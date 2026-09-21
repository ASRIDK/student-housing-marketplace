"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Browse" },
  { href: "/listings/new", label: "Post an apartment" },
  { href: "/about", label: "How it works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--primary)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.svg" alt="" width={32} height={32} priority />
          StudentSwap
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-sm font-semibold text-[var(--accent)]"
                    : "text-sm font-medium text-white/80 transition hover:text-white"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {/* TODO(auth): swap these for the user's name + "My listings" once logged in */}
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--primary)] px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "text-sm font-semibold text-[var(--accent)]"
                      : "text-sm font-medium text-white/80"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="border-[var(--border)]" />
            {/* TODO(auth): swap these for the user's name + "My listings" once logged in */}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-white/80"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Sign up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
