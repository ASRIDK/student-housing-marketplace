// All database access for listings lives here. Pages (server components)
// and the API route handlers both call these functions, so the two never
// disagree on filtering rules. Everything returns the shared `Listing`
// shape from ./types — the UI does not know Prisma exists.

import type { Prisma } from "@/generated/prisma/client";
import { db } from "./db";
import type { City, Currency, Listing } from "./types";

export type ListingSort = "newest" | "cheapest" | "expensive";

export type ListingFilters = {
  city?: City;
  /** Keep listings whose rent is at most this amount. */
  maxRent?: number;
  /** ISO date "2026-10-01": keep listings available on or before it. */
  availableFrom?: string;
  sort?: ListingSort;
  /** Defaults to active listings only. */
  status?: Listing["status"] | "all";
};

export type ListingInput = {
  city: City;
  neighbourhood: string;
  rent: number;
  currency: Currency;
  availableFrom: string;
  availableUntil: string | null;
  rooms: number;
  description: string;
  photos: string[];
};

const withOwner = { owner: { select: { name: true, email: true } } } as const;

type ListingRow = Prisma.ListingGetPayload<{ include: typeof withOwner }>;

/** ISO date without the time part, e.g. "2026-10-01". */
function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    ownerId: row.ownerId,
    ownerName: row.owner.name,
    ownerEmail: row.owner.email,
    city: row.city,
    neighbourhood: row.neighbourhood,
    rent: row.rent,
    currency: row.currency,
    availableFrom: toIsoDate(row.availableFrom),
    availableUntil: row.availableUntil ? toIsoDate(row.availableUntil) : null,
    rooms: row.rooms,
    description: row.description,
    photos: row.photos,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

const orderBy: Record<ListingSort, Prisma.ListingOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  cheapest: { rent: "asc" },
  expensive: { rent: "desc" },
};

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const status = filters.status ?? "active";
  const rows = await db.listing.findMany({
    where: {
      ...(status !== "all" && { status }),
      ...(filters.city && { city: filters.city }),
      ...(filters.maxRent !== undefined && { rent: { lte: filters.maxRent } }),
      ...(filters.availableFrom && { availableFrom: { lte: new Date(filters.availableFrom) } }),
    },
    orderBy: orderBy[filters.sort ?? "newest"],
    include: withOwner,
  });
  return rows.map(toListing);
}

export async function getListing(id: string): Promise<Listing | null> {
  const row = await db.listing.findUnique({ where: { id }, include: withOwner });
  return row ? toListing(row) : null;
}

export async function getListingsByOwner(ownerId: string): Promise<Listing[]> {
  const rows = await db.listing.findMany({
    where: { ownerId },
    orderBy: orderBy.newest,
    include: withOwner,
  });
  return rows.map(toListing);
}

export async function createListing(ownerId: string, input: ListingInput): Promise<Listing> {
  const row = await db.listing.create({
    data: {
      ownerId,
      ...input,
      availableFrom: new Date(input.availableFrom),
      availableUntil: input.availableUntil ? new Date(input.availableUntil) : null,
    },
    include: withOwner,
  });
  return toListing(row);
}

export async function updateListing(id: string, input: Partial<ListingInput>): Promise<Listing> {
  const { availableFrom, availableUntil, ...rest } = input;
  const row = await db.listing.update({
    where: { id },
    data: {
      ...rest,
      ...(availableFrom !== undefined && { availableFrom: new Date(availableFrom) }),
      ...(availableUntil !== undefined && {
        availableUntil: availableUntil ? new Date(availableUntil) : null,
      }),
    },
    include: withOwner,
  });
  return toListing(row);
}

export async function setListingStatus(id: string, status: Listing["status"]): Promise<Listing> {
  const row = await db.listing.update({ where: { id }, data: { status }, include: withOwner });
  return toListing(row);
}
