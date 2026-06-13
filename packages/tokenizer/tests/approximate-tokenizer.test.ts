import { describe, expect, it } from "vitest";

import { estimateTokenDetails, estimateTokens } from "../src";

describe("approximate tokenizer", () => {
  it("returns 0 for empty text", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("   \n\t  ")).toBe(0);
  });

  it("estimates normal text with the GPT-like chars-per-token rule", () => {
    expect(estimateTokens("12345678")).toBe(2);
    expect(estimateTokens("123456789")).toBe(3);
  });

  it("normalizes repeated whitespace before estimating", () => {
    expect(estimateTokens("hello      world")).toBe(3);
  });

  it("returns confidence metadata", () => {
    expect(estimateTokenDetails("short prompt")).toMatchObject({
      method: "estimated",
      confidence: "high",
      modelProfile: "gpt_like"
    });
  });
});
