"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Listing } from "@/lib/types";
import { formatAmount, formatWindow } from "@/lib/format";
import { devUserHeader } from "@/lib/dev-user";

type MyListingRowProps = {
  listing: Listing;
};

/** One of your own apartments, with the two things you can do to it. */
export default function MyListingRow({ listing }: MyListingRowProps) {
  const router = useRouter();
  const thumb = listing.photos[0];
  const isTaken = listing.status === "taken";
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleMarkAsTaken() {
    setIsSaving(true);
    setError(undefined);

    const response = await fetch(`/api/listings/${listing.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...devUserHeader() },
      body: JSON.stringify({ status: "taken" }),
    });

    setIsSaving(false);

    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      setError(problem.error ?? "Could not update this listing. Try again.");
      return;
    }

    router.refresh();
  }

  return (
    <li className="flex flex-wrap items-center gap-4 p-4">
      <Link
        href={`/listings/${listing.id}`}
        className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-mist"
      >
        {thumb ? (
          <Image src={thumb} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-xs text-slate">
            No photo
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/listings/${listing.id}`}
          className="title block truncate font-semibold text-navy hover:text-deep"
        >
          {listing.neighbourhood}, {listing.city}
        </Link>
        <p className="mt-0.5 text-sm text-slate">
          {formatAmount(listing.rent, listing.currency)} / month ·{" "}
          {formatWindow(listing.availableFrom, listing.availableUntil)}
        </p>
      </div>

      <span
        className={
          isTaken
            ? "shrink-0 rounded-full bg-mist px-3 py-1 text-xs font-semibold text-slate"
            : "shrink-0 rounded-full bg-positive/10 px-3 py-1 text-xs font-semibold text-positive"
        }
      >
        {isTaken ? "Taken" : "Live"}
      </span>

      <div className="flex shrink-0 gap-2">
        <Link
          href={`/listings/${listing.id}/edit`}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-navy transition hover:border-navy"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleMarkAsTaken}
          disabled={isTaken || isSaving}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-navy transition hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving…" : "Mark as taken"}
        </button>
      </div>

      {error && (
        <p role="alert" className="w-full text-sm text-danger">
          {error}
        </p>
      )}
    </li>
  );
}
