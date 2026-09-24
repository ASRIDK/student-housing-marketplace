import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatAmount, formatRooms, formatWindow } from "@/lib/format";
import CityBadge from "@/components/CityBadge";

/**
 * One apartment in the browse grid. Photo first, then the three things a
 * student actually decides on: where, when they can move in, and how much.
 * The owner's first name is on the card because you are taking the place
 * over from a person, not booking a hotel.
 */
export default function ListingCard({
  listing,
  isNew = false,
}: {
  listing: Listing;
  isNew?: boolean;
}) {
  const photo = listing.photos[0];
  const firstName = listing.ownerName.split(" ")[0];
  const isTaken = listing.status === "taken";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
        {photo ? (
          <Image
            src={photo}
            alt={`${formatRooms(listing.rooms)} in ${listing.neighbourhood}, ${listing.city}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate">
            Photos coming soon
          </div>
        )}

        <div className="absolute left-3 top-3">
          <CityBadge city={listing.city} />
        </div>

        {isNew && !isTaken && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy shadow-sm">
            Just posted
          </span>
        )}

        {isTaken && (
          <div className="absolute inset-0 grid place-items-center bg-navy/55">
            <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy">
              Taken
            </span>
          </div>
        )}
      </div>

      <div className="px-0.5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="title truncate text-[15px] font-semibold text-navy">
            {listing.neighbourhood}
          </h3>
          <p className="shrink-0 text-[15px] font-semibold text-navy">
            {formatAmount(listing.rent, listing.currency)}
            <span className="font-normal text-slate"> /mo</span>
          </p>
        </div>

        <p className="mt-1 text-sm text-slate">
          {formatWindow(listing.availableFrom, listing.availableUntil)}
        </p>
        <p className="mt-0.5 text-sm text-slate">
          {formatRooms(listing.rooms)} · from {firstName}
        </p>
      </div>
    </Link>
  );
}
