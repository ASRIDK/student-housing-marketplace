"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * The search panel that sits on the navy hero. One white bar split into
 * segments, like a booking site's search control.
 *
 * City is deliberately NOT here — the campus tabs under the hero own that,
 * and two controls for one filter is one too many. Every change writes to
 * the URL, so a search can be shared or bookmarked.
 */
export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [maxRent, setMaxRent] = useState(searchParams.get("maxRent") ?? "");
  const [availableFrom, setAvailableFrom] = useState(
    searchParams.get("availableFrom") ?? "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  const city = searchParams.get("city") ?? "";
  const hasFilters = Boolean(maxRent || availableFrom || sort);

  function updateUrl(next: { maxRent: string; availableFrom: string; sort: string }) {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (next.maxRent) params.set("maxRent", next.maxRent);
    if (next.availableFrom) params.set("availableFrom", next.availableFrom);
    if (next.sort) params.set("sort", next.sort);
    router.push(params.size ? `/?${params.toString()}` : "/");
  }

  function handleMaxRentChange(value: string) {
    setMaxRent(value);
    updateUrl({ maxRent: value, availableFrom, sort });
  }

  function handleAvailableFromChange(value: string) {
    setAvailableFrom(value);
    updateUrl({ maxRent, availableFrom: value, sort });
  }

  function handleSortChange(value: string) {
    setSort(value);
    updateUrl({ maxRent, availableFrom, sort: value });
  }

  function handleReset() {
    setMaxRent("");
    setAvailableFrom("");
    setSort("");
    router.push(city ? `/?city=${city}` : "/");
  }

  return (
    <div className="rounded-3xl bg-white p-1.5 shadow-lg shadow-navy/20 sm:rounded-full">
      <div
        className={`grid gap-1 sm:items-center ${
          hasFilters ? "sm:grid-cols-[1.1fr_1fr_1.1fr_auto]" : "sm:grid-cols-3"
        }`}
      >
        <div className="rounded-2xl px-4 py-2.5 sm:rounded-full">
          <label htmlFor="availableFrom" className="block text-xs font-semibold text-navy">
            Move in
          </label>
          <input
            id="availableFrom"
            type="date"
            value={availableFrom}
            onChange={(event) => handleAvailableFromChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate outline-none"
          />
        </div>

        <div className="border-line px-4 py-2.5 sm:border-l">
          <label htmlFor="maxRent" className="block text-xs font-semibold text-navy">
            Max rent
          </label>
          <input
            id="maxRent"
            type="number"
            min={0}
            step={50}
            inputMode="numeric"
            placeholder="Any"
            value={maxRent}
            onChange={(event) => handleMaxRentChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate outline-none placeholder:text-slate/70"
          />
        </div>

        <div className="border-line px-4 py-2.5 sm:border-l">
          <label htmlFor="sort" className="block text-xs font-semibold text-navy">
            Show first
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => handleSortChange(event.target.value)}
            className="w-full bg-transparent text-sm text-slate outline-none"
          >
            <option value="">Newest</option>
            <option value="cheapest">Lowest rent</option>
            <option value="expensive">Highest rent</option>
          </select>
        </div>

        {/* Only shown when there is something to clear — an always-there
            disabled button is just noise. */}
        {hasFilters && (
          <div className="px-1.5 pb-1.5 sm:p-0 sm:pr-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 sm:w-auto"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
