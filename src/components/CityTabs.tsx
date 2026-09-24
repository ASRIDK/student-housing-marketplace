import Link from "next/link";
import { CITIES, type City } from "@/lib/types";

type Props = {
  counts: Partial<Record<City, number>>;
  total: number;
  current?: string;
  params: { maxRent?: string; availableFrom?: string; sort?: string };
};

/**
 * The five campuses, as the primary way into the listings — this is a
 * school marketplace, so where you are moving is the first question.
 * Counts respect the other filters, so a campus showing 0 tells you the
 * rent or date is the thing to loosen.
 */
export default function CityTabs({ counts, total, current, params }: Props) {
  function href(city?: City) {
    const query = new URLSearchParams();
    if (city) query.set("city", city);
    if (params.maxRent) query.set("maxRent", params.maxRent);
    if (params.availableFrom) query.set("availableFrom", params.availableFrom);
    if (params.sort) query.set("sort", params.sort);
    return query.size ? `/?${query.toString()}` : "/";
  }

  const tabs = [
    { label: "All campuses", count: total, city: undefined },
    ...CITIES.map((city) => ({ label: city, count: counts[city] ?? 0, city })),
  ];

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {tabs.map((tab) => {
          const active = (current ?? "") === (tab.city ?? "");
          return (
            <li key={tab.label}>
              <Link
                href={href(tab.city)}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                    : "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-slate transition hover:border-navy hover:text-navy"
                }
              >
                {tab.label}
                <span className={active ? "text-white/60" : "text-slate/70"}>{tab.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
