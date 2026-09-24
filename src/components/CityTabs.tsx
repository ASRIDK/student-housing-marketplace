import Link from "next/link";
import { CITIES, type City } from "@/lib/types";

type Props = {
  counts: Partial<Record<City, number>>;
  total: number;
  current?: string;
  params: { maxRent?: string; availableFrom?: string; sort?: string };
};

export default function CityTabs({ counts, total, current, params }: Props) {
  function hrefFor(city?: City) {
    const query = new URLSearchParams();
    if (city) query.set("city", city);
    if (params.maxRent) query.set("maxRent", params.maxRent);
    if (params.availableFrom) query.set("availableFrom", params.availableFrom);
    if (params.sort) query.set("sort", params.sort);
    return query.size ? `/?${query.toString()}` : "/";
  }

  const tabs: { label: string; count: number; city?: City }[] = [
    { label: "All", count: total },
    ...CITIES.map((city) => ({ label: city, count: counts[city] ?? 0, city })),
  ];

  return (
    <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter by city">
      {tabs.map((tab) => {
        const active = (current ?? "") === (tab.city ?? "");
        return (
          <Link
            key={tab.label}
            href={hrefFor(tab.city)}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        );
      })}
    </nav>
  );
}
