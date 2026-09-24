import { notFound } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { mockListings } from "@/lib/mock-data";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { id } = await params;
  const listing = mockListings.find((item) => item.id === id);

  if (!listing) {
    notFound();
  }

  return (
    <main>
      <h1 className="mx-auto max-w-xl px-4 pt-8 text-2xl font-semibold">
        Edit listing
      </h1>
      <ListingForm initial={listing} />
    </main>
  );
}
