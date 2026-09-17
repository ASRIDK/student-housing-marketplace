// Shared data shapes. Every page and component codes against these.
// If you think a field is missing, ask Taoufik before adding it —
// the database schema must stay in sync with this file.

export type City = "Milan" | "Madrid" | "Geneva" | "Paris" | "Marseille";
export type Currency = "EUR" | "CHF";

export const CITIES: City[] = ["Milan", "Madrid", "Geneva", "Paris", "Marseille"];

export type Listing = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  city: City;
  neighbourhood: string; // e.g. "Navigli", "Malasaña"
  rent: number; // per month
  currency: Currency; // Geneva = CHF, others = EUR
  availableFrom: string; // ISO date "2026-01-15"
  availableUntil: string | null; // null = open-ended
  rooms: number; // 1 = studio
  description: string;
  photos: string[]; // image URLs (may be empty)
  status: "active" | "taken";
  createdAt: string; // ISO date-time
};

export type User = {
  id: string;
  name: string;
  email: string;
};
