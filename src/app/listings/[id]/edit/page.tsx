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
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold">Edit listing</h1>
      <ListingForm initial={listing} />
    </div>
  );
}
