// The Gemini call behind "Fill in from my photos". Server-only: it reads
// GEMINI_API_KEY, which must never reach the browser. Only the API route
// imports this file.

import { GoogleGenAI } from "@google/genai";
import {
  PHOTO_ANALYSIS_PROMPT,
  parsePhotoAnalysis,
  photoAnalysisJsonSchema,
  type PhotoAnalysis,
} from "./photo-analysis";

/** Fast multimodal model; override with GEMINI_MODEL if your key needs another. */
const DEFAULT_MODEL = "gemini-3.8-flash";

export function isPhotoAnalysisConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export type PhotoInput = {
  /** Base64, without a data: prefix. */
  data: string;
  mimeType: string;
};

/** Ask Gemini what the photos show. Throws if the call fails or the answer is unusable. */
export async function analyzePhotos(photos: PhotoInput[]): Promise<PhotoAnalysis> {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const interaction = await client.interactions.create({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    system_instruction: PHOTO_ANALYSIS_PROMPT,
    input: [
      {
        type: "text",
        text: `Here ${photos.length === 1 ? "is 1 photo" : `are ${photos.length} photos`} of the apartment.`,
      },
      ...photos.map((photo) => ({
        type: "image" as const,
        data: photo.data,
        mime_type: photo.mimeType,
      })),
    ],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: photoAnalysisJsonSchema,
    },
    // Students' photos are not kept on Google's side for later retrieval.
    store: false,
  });

  if (interaction.status && interaction.status !== "completed") {
    throw new Error(`Gemini finished with status "${interaction.status}".`);
  }
  if (!interaction.output_text) {
    throw new Error("Gemini returned no text.");
  }
  return parsePhotoAnalysis(interaction.output_text);
}
