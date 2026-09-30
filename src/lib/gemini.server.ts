// The one Gemini client both AI features use: "Fill in from my photos" and
// "Write it for me". Server-only: it reads GEMINI_API_KEY, which must never
// reach the browser. One provider, one key to set.

import { GoogleGenAI } from "@google/genai";

/** Fast multimodal model; override with GEMINI_MODEL if your key needs another. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function geminiClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

/** The HTTP status of an error from the Gemini API, when there is one. */
export function geminiErrorStatus(error: unknown): number | undefined {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : undefined;
}
