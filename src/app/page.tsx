import { Suspense } from "react";
import type { Metadata } from "next";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import CityTabs from "@/components/CityTabs";
import { getListings } from "@/lib/listings";
import { CITIES, type City } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "StudentSwap — find your next apartment" },
};

// Reads the database on every request — never prerendered at build time.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  city?: string;
  maxRent?: string;
  availableFrom?: string;
  sort?: string;
}>;

const NEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function isRecent(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < NEW_WINDOW_MS;
}

/** Ignore anything that is not one of our five cities or three sort modes. */
function asCity(value: string | undefined): City | undefined {
  return CITIES.includes(value as City) ? (value as City) : undefined;
}

function asSort(value: string | undefined) {
  return value === "cheapest" || value === "expensive" ? value : "newest";
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { city, maxRent, availableFrom, sort } = await searchParams;

  // Without the city filter, so the city tabs can show a count each.
  const withoutCity = await getListings({
    maxRent: maxRent ? Number(maxRent) : undefined,
    availableFrom: availableFrom || undefined,
    sort: asSort(sort),
  });

  const cityCounts: Partial<Record<City, number>> = {};
  for (const listing of withoutCity) {
    cityCounts[listing.city] = (cityCounts[listing.city] ?? 0) + 1;
  }

  const selectedCity = asCity(city);
  const filtered = selectedCity
    ? withoutCity.filter((listing) => listing.city === selectedCity)
    : withoutCity;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Find your next apartment
      </h1>

      <Suspense fallback={<div className="mb-6 h-[76px] rounded-xl bg-zinc-100" />}>
        <FilterBar key={`${city}|${maxRent}|${availableFrom}|${sort}`} />
      </Suspense>

      <CityTabs
        counts={cityCounts}
        total={withoutCity.length}
        current={selectedCity}
        params={{ maxRent, availableFrom, sort }}
      />

      <p className="mb-4 text-sm text-zinc-600">
        {filtered.length} apartment{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isNew={isRecent(listing.createdAt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
