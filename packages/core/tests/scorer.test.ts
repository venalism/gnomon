import { describe, expect, it } from "vitest";

import { analyzePrompt } from "../src";

describe("prompt scorer", () => {
  it("penalizes vague prompts", () => {
    const result = analyzePrompt("help");
    expect(result.score.overall).toBeLessThanOrEqual(50);
    expect(result.issues.some((issue) => issue.type === "too_ambiguous")).toBe(true);
  });

  it("rewards constraints and output format", () => {
    const result = analyzePrompt(
      "Explain API Gateway for junior developers. Format the answer as 5 markdown bullets and keep it under 200 words.",
    );

    expect(result.score.overall).toBeGreaterThan(70);
    expect(result.score.breakdown.outputControl).toBeGreaterThan(80);
  });
});
