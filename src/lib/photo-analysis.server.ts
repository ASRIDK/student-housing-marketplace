// The Gemini call behind "Fill in from my photos". Server-only: only the API
// route imports this file.

import { geminiClient, withGeminiFallback } from "./gemini.server";
import {
  PHOTO_ANALYSIS_PROMPT,
  PhotoAnalysisFormatError,
  parsePhotoAnalysis,
  photoAnalysisJsonSchema,
  type PhotoAnalysis,
} from "./photo-analysis";

export { isGeminiConfigured as isPhotoAnalysisConfigured } from "./gemini.server";

export type PhotoInput = {
  /** Base64, without a data: prefix. */
  data: string;
  mimeType: string;
};

/**
 * Ask Gemini what the photos show. If a model is busy, or its answer does not
 * fit the schema, the next model in the chain tries. Throws if all fail.
 */
export async function analyzePhotos(photos: PhotoInput[]): Promise<PhotoAnalysis> {
  return withGeminiFallback(
    async (model, options) => {
      const interaction = await geminiClient().interactions.create(
        {
          model,
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
          // Looking at a few photos needs little deliberation; this keeps it quick.
          generation_config: { thinking_level: "low" },
          // Students' photos are not kept on Google's side for later retrieval.
          store: false,
        },
        options
      );

      if (interaction.status && interaction.status !== "completed") {
        throw new PhotoAnalysisFormatError(`Gemini finished with status "${interaction.status}".`);
      }
      if (!interaction.output_text) {
        throw new PhotoAnalysisFormatError("Gemini returned no text.");
      }
      return parsePhotoAnalysis(interaction.output_text);
    },
    { alsoRetry: (error) => error instanceof PhotoAnalysisFormatError }
  );
}
