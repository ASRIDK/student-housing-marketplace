// Formatting helpers. Use these everywhere so all pages show dates and
// prices the same way (and to avoid hydration mismatches from calling
// new Date() inside JSX).

import type { Currency } from "./types";

/** "2026-01-15" -> "15 Jan 2026" */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** 850, "EUR" -> "€850 / month" ; 1400, "CHF" -> "CHF 1,400 / month" */
export function formatRent(rent: number, currency: Currency): string {
  const amount = rent.toLocaleString("en-GB");
  return currency === "EUR" ? `€${amount} / month` : `CHF ${amount} / month`;
}

/** 1 -> "Studio", 2 -> "2 rooms" */
export function formatRooms(rooms: number): string {
  return rooms === 1 ? "Studio" : `${rooms} rooms`;
}

/** 850, "EUR" -> "€850" — the bare amount, for when the card styles the
 * "/ month" part separately. */
export function formatAmount(rent: number, currency: Currency): string {
  const amount = rent.toLocaleString("en-GB");
  return currency === "EUR" ? `€${amount}` : `CHF ${amount}`;
}

/**
 * The handover window, short enough for a card.
 * ("2026-10-01", "2027-06-30") -> "Oct 2026 – Jun 2027"
 * ("2026-10-01", null)         -> "From Oct 2026, open-ended"
 */
export function formatWindow(from: string, until: string | null): string {
  const month = (iso: string) => {
    const [year, monthNumber] = iso.split("-").map(Number);
    return new Date(Date.UTC(year, monthNumber - 1, 1)).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };
  return until ? `${month(from)} – ${month(until)}` : `From ${month(from)}, open-ended`;
}
