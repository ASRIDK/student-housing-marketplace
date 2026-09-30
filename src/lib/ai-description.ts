// "Write my description for me": drafts a listing description with Claude
// from the facts already typed into the listing form. Server-only — it
// reads ANTHROPIC_API_KEY, which must never reach the browser.

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CITIES } from "./types";

const isoDate = z.iso.date();

/** What the form sends to POST /api/ai/describe. */
export const describeInputSchema = z.object({
  city: z.enum(CITIES),
  neighbourhood: z.string().trim().min(2).max(80),
  rent: z.number().int().min(1).max(10_000),
  currency: z.enum(["EUR", "CHF"]),
  rooms: z.number().int().min(1).max(10),
  availableFrom: isoDate.optional(),
  availableUntil: isoDate.nullable().optional(),
  // Whatever the student already wrote: used as notes to build on.
  notes: z.string().trim().max(2_000).optional(),
});

export type DescribeInput = z.output<typeof describeInputSchema>;

const SYSTEM_PROMPT = `You write apartment listings for StudentSwap, a site where students of one school hand over their apartment to another student who is moving to their campus city.

Write the description the student will publish, in first person, as the current tenant. Keep it friendly, concrete and honest: 80 to 150 words, plain text, short paragraphs, no headings, no bullet points, no emojis, no hashtags.

Use only the facts you are given. Never invent amenities, distances, landlord rules or anything else the student did not mention — if there are no notes, describe what the facts tell a reader and invite them to get in touch with questions. Do not repeat the rent or dates as a list; weave them in naturally. Reply with the description text only.`;

function formatFacts(input: DescribeInput): string {
  const size = input.rooms === 1 ? "a studio" : `${input.rooms} rooms`;
  const lines = [
    `City: ${input.city}`,
    `Neighbourhood: ${input.neighbourhood}`,
    `Size: ${size}`,
    `Monthly rent: ${input.rent} ${input.currency}`,
  ];
  if (input.availableFrom) lines.push(`Available from: ${input.availableFrom}`);
  if (input.availableUntil === null) lines.push("Available until: open-ended");
  else if (input.availableUntil) lines.push(`Available until: ${input.availableUntil}`);

  let text = `Facts about the apartment:\n${lines.join("\n")}`;
  if (input.notes) {
    text += `\n\nThe student's own notes (build on these, keep their details):\n<notes>\n${input.notes}\n</notes>`;
  }
  return text;
}

export class DescriptionUnavailableError extends Error {}

/** Ask Claude for a description. Throws DescriptionUnavailableError on a refusal or empty answer. */
export async function writeDescription(input: DescribeInput): Promise<string> {
  const client = new Anthropic();

  const response = await client.beta.messages.create({
    model: "claude-opus-5",
    max_tokens: 16000,
    output_config: { effort: "low" },
    // If the model declines, let the API retry on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: formatFacts(input) }],
  });

  if (response.stop_reason === "refusal") {
    throw new DescriptionUnavailableError("The AI could not write this description.");
  }

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (text.length < 20) {
    throw new DescriptionUnavailableError("The AI returned an empty description.");
  }
  return text.slice(0, 2_000);
}
