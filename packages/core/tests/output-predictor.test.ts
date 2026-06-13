import { describe, expect, it } from "vitest";

import { extractPromptFeatures, predictOutputTokens } from "../src";

describe("output predictor", () => {
  it("predicts coding output from input token multiplier", () => {
    const features = extractPromptFeatures("Create TypeScript code for a debounce function.");
    const prediction = predictOutputTokens(20, "coding", features);

    expect(prediction.outputTokensMin).toBeGreaterThanOrEqual(300);
    expect(prediction.outputTokensMax).toBeGreaterThanOrEqual(600);
  });

  it("reduces maximum output when a length limit exists", () => {
    const features = extractPromptFeatures(
      "Explain API Gateway in detail, but keep the answer under 100 words.",
    );
    const prediction = predictOutputTokens(30, "explanation", features);

    expect(prediction.outputTokensMax).toBeLessThanOrEqual(135);
    expect(prediction.confidence).toBe("high");
  });
});
