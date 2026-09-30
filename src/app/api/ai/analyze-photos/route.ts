// POST /api/ai/analyze-photos
//
// Body: multipart/form-data with 1–5 files under the field "photos".
// Returns { analysis } — the room count, the spaces and features seen, and
// a draft description — for the listing form to offer to the student.

import { NextResponse } from "next/server";
import { getCurrentUserId, jsonError } from "@/lib/api";
import { checkAnalysisPhotos } from "@/lib/photo-analysis";
import { analyzePhotos, isPhotoAnalysisConfigured } from "@/lib/photo-analysis.server";

export async function POST(request: Request) {
  // Every call costs money, so only signed-in students can make one.
  const userId = await getCurrentUserId(request);
  if (!userId) return jsonError(401, "Log in to fill in a listing from photos.");

  if (!isPhotoAnalysisConfigured()) {
    return jsonError(503, "Filling in from photos is not set up yet. Fill in the form yourself for now.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Send the photos as multipart form data under \"photos\".");
  }

  const files = form.getAll("photos").filter((value): value is File => value instanceof File);
  const problem = checkAnalysisPhotos(files.map((file) => ({ type: file.type, size: file.size })));
  if (problem) return jsonError(400, problem);

  const photos = await Promise.all(
    files.map(async (file) => ({
      mimeType: file.type,
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
    }))
  );

  try {
    const analysis = await analyzePhotos(photos);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("[analyze-photos]", error);
    return jsonError(502, "We couldn't read these photos. Try again, or fill in the form yourself.");
  }
}
