import type { Metadata } from "next";
import Link from "next/link";
import { getListingsByOwner } from "@/lib/listings";
import MyListingRow from "@/components/MyListingRow";

export const metadata: Metadata = {
  title: "My listings",
};

// Reads the database on every request — never prerendered at build time.
export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  // TODO(auth): replace with the real logged-in user id from the session.
  // For now we pretend the logged-in user is the first seeded user.
  const currentUserId = "u-1";

  const myListings = await getListingsByOwner(currentUserId);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          My listings
        </h1>
        <Link
          href="/listings/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Post a new apartment
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <p className="text-neutral-600">You haven&apos;t posted any apartments yet.</p>
          <Link
            href="/listings/new"
            className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Post your first apartment
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200">
          {myListings.map((listing) => (
            <MyListingRow key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}
