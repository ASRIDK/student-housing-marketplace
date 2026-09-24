import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { getListing } from "@/lib/listings";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit listing",
};

// Reads the database on every request — never prerendered at build time.
export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:px-8">
      <h1 className="display text-3xl font-extrabold text-navy">Edit listing</h1>
      <ListingForm initial={listing} />
    </div>
  );
}
