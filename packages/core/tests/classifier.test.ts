import { describe, expect, it } from "vitest";

import { classifyPrompt, extractPromptFeatures } from "../src";

function classify(prompt: string) {
  return classifyPrompt(extractPromptFeatures(prompt));
}

describe("prompt classifier", () => {
  it("detects coding prompts", () => {
    expect(classify("Create a React component that calls an API endpoint.")).toBe("coding");
  });

  it("detects debugging prompts", () => {
    expect(classify("Fix this TypeError in my JavaScript function: undefined is not a function")).toBe(
      "debugging",
    );
  });

  it("detects summarization prompts", () => {
    expect(classify("Summarize this article into 5 bullets.")).toBe("summarization");
  });

  it("detects translation prompts", () => {
    expect(classify("Translate this paragraph to Indonesian.")).toBe("translation");
  });

  it("detects planning prompts", () => {
    expect(classify("Create a 2-week roadmap for learning TypeScript.")).toBe("planning");
  });

  it("detects unknown prompts", () => {
    expect(classify("blue window maybe later")).toBe("unknown");
  });
});
