import { Suspense } from "react";
import type { Metadata } from "next";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import CityTabs from "@/components/CityTabs";
import FeaturedWheel from "@/components/FeaturedWheel";
import { getListings } from "@/lib/listings";
import { CITIES, type City } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "StudentSwap — take over a classmate's apartment" },
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

  // Fetched without the city filter so each campus tab can show a count.
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
  const listings = selectedCity
    ? withoutCity.filter((listing) => listing.city === selectedCity)
    : withoutCity;

  return (
    <>
      <section className="bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pb-0 sm:pt-20">
          <h1 className="display max-w-2xl text-4xl font-extrabold text-white sm:text-5xl">
            Someone is leaving your campus. Take their keys.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
            Apartments handed over student to student in Milan, Madrid, Geneva,
            Paris and Marseille. You get the place, the landlord keeps a tenant,
            nobody pays an agency.
          </p>
        </div>

        {/* Four places to turn through: scroll over it, drag it, or use the
            arrow keys; each card opens the listing.

            Phones get the plain hero instead. The wheel sizes its type off the
            card, the card is capped by the stage width, and at 390px that
            leaves the labels at about 4px — the grid below already shows these
            same places at a readable size. */}
        <div className="on-navy mt-6 hidden w-full pb-24 sm:block sm:h-[32rem]">
          <FeaturedWheel />
        </div>
      </section>

      {/* The search panel straddles the hero edge, the way a booking site's
          search bar does. */}
      <div className="mx-auto -mt-12 max-w-4xl px-5 sm:-mt-9 sm:px-8">
        <Suspense fallback={<div className="h-[76px] rounded-full bg-white shadow-lg" />}>
          <FilterBar />
        </Suspense>
      </div>

      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <CityTabs
          counts={cityCounts}
          total={withoutCity.length}
          current={selectedCity}
          params={{ maxRent, availableFrom, sort }}
        />

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h2 className="title text-lg font-bold text-navy">
            {selectedCity ? `Apartments in ${selectedCity}` : "All apartments"}
          </h2>
          <p className="text-sm text-slate">
            {listings.length} {listings.length === 1 ? "place" : "places"}
          </p>
        </div>

        {listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isNew={isRecent(listing.createdAt)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
