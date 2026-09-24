import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { formatDate, formatRooms } from "@/lib/format";
import PhotoGallery from "@/components/PhotoGallery";
import ContactCard from "@/components/ContactCard";
import ShareButton from "@/components/ShareButton";
import AvailabilityCountdown from "@/components/AvailabilityCountdown";
import CityBadge from "@/components/CityBadge";

type PageProps = { params: Promise<{ id: string }> };

// Reads the database on every request — never prerendered at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return { title: "Listing not found" };
  }
  return {
    title: `${formatRooms(listing.rooms)} in ${listing.neighbourhood}, ${listing.city}`,
    description: listing.description.slice(0, 155),
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    notFound();
  }

  const isTaken = listing.status === "taken";
  const title = `${formatRooms(listing.rooms)} in ${listing.neighbourhood}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-navy"
      >
        <span aria-hidden>&larr;</span> All apartments
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-extrabold text-navy sm:text-4xl">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <CityBadge city={listing.city} />
            {!isTaken && <AvailabilityCountdown availableFrom={listing.availableFrom} />}
          </div>
        </div>
        <ShareButton />
      </div>

      {isTaken && (
        <p className="mt-5 rounded-2xl bg-mist px-5 py-4 text-sm font-medium text-navy">
          This one is gone — another student has taken it over. The rest of{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-deep">
            {listing.city}
          </Link>{" "}
          is still open.
        </p>
      )}

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <PhotoGallery photos={listing.photos} alt={`${title}, ${listing.city}`} />

          <section className="mt-9">
            <h2 className="title text-lg font-bold text-navy">About the place</h2>
            <p className="mt-3 max-w-[68ch] whitespace-pre-line leading-relaxed text-ink">
              {listing.description}
            </p>
          </section>

          <section className="mt-9 border-t border-line pt-7">
            <h2 className="title text-lg font-bold text-navy">The details</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate">Size</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {formatRooms(listing.rooms)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate">Neighbourhood</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {listing.neighbourhood}, {listing.city}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate">Move in from</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {formatDate(listing.availableFrom)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate">Until</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {listing.availableUntil
                    ? formatDate(listing.availableUntil)
                    : "Open-ended — stay as long as you want"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <ContactCard
          ownerName={listing.ownerName}
          ownerEmail={listing.ownerEmail}
          city={listing.city}
          rent={listing.rent}
          currency={listing.currency}
          availableFrom={listing.availableFrom}
          availableUntil={listing.availableUntil}
          disabled={isTaken}
        />
      </div>
    </div>
  );
}
