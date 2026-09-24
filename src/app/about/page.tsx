import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/types";
import CityBadge from "@/components/CityBadge";

export const metadata: Metadata = {
  title: "How it works",
};

// Three real steps in order, so they are numbered.
const STEPS = [
  {
    title: "Post the place you are leaving",
    body: "Photos, rent, and the dates you move out. Five minutes, and your landlord keeps a tenant instead of an empty flat.",
  },
  {
    title: "A student writes to you",
    body: "Anyone browsing your campus can see the listing and email you directly. No agency in the middle, no listing fee.",
  },
  {
    title: "You hand over the keys",
    body: "Agree the contract change with your landlord, meet, and pass on the keys. StudentSwap never touches the money.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h1 className="display max-w-2xl text-4xl font-extrabold text-navy sm:text-5xl">
        Apartments that stay in the school
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-slate">
        Every semester Albert School students swap campus. Someone always
        leaves a flat behind, and someone else always arrives looking for one.
        StudentSwap is just the place where those two find each other.
      </p>

      <ol className="mt-12 space-y-px overflow-hidden rounded-3xl border border-line">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-5 bg-surface p-6 sm:p-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h2 className="title font-bold text-navy">{step.title}</h2>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-slate">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-3xl bg-mist p-7 sm:p-9">
        <h2 className="title text-lg font-bold text-navy">Where we are</h2>
        <p className="mt-2 text-sm text-slate">
          Five campuses, one marketplace. Pick yours to see what is open.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {CITIES.map((city) => (
            <Link key={city} href={`/?city=${city}`} className="transition hover:opacity-80">
              <CityBadge city={city} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-9">
        <h2 className="title text-lg font-bold text-navy">Who built this</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate">
          A class project by five Albert School students — Andrea, Alejandro,
          Leo, Côme and Taoufik — for the Data &amp; AI programme. The code is
          public on{" "}
          <a
            href="https://github.com/ASRIDK/student-housing-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-deep underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
