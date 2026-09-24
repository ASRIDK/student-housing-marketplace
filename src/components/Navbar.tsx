"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Browse" },
  { href: "/listings/new", label: "Post your place" },
  { href: "/my-listings", label: "My listings" },
  { href: "/about", label: "How it works" },
];

/** The A mark: Albert School navy square with a sky-blue cut corner. */
function Logo() {
  return (
    <span
      aria-hidden
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky text-[15px] font-black text-navy"
    >
      A
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="title flex items-center gap-2.5 text-[17px] font-extrabold text-white"
        >
          <Logo />
          StudentSwap
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-sm font-semibold text-white underline decoration-sky decoration-2 underline-offset-8"
                    : "text-sm font-medium text-white/70 transition hover:text-white"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {/* TODO(auth): show the student's name and a log-out item instead
              once there is a session. */}
          <Link
            href="/login"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-sky px-4 py-2 text-sm font-semibold text-navy transition hover:bg-white"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto rounded-lg p-2 text-white md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-5 pb-4 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-medium text-white/80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-white/25 py-2.5 text-center text-sm font-medium text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-sky py-2.5 text-center text-sm font-semibold text-navy"
            >
              Sign up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
