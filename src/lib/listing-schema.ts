// Server-side validation for the listings API (Zod). The form on the
// client has its own friendlier checks; these are the rules the database
// actually enforces, so they are the source of truth.

import { z } from "zod";
import { CITIES } from "./types";

const isoDate = z.iso.date();

const listingFields = z.object({
  city: z.enum(CITIES),
  neighbourhood: z.string().trim().min(2).max(80),
  rent: z.number().int().min(1).max(10_000),
  currency: z.enum(["EUR", "CHF"]),
  availableFrom: isoDate,
  availableUntil: isoDate.nullable(),
  rooms: z.number().int().min(1).max(10),
  description: z.string().trim().min(20).max(2_000),
  photos: z.array(z.url()).max(10).default([]),
});

const datesInOrder = {
  check: (v: { availableFrom?: string; availableUntil?: string | null }) =>
    !v.availableUntil || !v.availableFrom || v.availableUntil >= v.availableFrom,
  message: "availableUntil must be on or after availableFrom",
  path: ["availableUntil"],
};

export const listingInputSchema = listingFields.refine(datesInOrder.check, datesInOrder);

/** PUT accepts any subset of the fields. */
export const listingUpdateSchema = listingFields.partial().refine(datesInOrder.check, datesInOrder);

export const listingStatusSchema = z.object({
  status: z.enum(["active", "taken"]),
});

/** Query string of GET /api/listings — matches the FilterBar URL params. */
export const listingFiltersSchema = z.object({
  city: z.enum(CITIES).optional(),
  maxRent: z.coerce.number().int().positive().optional(),
  availableFrom: isoDate.optional(),
  sort: z.enum(["newest", "cheapest", "expensive"]).optional(),
});
