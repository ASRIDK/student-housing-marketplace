import Link from "next/link";

/** No results is a dead end unless it offers a way out. */
export default function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line bg-mist px-6 py-16 text-center">
      <p className="title text-lg font-bold text-navy">
        Nothing matches that search yet
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate">
        Try another campus, raise the rent limit, or move the date. New places
        go up every week as students plan their next semester.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
        >
          Clear the filters
        </Link>
        <Link
          href="/listings/new"
          className="rounded-full border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-white"
        >
          Post your own place
        </Link>
      </div>
    </div>
  );
}
