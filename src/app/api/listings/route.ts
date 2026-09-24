// GET  /api/listings?city=Milan&maxRent=900&availableFrom=2026-10-01&sort=cheapest
// POST /api/listings   (body: ListingInput, auth required)

import { NextResponse } from "next/server";
import { getCurrentUserId, INVALID_JSON, jsonError, parseOr400, readJson } from "@/lib/api";
import { listingFiltersSchema, listingInputSchema } from "@/lib/listing-schema";
import { createListing, getListings } from "@/lib/listings";

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = parseOr400(listingFiltersSchema, params);
  if (!parsed.ok) return parsed.response;

  const listings = await getListings(parsed.data);
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId(request);
  if (!userId) return jsonError(401, "You must be logged in to post a listing");

  const body = await readJson(request);
  if (body === INVALID_JSON) return jsonError(400, "Body must be JSON");

  const parsed = parseOr400(listingInputSchema, body);
  if (!parsed.ok) return parsed.response;

  const listing = await createListing(userId, parsed.data);
  return NextResponse.json(listing, { status: 201 });
}
