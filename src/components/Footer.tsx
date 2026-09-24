import Link from "next/link";
import { CITIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="title text-base font-extrabold text-navy">StudentSwap</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">
            Albert School students hand their apartment to the next student
            moving to their campus. No agency, no deposit games.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-navy">Campuses</h2>
          <ul className="mt-3 space-y-2">
            {CITIES.map((city) => (
              <li key={city}>
                <Link
                  href={`/?city=${city}`}
                  className="text-sm text-slate transition hover:text-deep"
                >
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-navy">The project</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-slate transition hover:text-deep">
                How it works
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/ASRIDK/student-housing-marketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate transition hover:text-deep"
              >
                Source on GitHub
              </a>
            </li>
            <li>
              <a
                href="https://albertschool.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate transition hover:text-deep"
              >
                Albert School
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-slate sm:px-8">
          Built by Andrea, Alejandro, Leo, Côme and Taoufik — Albert School,
          Data &amp; AI, 2026.
        </p>
      </div>
    </footer>
  );
}
