// Bonus: keep an in-progress listing-form draft in localStorage so a
// refresh doesn't lose the form. Photos aren't included (Files aren't
// JSON-serialisable and nothing is uploaded yet anyway).
import type { Listing } from "./types";
import type { ListingFormValues } from "./validation";

const DRAFT_PREFIX = "studentswap:listing-draft:";

export function draftKey(initial?: Listing): string {
  return initial ? `${DRAFT_PREFIX}edit:${initial.id}` : `${DRAFT_PREFIX}new`;
}

export function loadDraft(key: string): ListingFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ListingFormValues) : null;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, values: ListingFormValues) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // localStorage unavailable (private browsing, quota…) — ignore
  }
}

export function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
