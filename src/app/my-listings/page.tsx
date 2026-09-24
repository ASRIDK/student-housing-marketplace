import type { Metadata } from "next";
import Link from "next/link";
import { getListingsByOwner } from "@/lib/listings";
import MyListingRow from "@/components/MyListingRow";
import { DEV_USER_ID } from "@/lib/dev-user";

export const metadata: Metadata = {
  title: "My listings",
};

// Reads the database on every request — never prerendered at build time.
export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  // TODO(auth): read the id from the session once login exists.
  const myListings = await getListingsByOwner(DEV_USER_ID);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-3xl font-extrabold text-navy">My listings</h1>
        <Link
          href="/listings/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
        >
          Post a place
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-mist px-6 py-16 text-center">
          <p className="title text-lg font-bold text-navy">
            You have not posted anything yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate">
            Leaving your campus this semester? Put your apartment up and let
            the next student take it over.
          </p>
          <Link
            href="/listings/new"
            className="mt-6 inline-block rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Post your place
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {myListings.map((listing) => (
            <MyListingRow key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}
