"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CITIES, type City, type Currency, type Listing } from "@/lib/types";
import {
  validateListingForm,
  isListingFormValid,
  type ListingFormValues,
  type ListingFormErrors,
} from "@/lib/validation";
import { devUserHeader } from "@/lib/dev-user";
import { formatRooms } from "@/lib/format";
import type { PhotoAnalysis } from "@/lib/photo-analysis";
import { shrinkPhoto } from "@/lib/shrink-photo";

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

const ANALYSIS_FAILED = "We couldn't read these photos. Try again, or fill in the form yourself.";

/** "bedroom" x2 -> "Bedroom ×2" */
function spaceLabel(space: string, count: number): string {
  const name = space.charAt(0).toUpperCase() + space.slice(1);
  return count > 1 ? `${name} ×${count}` : name;
}

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
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [isWriting, setIsWriting] = useState(false);
  const [writeError, setWriteError] = useState<string | undefined>();

  const [existingPhotoUrls] = useState<string[]>(initial?.photos ?? []);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const photosRef = useRef<PhotoPreview[]>([]);

  // "Fill in from my photos": the analysis is only a suggestion until the
  // student presses "Use these details".
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | undefined>();
  const [filledFromPhotos, setFilledFromPhotos] = useState(false);

  // Keep the ref in sync in an effect (never during render) so the cleanup
  // below can revoke the preview URLs of whatever is on screen at unmount.
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

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
    // A suggestion made from the old set of photos no longer applies.
    setAnalysis(null);
    setAnalysisError(undefined);
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
    setAnalysis(null);
    setAnalysisError(undefined);
  }

  async function handleAnalyzePhotos() {
    if (photos.length === 0 || analyzing) return;

    setAnalyzing(true);
    setAnalysisError(undefined);
    setFilledFromPhotos(false);

    try {
      const body = new FormData();
      const shrunk = await Promise.all(photos.map((photo) => shrinkPhoto(photo.file)));
      shrunk.forEach((blob, index) => body.append("photos", blob, photos[index].file.name));

      const response = await fetch("/api/ai/analyze-photos", {
        method: "POST",
        headers: devUserHeader(),
        body,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.analysis) {
        setAnalysisError(payload.error ?? ANALYSIS_FAILED);
        return;
      }
      setAnalysis(payload.analysis as PhotoAnalysis);
    } catch {
      setAnalysisError("Couldn't reach StudentSwap. Check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function applyAnalysis() {
    if (!analysis?.isApartment) return;
    const { rooms, description } = analysis;
    setValues((prev) => ({
      ...prev,
      rooms: String(rooms),
      description: description.slice(0, MAX_DESCRIPTION),
    }));
    setTouched((prev) => ({ ...prev, rooms: true, description: true }));
    setAnalysis(null);
    setFilledFromPhotos(true);
  }

  // The AI writer needs the basic facts before it can say anything useful.
  const canWriteDescription =
    !errors.city && !errors.neighbourhood && !errors.rent && !errors.rooms;

  async function handleWriteDescription() {
    if (!canWriteDescription || isWriting) return;
    setIsWriting(true);
    setWriteError(undefined);

    const response = await fetch("/api/ai/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...devUserHeader() },
      body: JSON.stringify({
        city: values.city,
        neighbourhood: values.neighbourhood.trim(),
        rent: Number(values.rent),
        currency: values.currency,
        rooms: Number(values.rooms),
        availableFrom: values.availableFrom || undefined,
        availableUntil: values.openEnded ? null : values.availableUntil || undefined,
        // Anything already typed is sent as notes for the AI to build on.
        notes: values.description.trim() || undefined,
      }),
    }).catch(() => null);

    const result = await response?.json().catch(() => ({}));
    setIsWriting(false);
    if (!response?.ok || typeof result?.description !== "string") {
      setWriteError(result?.error ?? "The AI writer failed. Please try again.");
      return;
    }
    setField("description", result.description);
    setTouched((prev) => ({ ...prev, description: true }));
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
    const body = { ...data, photos: existingPhotoUrls };

    const response = isEdit
      ? await fetch(`/api/listings/${initial!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...devUserHeader() },
          body: JSON.stringify(body),
        })
      : await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...devUserHeader() },
          body: JSON.stringify(body),
        });

    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      setIsSubmitting(false);
      setSubmitError(problem.error ?? "Something went wrong. Please try again.");
      return;
    }

    setIsSubmitting(false);
    setSavedMessage(true);
    clearDraft(storageKey);
    router.push("/my-listings");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-6">
      {savedMessage && (
        <p className="rounded-xl bg-positive/10 px-4 py-3 text-sm font-medium text-positive">
          Saved!
        </p>
      )}

      {submitError && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {submitError}
        </p>
      )}

      {/* Photos come first: the student can let them fill in the rooms and
          a first description, or skip this and fill in the form by hand. */}
      <section aria-labelledby="photos-heading" className="rounded-3xl border border-line p-5 sm:p-6">
        <h2 id="photos-heading" className="text-base font-semibold text-navy">
          Photos
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate">
          Start with photos and we can fill in the rooms and a first description
          for you. Or skip this and fill in the form yourself.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {existingPhotoUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt="Current listing photo"
              className="h-20 w-20 rounded-xl object-cover"
            />
          ))}
          {photos.map((photo) => (
            <div key={photo.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt="New photo"
                className="h-20 w-20 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.url)}
                disabled={analyzing}
                className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy text-xs text-white disabled:opacity-40"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
          {existingPhotoUrls.length + photos.length < MAX_PHOTOS && (
            <label
              htmlFor="photos"
              className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed border-slate/50 px-2 text-center text-xs font-semibold leading-tight text-deep transition hover:border-sky hover:bg-mist has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-sky"
            >
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                disabled={analyzing}
                onChange={(e) => handlePhotosChange(e.target.files, e.target)}
                className="sr-only"
              />
              + Add photos
            </label>
          )}
        </div>
        <p className="mt-2 text-xs text-slate">Up to {MAX_PHOTOS} photos.</p>
        {photoError && (
          <p className="mt-1.5 text-xs text-danger">{photoError}</p>
        )}

        <div className="mt-5 border-t border-line pt-5">
          {analysis ? (
            <div role="status" className="rounded-2xl bg-mist p-4">
              {analysis.isApartment ? (
                <>
                  <p className="text-sm font-semibold text-navy">What we saw</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    <li className="rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-white">
                      {formatRooms(analysis.rooms)}
                    </li>
                    {analysis.spaces.map(({ space, count }, index) => (
                      <li
                        key={`space-${index}`}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink"
                      >
                        {spaceLabel(space, count)}
                      </li>
                    ))}
                    {analysis.features.map((feature, index) => (
                      <li
                        key={`feature-${index}`}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {analysis.roomsConfidence !== "high" && (
                    <p className="mt-2 text-xs text-slate">
                      Photos rarely show every room, so check the room count.
                    </p>
                  )}
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink">
                    {analysis.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={applyAnalysis}
                      className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
                    >
                      {values.description.trim()
                        ? "Replace my description and rooms"
                        : "Use these details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalysis(null)}
                      className="text-sm font-medium text-deep underline underline-offset-4"
                    >
                      Not now
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-ink">
                    These photos don&apos;t look like the inside of an apartment,
                    so nothing was filled in. Try photos of the rooms, or fill in
                    the form yourself.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAnalysis(null)}
                    className="mt-3 text-sm font-medium text-deep underline underline-offset-4"
                  >
                    OK
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAnalyzePhotos}
                disabled={photos.length === 0 || analyzing}
                className="rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-navy transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {analyzing ? "Looking at your photos…" : "Fill in from my photos"}
              </button>
              <p className="mt-2 text-xs text-slate">
                {photos.length === 0
                  ? "Add a photo first."
                  : "We count the rooms and draft a description from what the photos show. You can change everything afterwards."}
              </p>
            </>
          )}
          {analysisError && (
            <p role="alert" className="mt-2 text-xs text-danger">
              {analysisError}
            </p>
          )}
          {filledFromPhotos && (
            <p role="status" className="mt-2 text-xs font-medium text-positive">
              Filled in from your photos. Check the rooms and the description below.
            </p>
          )}
        </div>
      </section>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-navy">
          City
        </label>
        <select
          id="city"
          value={values.city}
          onChange={(e) => handleCityChange(e.target.value as City)}
          onBlur={() => handleBlur("city")}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        >
          <option value="">Select a city…</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {showError("city") && (
          <p className="mt-1.5 text-xs text-danger">{showError("city")}</p>
        )}
      </div>

      {/* Neighbourhood */}
      <div>
        <label htmlFor="neighbourhood" className="block text-sm font-medium text-navy">
          Neighbourhood
        </label>
        <input
          id="neighbourhood"
          type="text"
          value={values.neighbourhood}
          onChange={(e) => setField("neighbourhood", e.target.value)}
          onBlur={() => handleBlur("neighbourhood")}
          placeholder="e.g. Navigli"
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        />
        {showError("neighbourhood") && (
          <p className="mt-1.5 text-xs text-danger">
            {showError("neighbourhood")}
          </p>
        )}
      </div>

      {/* Rent + currency */}
      <div>
        <label htmlFor="rent" className="block text-sm font-medium text-navy">
          Monthly rent
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="rent"
            type="number"
            min={0}
            value={values.rent}
            onChange={(e) => setField("rent", e.target.value)}
            onBlur={() => handleBlur("rent")}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky mt-0"
          />
          <select
            aria-label="Currency"
            value={values.currency}
            onChange={(e) => setField("currency", e.target.value as Currency)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky mt-0 w-auto"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        {showError("rent") && (
          <p className="mt-1.5 text-xs text-danger">{showError("rent")}</p>
        )}
      </div>

      {/* Rooms */}
      <div>
        <label htmlFor="rooms" className="block text-sm font-medium text-navy">
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
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        />
        {showError("rooms") && (
          <p className="mt-1.5 text-xs text-danger">{showError("rooms")}</p>
        )}
      </div>

      {/* Available from */}
      <div>
        <label htmlFor="availableFrom" className="block text-sm font-medium text-navy">
          Available from
        </label>
        <input
          id="availableFrom"
          type="date"
          value={values.availableFrom}
          onChange={(e) => setField("availableFrom", e.target.value)}
          onBlur={() => handleBlur("availableFrom")}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        />
        {showError("availableFrom") && (
          <p className="mt-1.5 text-xs text-danger">
            {showError("availableFrom")}
          </p>
        )}
      </div>

      {/* Available until */}
      <div>
        <label htmlFor="availableUntil" className="block text-sm font-medium text-navy">
          Available until
        </label>
        <input
          id="availableUntil"
          type="date"
          value={values.availableUntil}
          disabled={values.openEnded}
          onChange={(e) => setField("availableUntil", e.target.value)}
          onBlur={() => handleBlur("availableUntil")}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky disabled:bg-mist disabled:text-slate"
        />
        <label className="mt-2.5 flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            checked={values.openEnded}
            onChange={(e) => handleOpenEndedChange(e.target.checked)}
          />
          Open-ended
        </label>
        {showError("availableUntil") && (
          <p className="mt-1.5 text-xs text-danger">
            {showError("availableUntil")}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="description" className="block text-sm font-medium text-navy">
            Description
          </label>
          <button
            type="button"
            onClick={handleWriteDescription}
            disabled={!canWriteDescription || isWriting}
            title={
              canWriteDescription
                ? "Draft a description from the details above. Anything you already wrote is used as notes."
                : "Fill in city, neighbourhood, rent and rooms first."
            }
            className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-deep transition hover:border-sky disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isWriting ? "Writing…" : "✨ Write it for me"}
          </button>
        </div>
        <textarea
          id="description"
          rows={5}
          maxLength={MAX_DESCRIPTION}
          value={values.description}
          disabled={isWriting}
          onChange={(e) => setField("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        />
        <div className="mt-1.5 flex justify-between text-xs text-slate">
          <span className="text-danger">{showError("description")}</span>
          <span className="text-slate">
            {values.description.length}/{MAX_DESCRIPTION}
          </span>
        </div>
        {writeError && (
          <p role="alert" className="mt-1.5 text-xs text-danger">{writeError}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={!formValid || isSubmitting}
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
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
          className="text-sm font-medium text-deep underline underline-offset-4"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
