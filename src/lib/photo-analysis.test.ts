import { describe, expect, it } from "vitest";
import {
  MAX_ANALYSIS_PHOTO_BYTES,
  PhotoAnalysisFormatError,
  checkAnalysisPhotos,
  parsePhotoAnalysis,
  photoAnalysisJsonSchema,
} from "./photo-analysis";

const flat = {
  isApartment: true,
  rooms: 2,
  roomsConfidence: "medium",
  spaces: [
    { space: "bedroom", count: 1 },
    { space: "kitchen", count: 1 },
  ],
  features: ["furnished", " washing machine ", ""],
  description: "A bright two-room flat with a separate bedroom and a small kitchen.",
};

describe("parsePhotoAnalysis", () => {
  it("accepts a well-formed analysis and tidies the features", () => {
    const analysis = parsePhotoAnalysis(JSON.stringify(flat));
    expect(analysis.rooms).toBe(2);
    expect(analysis.features).toEqual(["furnished", "washing machine"]);
  });

  it("keeps at most eight features", () => {
    const many = { ...flat, features: Array.from({ length: 12 }, (_, i) => `feature ${i}`) };
    expect(parsePhotoAnalysis(JSON.stringify(many)).features).toHaveLength(8);
  });

  it.each([0, 11, 2.5])("rejects %s rooms", (rooms) => {
    expect(() => parsePhotoAnalysis(JSON.stringify({ ...flat, rooms }))).toThrow(
      PhotoAnalysisFormatError
    );
  });

  it("rejects an apartment without a real description", () => {
    expect(() =>
      parsePhotoAnalysis(JSON.stringify({ ...flat, description: "Nice." }))
    ).toThrow(PhotoAnalysisFormatError);
  });

  it("accepts photos that are not an apartment with an empty description", () => {
    const notAFlat = {
      ...flat,
      isApartment: false,
      spaces: [],
      features: [],
      description: "",
    };
    expect(parsePhotoAnalysis(JSON.stringify(notAFlat)).isApartment).toBe(false);
  });

  it("rejects text that is not JSON", () => {
    expect(() => parsePhotoAnalysis("Sure! Here is the analysis:")).toThrow(
      PhotoAnalysisFormatError
    );
  });
});

describe("photoAnalysisJsonSchema", () => {
  it("is a plain object schema without the dialect marker", () => {
    expect(photoAnalysisJsonSchema.$schema).toBeUndefined();
    expect(photoAnalysisJsonSchema.type).toBe("object");
    expect(photoAnalysisJsonSchema.required).toEqual([
      "isApartment",
      "rooms",
      "roomsConfidence",
      "spaces",
      "features",
      "description",
    ]);
  });
});

describe("checkAnalysisPhotos", () => {
  const jpeg = { type: "image/jpeg", size: 300_000 };

  it("accepts one to five small photos", () => {
    expect(checkAnalysisPhotos([jpeg])).toBeUndefined();
    expect(checkAnalysisPhotos(Array(5).fill(jpeg))).toBeUndefined();
  });

  it("needs at least one photo", () => {
    expect(checkAnalysisPhotos([])).toMatch(/at least one/);
  });

  it("refuses more than five", () => {
    expect(checkAnalysisPhotos(Array(6).fill(jpeg))).toMatch(/at most 5/);
  });

  it("refuses files that are not photos", () => {
    expect(checkAnalysisPhotos([{ type: "application/pdf", size: 1_000 }])).toMatch(/JPEG/);
  });

  it("refuses a photo over the size limit", () => {
    expect(
      checkAnalysisPhotos([{ type: "image/png", size: MAX_ANALYSIS_PHOTO_BYTES + 1 }])
    ).toMatch(/under 3 MB/);
  });

  it("refuses photos that are too large together", () => {
    const big = { type: "image/jpeg", size: 2.5 * 1024 * 1024 };
    expect(checkAnalysisPhotos(Array(5).fill(big))).toMatch(/too large together/);
  });
});
