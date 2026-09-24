import type { Metadata } from "next";
import ListingForm from "@/components/ListingForm";

export const metadata: Metadata = {
  title: "Post a listing",
};

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold">Post a listing</h1>
      <ListingForm />
    </div>
  );
}
