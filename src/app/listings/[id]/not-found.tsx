import Link from "next/link";

export default function ListingNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl" aria-hidden>🏠</p>
      <h1 className="mt-4 text-2xl font-semibold">This listing doesn&apos;t exist</h1>
      <p className="mt-2 text-neutral-600">
        The apartment you&apos;re looking for may have been taken over already, or the
        link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Back to listings
      </Link>
    </main>
  );
}
