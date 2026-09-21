import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockListing } from "@/lib/mock-data";
import { formatDate, formatRent, formatRooms } from "@/lib/format";
import PhotoGallery from "@/components/PhotoGallery";
import ContactCard from "@/components/ContactCard";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getMockListing(id);
  if (!listing) {
    return { title: "Listing not found" };
  }
  return {
    title: `${formatRooms(listing.rooms)} in ${listing.neighbourhood}, ${listing.city}`,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getMockListing(id);
  if (!listing) {
    notFound();
  }

  const isTaken = listing.status === "taken";
  const title = `${formatRooms(listing.rooms)} in ${listing.neighbourhood}, ${listing.city}`;
  const availability = listing.availableUntil
    ? `${formatDate(listing.availableFrom)} – ${formatDate(listing.availableUntil)}`
    : `From ${formatDate(listing.availableFrom)} – open-ended`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {isTaken && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          This apartment has already been taken
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* LEFT: gallery + details */}
        <div>
          <PhotoGallery photos={listing.photos} alt={title} />

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h1>

          <p className="mt-2 text-xl font-medium text-neutral-900">
            {formatRent(listing.rent, listing.currency)}
          </p>

          <p className="mt-3 text-sm text-neutral-600">
            <span className="font-medium text-neutral-800">Available:</span> {availability}
          </p>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-neutral-700">
            {listing.description}
          </p>
        </div>

        {/* RIGHT: contact */}
        <div>
          <ContactCard
            ownerName={listing.ownerName}
            ownerEmail={listing.ownerEmail}
            city={listing.city}
            disabled={isTaken}
          />
        </div>
      </div>
    </main>
  );
}