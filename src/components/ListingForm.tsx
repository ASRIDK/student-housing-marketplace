"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { City, Currency, Listing } from "@/lib/types";
import {
  validateListingForm,
  isListingFormValid,
  type ListingFormValues,
  type ListingFormErrors,
} from "@/lib/validation";

const CITIES: City[] = ["Milan", "Madrid", "Geneva", "Paris", "Marseille"];
const CURRENCIES: Currency[] = ["EUR", "CHF"];
const MAX_PHOTOS = 5;
const MAX_DESCRIPTION = 2000;

type ListingFormProps = {
  initial?: Listing;
};

type Touched = Partial<Record<keyof ListingFormValues, boolean>>;

type PhotoPreview = {
  file: File;
  url: string;
};

function emptyValues(): ListingFormValues {
  return {
    city: "",
    neighbourhood: "",
    rent: "",
    currency: "EUR",
    rooms: "",
    availableFrom: "",
    availableUntil: "",
    openEnded: false,
    description: "",
  };
}

function valuesFromListing(listing: Listing): ListingFormValues {
  return {
    city: listing.city,
    neighbourhood: listing.neighbourhood,
    rent: String(listing.rent),
    currency: listing.currency,
    rooms: String(listing.rooms),
    availableFrom: listing.availableFrom,
    availableUntil: listing.availableUntil ?? "",
    openEnded: listing.availableUntil === null,
    description: listing.description,
  };
}

// Bonus: keep an in-progress draft in localStorage so a refresh doesn't
// lose the form. Photos aren't included (Files aren't JSON-serialisable
// and nothing is uploaded yet anyway).
const DRAFT_PREFIX = "studentswap:listing-draft:";

function draftKey(initial?: Listing): string {
  return initial ? `${DRAFT_PREFIX}edit:${initial.id}` : `${DRAFT_PREFIX}new`;
}

function loadDraft(key: string): ListingFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ListingFormValues) : null;
  } catch {
    return null;
  }
}

function saveDraft(key: string, values: ListingFormValues) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // localStorage unavailable (private browsing, quota…) — ignore
  }
}

function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export default function ListingForm({ initial }: ListingFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const storageKey = draftKey(initial);

  const [values, setValues] = useState<ListingFormValues>(() => {
    const draft = loadDraft(storageKey);
    if (draft) return draft;
    return initial ? valuesFromListing(initial) : emptyValues();
  });

  useEffect(() => {
    saveDraft(storageKey, values);
  }, [storageKey, values]);
  const [touched, setTouched] = useState<Touched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [existingPhotoUrls] = useState<string[]>(initial?.photos ?? []);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const photosRef = useRef<PhotoPreview[]>([]);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  const errors: ListingFormErrors = validateListingForm(values);
  const formValid = isListingFormValid(values);

  function showError(field: keyof ListingFormValues): string | undefined {
    if (!touched[field] && !submitAttempted) return undefined;
    return errors[field];
  }

  function setField<K extends keyof ListingFormValues>(
    field: K,
    value: ListingFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof ListingFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleCityChange(city: City) {
    setValues((prev) => ({
      ...prev,
      city,
      currency: city === "Geneva" ? "CHF" : "EUR",
    }));
  }

  function handleOpenEndedChange(openEnded: boolean) {
    setValues((prev) => ({
      ...prev,
      openEnded,
      availableUntil: openEnded ? "" : prev.availableUntil,
    }));
  }

  function handlePhotosChange(fileList: FileList | null, input: HTMLInputElement) {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );

    const alreadyUsed = existingPhotoUrls.length + photos.length;
    const total = alreadyUsed + incoming.length;
    if (total > MAX_PHOTOS) {
      setPhotoError(`You can upload at most ${MAX_PHOTOS} photos.`);
    } else {
      setPhotoError(undefined);
    }

    const accepted = incoming.slice(0, Math.max(0, MAX_PHOTOS - alreadyUsed));
    const newPreviews = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPreviews]);
    // allow re-selecting the same file(s) later
    input.value = "";
  }

  function removePhoto(url: string) {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.url === url);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((photo) => photo.url !== url);
    });
    setPhotoError(undefined);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!formValid || isSubmitting) return;

    setIsSubmitting(true);
    setSavedMessage(false);

    // Object matching the Listing type, minus the fields the API fills in
    // (id, ownerId, ownerName, ownerEmail, createdAt, status, photos).
    const data = {
      city: values.city,
      neighbourhood: values.neighbourhood.trim(),
      rent: Number(values.rent),
      currency: values.currency,
      rooms: Number(values.rooms),
      availableFrom: values.availableFrom,
      availableUntil: values.openEnded ? null : values.availableUntil,
      description: values.description.trim(),
    };

    // TODO(upload): send `photos` (File[]) to Taoufik's upload function
    // once it exists, then include the resulting URLs in `data.photos`.

    // TODO(api): swap the console.log below for the real call once
    // Taoufik's API route is ready.
    //
    // const response = isEdit
    //   ? await fetch(`/api/listings/${initial!.id}`, {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(data),
    //     })
    //   : await fetch("/api/listings", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(data),
    //     });

    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 400));

    setIsSubmitting(false);
    setSavedMessage(true);
    clearDraft(storageKey);
    router.push("/my-listings");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6 p-4">
      {savedMessage && (
        <p className="rounded-md bg-green-100 p-3 text-sm text-green-800">
          Saved! (fake)
        </p>
      )}

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium">
          City
        </label>
        <select
          id="city"
          value={values.city}
          onChange={(e) => handleCityChange(e.target.value as City)}
          onBlur={() => handleBlur("city")}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Select a city…</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {showError("city") && (
          <p className="mt-1 text-sm text-red-600">{showError("city")}</p>
        )}
      </div>

      {/* Neighbourhood */}
      <div>
        <label htmlFor="neighbourhood" className="block text-sm font-medium">
          Neighbourhood
        </label>
        <input
          id="neighbourhood"
          type="text"
          value={values.neighbourhood}
          onChange={(e) => setField("neighbourhood", e.target.value)}
          onBlur={() => handleBlur("neighbourhood")}
          placeholder="e.g. Navigli"
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
        {showError("neighbourhood") && (
          <p className="mt-1 text-sm text-red-600">
            {showError("neighbourhood")}
          </p>
        )}
      </div>

      {/* Rent + currency */}
      <div>
        <label htmlFor="rent" className="block text-sm font-medium">
          Monthly rent
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="rent"
            type="number"
            min={0}
            value={values.rent}
            onChange={(e) => setField("rent", e.target.value)}
            onBlur={() => handleBlur("rent")}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <select
            aria-label="Currency"
            value={values.currency}
            onChange={(e) => setField("currency", e.target.value as Currency)}
            className="rounded-md border border-gray-300 p-2"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        {showError("rent") && (
          <p className="mt-1 text-sm text-red-600">{showError("rent")}</p>
        )}
      </div>

      {/* Rooms */}
      <div>
        <label htmlFor="rooms" className="block text-sm font-medium">
          Rooms
        </label>
        <input
          id="rooms"
          type="number"
          min={1}
          max={10}
          value={values.rooms}
          onChange={(e) => setField("rooms", e.target.value)}
          onBlur={() => handleBlur("rooms")}
          placeholder="1 = studio"
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
        {showError("rooms") && (
          <p className="mt-1 text-sm text-red-600">{showError("rooms")}</p>
        )}
      </div>

      {/* Available from */}
      <div>
        <label htmlFor="availableFrom" className="block text-sm font-medium">
          Available from
        </label>
        <input
          id="availableFrom"
          type="date"
          value={values.availableFrom}
          onChange={(e) => setField("availableFrom", e.target.value)}
          onBlur={() => handleBlur("availableFrom")}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
        {showError("availableFrom") && (
          <p className="mt-1 text-sm text-red-600">
            {showError("availableFrom")}
          </p>
        )}
      </div>

      {/* Available until */}
      <div>
        <label htmlFor="availableUntil" className="block text-sm font-medium">
          Available until
        </label>
        <input
          id="availableUntil"
          type="date"
          value={values.availableUntil}
          disabled={values.openEnded}
          onChange={(e) => setField("availableUntil", e.target.value)}
          onBlur={() => handleBlur("availableUntil")}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
        />
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.openEnded}
            onChange={(e) => handleOpenEndedChange(e.target.checked)}
          />
          Open-ended
        </label>
        {showError("availableUntil") && (
          <p className="mt-1 text-sm text-red-600">
            {showError("availableUntil")}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          maxLength={MAX_DESCRIPTION}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-red-600">{showError("description")}</span>
          <span className="text-gray-500">
            {values.description.length}/{MAX_DESCRIPTION}
          </span>
        </div>
      </div>

      {/* Photos */}
      <div>
        <label htmlFor="photos" className="block text-sm font-medium">
          Photos
        </label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          disabled={existingPhotoUrls.length + photos.length >= MAX_PHOTOS}
          onChange={(e) => handlePhotosChange(e.target.files, e.target)}
          className="mt-1 w-full text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Up to {MAX_PHOTOS} images. {/* TODO(upload) */}
        </p>
        {photoError && (
          <p className="mt-1 text-sm text-red-600">{photoError}</p>
        )}

        {(existingPhotoUrls.length > 0 || photos.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {existingPhotoUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt="Existing listing photo"
                className="h-20 w-20 rounded-md object-cover"
              />
            ))}
            {photos.map((photo) => (
              <div key={photo.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="New listing photo preview"
                  className="h-20 w-20 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.url)}
                  className="absolute -right-1 -top-1 rounded-full bg-gray-900/80 px-1.5 text-xs text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={!formValid || isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Publish"}
        </button>
        <Link
          href="/my-listings"
          onClick={() => clearDraft(storageKey)}
          className="text-sm text-gray-600 underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
