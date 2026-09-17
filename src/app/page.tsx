// Placeholder home page. Alejandro replaces this file with the real
// browse page (see tasks/alejandromirandadefrutos7-sudo.txt). It only
// proves that the mock data and helpers load.

import { mockListings } from "@/lib/mock-data";
import { formatDate, formatRent, formatRooms } from "@/lib/format";

export default function Home() {
  const active = mockListings.filter((listing) => listing.status === "active");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">StudentSwap</h1>
      <p className="mt-2 text-zinc-600">
        Skeleton is running. {active.length} mock apartments loaded — each
        student now builds their page on their own branch (see the{" "}
        <code>tasks/</code> folder).
      </p>

      <ul className="mt-8 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
        {active.map((listing) => (
          <li key={listing.id} className="flex justify-between gap-4 p-4">
            <div>
              <p className="font-medium">
                {formatRooms(listing.rooms)} in {listing.neighbourhood}, {listing.city}
              </p>
              <p className="text-sm text-zinc-500">
                Available from {formatDate(listing.availableFrom)}
              </p>
            </div>
            <p className="whitespace-nowrap font-medium">
              {formatRent(listing.rent, listing.currency)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
