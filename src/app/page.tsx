import { Suspense } from "react";
import type { Metadata } from "next";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import CityTabs from "@/components/CityTabs";
import FeaturedWheel, { HERO_BLURB, HERO_TITLE } from "@/components/FeaturedWheel";
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

  // Every place that has a photo goes on the wheel, whatever is filtered
  // below. A full ring is the point: the more cards there are the smaller the
  // component draws them, which is what opens the hole in the middle for the
  // headline. A handful of cards would sit full-size and close it up.
  const featured = (await getListings({ sort: "newest" }))
    .filter((listing) => listing.photos.length > 0)
    .map((listing) => ({
      title: `${listing.neighbourhood}, ${listing.city}`,
      image: listing.photos[0],
      href: `/listings/${listing.id}`,
    }));

  return (
    <>
      {/* The hero is the wheel, full screen, with the pitch sitting in the
          hole in the middle of the ring. Scroll over it, drag it, or use the
          arrow keys; each card opens that listing. */}
      <section className="bg-navy">
        {/* Phones get the pitch on its own: the wheel sizes its type off the
            card, the card is capped by the stage width, and at 390px that
            leaves the labels at about 4px. The grid below already shows these
            same places at a readable size. */}
        <div className="px-5 pb-28 pt-16 sm:hidden">
          <h1 className="display text-4xl font-extrabold text-white">
            {HERO_TITLE}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            {HERO_BLURB}
          </p>
        </div>

        <div className="on-navy mx-auto hidden h-[calc(100svh-4rem)] min-h-[34rem] max-w-6xl pb-16 sm:block">
          <FeaturedWheel items={featured} />
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
