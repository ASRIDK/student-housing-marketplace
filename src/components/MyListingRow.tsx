"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatRent } from "@/lib/format";

type MyListingRowProps = {
  listing: Listing;
};

export default function MyListingRow({ listing }: MyListingRowProps) {
  const thumb = listing.photos[0];
  const isTaken = listing.status === "taken";

  function handleMarkAsTaken() {
    // TODO(api): call the real endpoint to update this listing's status.
    console.log("mark as taken:", listing.id);
  }

  return (
    <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {thumb ? (
          <Image src={thumb} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No photo
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-neutral-900">
          {listing.neighbourhood}, {listing.city}
        </p>
        <p className="text-sm text-neutral-500">
          {formatRent(listing.rent, listing.currency)}
        </p>
      </div>

      <span
        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isTaken
            ? "bg-neutral-200 text-neutral-600"
            : "bg-green-100 text-green-700"
        }`}
      >
        {isTaken ? "Taken" : "Active"}
      </span>

      <div className="flex gap-2">
        <Link
          href={`/listings/${listing.id}/edit`}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleMarkAsTaken}
          disabled={isTaken}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mark as taken
        </button>
      </div>
    </li>
  );
}