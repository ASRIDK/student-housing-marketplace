import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatDate,
  formatRent,
  formatRooms,
  formatWindow,
} from "./format";

describe("formatDate", () => {
  it("renders an ISO date as day, short month, year", () => {
    expect(formatDate("2026-01-15")).toBe("15 Jan 2026");
  });

  it("does not shift the day across time zones", () => {
    expect(formatDate("2026-12-31")).toBe("31 Dec 2026");
  });
});

describe("formatRent", () => {
  it("prefixes euros with the symbol", () => {
    expect(formatRent(850, "EUR")).toBe("€850 / month");
  });

  it("uses the CHF code and thousands separator", () => {
    expect(formatRent(1400, "CHF")).toBe("CHF 1,400 / month");
  });
});

describe("formatRooms", () => {
  it("calls a single room a studio", () => {
    expect(formatRooms(1)).toBe("Studio");
  });

  it("pluralises rooms", () => {
    expect(formatRooms(3)).toBe("3 rooms");
  });
});

describe("formatAmount", () => {
  it("drops the per-month suffix so the card can style it", () => {
    expect(formatAmount(850, "EUR")).toBe("\u20ac850");
    expect(formatAmount(1400, "CHF")).toBe("CHF 1,400");
  });
});

describe("formatWindow", () => {
  it("shows both months when the handover has an end date", () => {
    expect(formatWindow("2026-10-01", "2027-06-30")).toBe("Oct 2026 \u2013 Jun 2027");
  });

  it("says open-ended when there is no end date", () => {
    expect(formatWindow("2026-11-15", null)).toBe("From Nov 2026, open-ended");
  });
});
