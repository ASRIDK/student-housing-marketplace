// Shared data shape — see tasks/00-EVERYONE-READ-THIS-FIRST.txt
// NOTE: temporary placeholder so this branch type-checks before Taoufik
// merges the real skeleton. Matches the documented shape exactly.

export type City = "Milan" | "Madrid" | "Geneva" | "Paris" | "Marseille";
export type Currency = "EUR" | "CHF";

export type Listing = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  city: City;
  neighbourhood: string;
  rent: number;
  currency: Currency;
  availableFrom: string; // ISO date "2026-01-15"
  availableUntil: string | null; // null = open-ended
  rooms: number; // 1 = studio
  description: string;
  photos: string[];
  status: "active" | "taken";
  createdAt: string; // ISO date-time
};

export type User = {
  id: string;
  name: string;
  email: string;
};
