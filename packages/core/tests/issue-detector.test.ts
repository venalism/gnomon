import { describe, expect, it } from "vitest";

import { analyzePrompt } from "../src";

describe("issue detector", () => {
  it("detects missing format, missing length limit, output risk, and context gaps", () => {
    const result = analyzePrompt("Jelaskan lengkap dan detail tentang API Gateway dan Swagger.");
    const types = result.issues.map((issue) => issue.type);

    expect(types).toContain("missing_output_format");
    expect(types).toContain("missing_length_limit");
    expect(types).toContain("high_output_risk");
    expect(types).toContain("insufficient_context");
  });

  it("detects too many tasks", () => {
    const result = analyzePrompt(
      "Explain API Gateway and Swagger and create a team communication plan and list endpoint documentation steps in detail.",
    );

    expect(result.issues.some((issue) => issue.type === "too_many_tasks")).toBe(true);
  });

  it("detects redundant phrases", () => {
    const result = analyzePrompt(
      "Tolong bantu saya untuk membuatkan penjelasan API Gateway secara lengkap dan detail.",
    );

    expect(result.issues.some((issue) => issue.type === "redundant_phrase")).toBe(true);
  });
});
