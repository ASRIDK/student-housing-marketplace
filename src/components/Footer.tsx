import Link from "next/link";
import { CITIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--primary)] text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-bold text-white">StudentSwap</p>
          <p className="mt-1 text-sm">
            Made by Andrea, Alejandro, Leo, Côme &amp; Taoufik for the Data
            Science class 2026.
          </p>
          <a
            href="https://github.com/ASRIDK/student-housing-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View on GitHub
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Campuses</p>
          <ul className="mt-2 flex flex-wrap gap-3">
            {CITIES.map((city) => (
              <li key={city}>
                <Link
                  href={`/?city=${city}`}
                  className="text-sm text-white/80 hover:text-white"
                >
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
