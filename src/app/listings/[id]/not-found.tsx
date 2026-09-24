import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <h1 className="display text-3xl font-extrabold text-navy">
        That apartment is not here
      </h1>
      <p className="mt-3 leading-relaxed text-slate">
        It may have been taken over and removed, or the link picked up a typo
        on the way.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
      >
        Browse the apartments
      </Link>
    </div>
  );
}
