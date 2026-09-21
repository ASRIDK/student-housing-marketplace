"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/types";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [maxRent, setMaxRent] = useState(searchParams.get("maxRent") ?? "");
  const [availableFrom, setAvailableFrom] = useState(
    searchParams.get("availableFrom") ?? "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  function updateUrl(next: {
    city: string;
    maxRent: string;
    availableFrom: string;
    sort: string;
  }) {
    const params = new URLSearchParams();
    if (next.city) params.set("city", next.city);
    if (next.maxRent) params.set("maxRent", next.maxRent);
    if (next.availableFrom) params.set("availableFrom", next.availableFrom);
    if (next.sort) params.set("sort", next.sort);
    router.push(params.size ? `/?${params.toString()}` : "/");
  }

  function handleCityChange(value: string) {
    setCity(value);
    updateUrl({ city: value, maxRent, availableFrom, sort });
  }

  function handleMaxRentChange(value: string) {
    setMaxRent(value);
    updateUrl({ city, maxRent: value, availableFrom, sort });
  }

  function handleAvailableFromChange(value: string) {
    setAvailableFrom(value);
    updateUrl({ city, maxRent, availableFrom: value, sort });
  }

  function handleSortChange(value: string) {
    setSort(value);
    updateUrl({ city, maxRent, availableFrom, sort: value });
  }

  function handleReset() {
    setCity("");
    setMaxRent("");
    setAvailableFrom("");
    setSort("");
    router.push("/");
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-xs font-medium text-zinc-600">
          City
        </label>
        <select
          id="city"
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="maxRent" className="text-xs font-medium text-zinc-600">
          Max rent
        </label>
        <input
          id="maxRent"
          type="number"
          min={0}
          placeholder="e.g. 900"
          value={maxRent}
          onChange={(e) => handleMaxRentChange(e.target.value)}
          className="w-28 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="availableFrom"
          className="text-xs font-medium text-zinc-600"
        >
          Available from
        </label>
        <input
          id="availableFrom"
          type="date"
          value={availableFrom}
          onChange={(e) => handleAvailableFromChange(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="text-xs font-medium text-zinc-600">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Newest</option>
          <option value="cheapest">Cheapest</option>
          <option value="expensive">Most expensive</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        Reset
      </button>
    </div>
  );
}
