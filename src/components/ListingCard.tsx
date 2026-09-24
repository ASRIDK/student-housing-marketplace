import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatDate, formatRent, formatRooms } from "@/lib/format";

export default function ListingCard({
  listing,
  isNew = false,
}: {
  listing: Listing;
  isNew?: boolean;
}) {
  const photo = listing.photos[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        {photo ? (
          <Image
            src={photo}
            alt={`${listing.neighbourhood}, ${listing.city}`}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No photo
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-zinc-700 shadow-sm">
          {listing.city}
        </span>
        {isNew && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="space-y-1 p-4">
        <p className="text-sm text-zinc-500">{listing.neighbourhood}</p>
        <p className="text-lg font-semibold text-zinc-900">
          {formatRent(listing.rent, listing.currency)}
        </p>
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>{formatRooms(listing.rooms)}</span>
          <span>Available from {formatDate(listing.availableFrom)}</span>
        </div>
      </div>
    </Link>
  );
}
