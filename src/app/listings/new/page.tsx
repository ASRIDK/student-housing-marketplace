import type { Metadata } from "next";
import ListingForm from "@/components/ListingForm";

export const metadata: Metadata = {
  title: "Post a listing",
};

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:px-8">
      <h1 className="display text-3xl font-extrabold text-navy">Post a listing</h1>
      <ListingForm />
    </div>
  );
}
