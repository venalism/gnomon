import { describe, expect, it } from "vitest";

import { optimizePrompt } from "../src";

describe("prompt optimizer", () => {
  it("replaces redundant phrases", () => {
    const result = optimizePrompt(
      "Tolong bantu saya untuk membuatkan penjelasan API Gateway secara lengkap dan detail.",
      "safe",
    );

    expect(result.optimized.toLowerCase()).toContain("buatkan");
    expect(result.optimized.toLowerCase()).not.toContain("tolong bantu saya");
  });

  it("adds output format in balanced mode", () => {
    const result = optimizePrompt("Explain how an API Gateway works.", "balanced");

    expect(result.optimized).toContain("Format the answer");
  });

  it("reports token savings without negative values", () => {
    const result = optimizePrompt("Explain how an API Gateway works.", "balanced");

    expect(result.savedTokens).toBeGreaterThanOrEqual(0);
    expect(result.savedPercentage).toBeGreaterThanOrEqual(0);
  });
});
