// The one Gemini client both AI features use: "Fill in from my photos" and
// "Write it for me". Server-only: it reads GEMINI_API_KEY, which must never
// reach the browser. One provider, one key to set.

import { GoogleGenAI } from "@google/genai";

/**
 * Models tried in order. The newest goes first; when it is overloaded
 * (Google answers 503 within a few seconds) or too slow, the next one gets
 * the request, so a busy model never fails the feature. Override with
 * GEMINI_MODEL (the first) and GEMINI_FALLBACK_MODELS (comma-separated).
 */
export const GEMINI_MODELS: string[] = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  ...(process.env.GEMINI_FALLBACK_MODELS || "gemini-3.6-flash,gemini-3.5-flash-lite")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean),
];

/** Per model: fail fast and move on, rather than retry the same busy model. */
export const GEMINI_ATTEMPT = { timeout: 20_000, maxRetries: 0 };

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

/** Busy, rate-limited, down or timed out: worth trying the next model. A bad request is not. */
export function isRetryableGeminiError(error: unknown): boolean {
  const status = geminiErrorStatus(error);
  if (status !== undefined) return status === 429 || status >= 500;
  const name = String((error as { name?: unknown } | null)?.name ?? "");
  return name === "APIConnectionTimeoutError" || name === "APIConnectionError";
}

/**
 * Run `call` on each model in turn until one succeeds. Moves on when the
 * model is unavailable, or when `alsoRetry` says its answer was unusable;
 * any other error is thrown at once. Throws the last error if all fail.
 */
export async function withGeminiFallback<T>(
  call: (model: string, options: typeof GEMINI_ATTEMPT) => Promise<T>,
  { models = GEMINI_MODELS, alsoRetry }: { models?: string[]; alsoRetry?: (error: unknown) => boolean } = {}
): Promise<T> {
  let lastError: unknown = new Error("No Gemini model configured.");
  for (const model of models) {
    try {
      return await call(model, GEMINI_ATTEMPT);
    } catch (error) {
      if (!isRetryableGeminiError(error) && !alsoRetry?.(error)) throw error;
      lastError = error;
      console.warn(`[gemini] ${model} could not answer (${geminiErrorStatus(error) ?? (error as Error)?.name}); trying the next model`);
    }
  }
  throw lastError;
}
