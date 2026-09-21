import type { Metadata } from "next";
import { CITIES } from "@/lib/types";
import CityBadge from "@/components/CityBadge";

export const metadata: Metadata = {
  title: "How it works",
};

const STEPS = [
  {
    emoji: "🏠",
    title: "Post your apartment",
    description:
      "Moving campus? Share your place in a few minutes: photos, rent, dates.",
  },
  {
    emoji: "💬",
    title: "A student contacts you",
    description:
      "Other students browse listings by city and reach out if it's a fit.",
  },
  {
    emoji: "🔑",
    title: "Hand over the keys",
    description:
      "Agree on the details together and hand over the apartment in person.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold">How StudentSwap works</h1>
        <p className="mt-2 text-[var(--muted)]">
          A simple way for students to pass on their apartment to the next
          person moving to their campus.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center"
          >
            <div className="text-4xl">{step.emoji}</div>
            <h2 className="mt-4 font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold">Our campuses</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <CityBadge key={city} city={city} />
          ))}
        </div>
      </div>
    </div>
  );
}
