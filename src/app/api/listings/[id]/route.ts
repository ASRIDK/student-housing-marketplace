// GET /api/listings/:id
// PUT /api/listings/:id   (body: partial ListingInput, owner only)

import { NextResponse } from "next/server";
import { getCurrentUserId, INVALID_JSON, jsonError, parseOr400, readJson } from "@/lib/api";
import { listingUpdateSchema } from "@/lib/listing-schema";
import { getListing, updateListing } from "@/lib/listings";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return jsonError(404, "Listing not found");
  return NextResponse.json(listing);
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const userId = await getCurrentUserId(request);
  if (!userId) return jsonError(401, "You must be logged in");

  const listing = await getListing(id);
  if (!listing) return jsonError(404, "Listing not found");
  if (listing.ownerId !== userId) return jsonError(403, "Only the owner can edit this listing");

  const body = await readJson(request);
  if (body === INVALID_JSON) return jsonError(400, "Body must be JSON");

  const parsed = parseOr400(listingUpdateSchema, body);
  if (!parsed.ok) return parsed.response;

  return NextResponse.json(await updateListing(id, parsed.data));
}
