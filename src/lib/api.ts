// Small helpers shared by the route handlers in src/app/api.

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "./db";

/** Every error the API returns looks like { error, details? }. */
export function jsonError(status: number, error: string, details?: unknown) {
  return NextResponse.json(details === undefined ? { error } : { error, details }, { status });
}

/** Validate `data` with `schema`; on failure return a 400 response instead. */
export function parseOr400<T extends z.ZodType>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { ok: false as const, response: jsonError(400, "Invalid input", z.flattenError(result.error)) };
  }
  return { ok: true as const, data: result.data as z.output<T> };
}

/** Read the JSON body, or return a 400 if it is not valid JSON. */
export async function readJson(request: Request): Promise<unknown | typeof INVALID_JSON> {
  try {
    return await request.json();
  } catch {
    return INVALID_JSON;
  }
}
export const INVALID_JSON = Symbol("invalid-json");

/**
 * Who is making this request?
 *
 * TODO(auth): replace with the real session (Auth.js). Until then, in
 * development only, callers may pass an `x-user-id` header with the id of
 * a seeded user (e.g. "u-1") so the form can be built against the real
 * API. In production this header is ignored and every write is a 401.
 */
export async function getCurrentUserId(request: Request): Promise<string | null> {
  if (process.env.NODE_ENV === "production") return null;
  const id = request.headers.get("x-user-id");
  if (!id) return null;
  const user = await db.user.findUnique({ where: { id }, select: { id: true } });
  return user?.id ?? null;
}
