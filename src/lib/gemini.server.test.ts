import { describe, expect, it, vi } from "vitest";
import { isRetryableGeminiError, withGeminiFallback } from "./gemini.server";

const models = ["primary", "backup", "last"];
const busy = Object.assign(new Error("high demand"), { status: 503 });
const badRequest = Object.assign(new Error("invalid argument"), { status: 400 });
const timedOut = Object.assign(new Error("Request timed out."), { name: "APIConnectionTimeoutError" });

describe("isRetryableGeminiError", () => {
  it("retries when the model is busy, rate-limited, down or slow", () => {
    expect(isRetryableGeminiError(busy)).toBe(true);
    expect(isRetryableGeminiError({ status: 429 })).toBe(true);
    expect(isRetryableGeminiError({ status: 500 })).toBe(true);
    expect(isRetryableGeminiError(timedOut)).toBe(true);
  });

  it("does not retry a bad request or an unknown error", () => {
    expect(isRetryableGeminiError(badRequest)).toBe(false);
    expect(isRetryableGeminiError(new Error("boom"))).toBe(false);
  });
});

describe("withGeminiFallback", () => {
  it("uses the first model when it answers", async () => {
    const call = vi.fn(async (model: string) => model);
    await expect(withGeminiFallback(call, { models })).resolves.toBe("primary");
    expect(call).toHaveBeenCalledTimes(1);
  });

  it("moves to the next model when one is busy or times out", async () => {
    const call = vi.fn(async (model: string) => {
      if (model === "primary") throw busy;
      if (model === "backup") throw timedOut;
      return model;
    });
    await expect(withGeminiFallback(call, { models })).resolves.toBe("last");
    expect(call).toHaveBeenCalledTimes(3);
  });

  it("stops at once on an error another model would not fix", async () => {
    const call = vi.fn(async () => {
      throw badRequest;
    });
    await expect(withGeminiFallback(call, { models })).rejects.toBe(badRequest);
    expect(call).toHaveBeenCalledTimes(1);
  });

  it("moves on when the caller says the answer was unusable", async () => {
    class Unusable extends Error {}
    const call = vi.fn(async (model: string) => {
      if (model === "primary") throw new Unusable("empty");
      return model;
    });
    const result = withGeminiFallback(call, { models, alsoRetry: (e) => e instanceof Unusable });
    await expect(result).resolves.toBe("backup");
  });

  it("throws the last error when every model fails", async () => {
    const call = vi.fn(async () => {
      throw busy;
    });
    await expect(withGeminiFallback(call, { models })).rejects.toBe(busy);
    expect(call).toHaveBeenCalledTimes(3);
  });
});
