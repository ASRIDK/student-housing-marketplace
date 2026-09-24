import { Suspense } from "react";
import type { Metadata } from "next";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import CityTabs from "@/components/CityTabs";
import { mockListings } from "@/lib/mock-data";
import type { City } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "StudentSwap — find your next apartment" },
};

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

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { city, maxRent, availableFrom, sort } = await searchParams;

  const withoutCity = mockListings
    .filter((listing) => listing.status === "active")
    .filter((listing) => !maxRent || listing.rent <= Number(maxRent))
    .filter(
      (listing) => !availableFrom || listing.availableFrom <= availableFrom,
    );

  const cityCounts: Partial<Record<City, number>> = {};
  for (const listing of withoutCity) {
    cityCounts[listing.city] = (cityCounts[listing.city] ?? 0) + 1;
  }

  const filtered = withoutCity
    .filter((listing) => !city || listing.city === (city as City))
    .sort((a, b) => {
      if (sort === "cheapest") return a.rent - b.rent;
      if (sort === "expensive") return b.rent - a.rent;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Find your next apartment
      </h1>

      <Suspense
        fallback={<div className="mb-6 h-[76px] rounded-xl bg-zinc-100" />}
      >
        <FilterBar key={`${city}|${maxRent}|${availableFrom}|${sort}`} />
      </Suspense>

      <CityTabs
        counts={cityCounts}
        total={withoutCity.length}
        current={city}
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
