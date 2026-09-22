// PATCH /api/listings/:id/status   (body: { status: "active" | "taken" }, owner only)

import { NextResponse } from "next/server";
import { getCurrentUserId, INVALID_JSON, jsonError, parseOr400, readJson } from "@/lib/api";
import { listingStatusSchema } from "@/lib/listing-schema";
import { getListing, setListingStatus } from "@/lib/listings";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const userId = await getCurrentUserId(request);
  if (!userId) return jsonError(401, "You must be logged in");

  const listing = await getListing(id);
  if (!listing) return jsonError(404, "Listing not found");
  if (listing.ownerId !== userId) return jsonError(403, "Only the owner can change this listing");

  const body = await readJson(request);
  if (body === INVALID_JSON) return jsonError(400, "Body must be JSON");

  const parsed = parseOr400(listingStatusSchema, body);
  if (!parsed.ok) return parsed.response;

  return NextResponse.json(await setListingStatus(id, parsed.data.status));
}
