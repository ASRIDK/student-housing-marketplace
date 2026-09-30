import { describe, expect, it } from "vitest";
import { describeInputSchema } from "./ai-description";

const valid = {
  city: "Milan",
  neighbourhood: "Navigli",
  rent: 750,
  currency: "EUR",
  rooms: 2,
};

describe("describeInputSchema", () => {
  it("accepts the four required facts on their own", () => {
    expect(describeInputSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts dates, an open-ended stay and notes", () => {
    const result = describeInputSchema.safeParse({
      ...valid,
      availableFrom: "2026-10-01",
      availableUntil: null,
      notes: "  big balcony, quiet street  ",
    });
    expect(result.success).toBe(true);
    expect(result.data?.notes).toBe("big balcony, quiet street");
  });

  it("rejects an unknown city", () => {
    expect(describeInputSchema.safeParse({ ...valid, city: "Rome" }).success).toBe(false);
  });

  it("rejects rent and rooms out of range", () => {
    expect(describeInputSchema.safeParse({ ...valid, rent: 0 }).success).toBe(false);
    expect(describeInputSchema.safeParse({ ...valid, rent: 10_001 }).success).toBe(false);
    expect(describeInputSchema.safeParse({ ...valid, rooms: 11 }).success).toBe(false);
  });

  it("rejects notes longer than a description can be", () => {
    expect(describeInputSchema.safeParse({ ...valid, notes: "a".repeat(2_001) }).success).toBe(false);
  });
});
