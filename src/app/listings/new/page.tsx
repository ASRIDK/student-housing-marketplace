import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  return (
    <main>
      <h1 className="mx-auto max-w-xl px-4 pt-8 text-2xl font-semibold">
        Post a listing
      </h1>
      <ListingForm />
    </main>
  );
}
