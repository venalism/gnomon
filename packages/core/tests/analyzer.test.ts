import { describe, expect, it } from "vitest";

import { analyzePrompt } from "../src";

describe("analyzePrompt", () => {
  it("returns the full analysis contract", () => {
    const result = analyzePrompt("Explain API Gateway for junior developers in 5 bullets.", {
      includeOptimization: true,
      tokenBudget: 1000
    });

    expect(result.promptType).toBe("explanation");
    expect(result.token.inputTokens).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeGreaterThanOrEqual(0);
    expect(result.optimizedPrompt?.mode).toBe("balanced");
    expect(Date.parse(result.createdAt)).not.toBeNaN();
  });

  it("supports Indonesian suggestions", () => {
    const result = analyzePrompt("Jelaskan lengkap tentang API Gateway.", { language: "id" });

    expect(result.suggestions[0]?.title).toMatch(/Tambahkan|Perjelas|Persempit/);
  });
});
