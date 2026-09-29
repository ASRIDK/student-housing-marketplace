// POST /api/ai/describe   (body: DescribeInput, auth required)
// Returns { description } drafted by Claude from the listing form's fields.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentUserId, INVALID_JSON, jsonError, parseOr400, readJson } from "@/lib/api";
import {
  describeInputSchema,
  DescriptionUnavailableError,
  writeDescription,
} from "@/lib/ai-description";

export async function POST(request: Request) {
  // Every call costs money, so only logged-in users may use it.
  const userId = await getCurrentUserId(request);
  if (!userId) return jsonError(401, "You must be logged in to use the AI writer");

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(503, "The AI writer is not set up yet (missing ANTHROPIC_API_KEY)");
  }

  const body = await readJson(request);
  if (body === INVALID_JSON) return jsonError(400, "Body must be JSON");

  const parsed = parseOr400(describeInputSchema, body);
  if (!parsed.ok) return parsed.response;

  try {
    const description = await writeDescription(parsed.data);
    return NextResponse.json({ description });
  } catch (error) {
    if (error instanceof DescriptionUnavailableError) {
      return jsonError(502, error.message);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return jsonError(429, "The AI writer is busy. Try again in a minute.");
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Claude API error", error.status, error.message);
      return jsonError(502, "The AI writer failed. Please try again.");
    }
    throw error;
  }
}
