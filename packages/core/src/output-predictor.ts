import type { ModelProfile } from "@gnomon/tokenizer";

import type { PromptFeatures, PromptType, TokenPrediction } from "./types";

export interface PredictOutputOptions {
  modelProfile?: ModelProfile;
}

function withLengthLimit(min: number, max: number, features: PromptFeatures): [number, number] {
  if (!features.hasLengthLimit || features.lengthLimitTokenEstimate <= 0) {
    return [min, max];
  }

  const limitedMax = Math.max(40, Math.min(max, features.lengthLimitTokenEstimate));
  return [Math.min(min, Math.max(25, Math.floor(limitedMax * 0.45))), limitedMax];
}

function confidenceFor(promptType: PromptType, features: PromptFeatures): TokenPrediction["confidence"] {
  if (promptType === "unknown" || features.taskCount >= 5) {
    return "low";
  }

  if (features.hasLengthLimit || promptType === "translation" || promptType === "summarization") {
    return "high";
  }

  return "medium";
}

export function predictOutputTokens(
  inputTokens: number,
  promptType: PromptType,
  features: PromptFeatures,
  options: PredictOutputOptions = {},
): TokenPrediction {
  let min = 200;
  let max = 800;

  switch (promptType) {
    case "explanation":
      min = 400;
      max = 1200;
      break;
    case "coding":
      min = Math.max(300, Math.ceil(inputTokens * 2));
      max = Math.max(600, Math.ceil(inputTokens * 8));
      break;
    case "debugging":
      min = Math.max(250, Math.ceil(inputTokens * 1));
      max = Math.max(500, Math.ceil(inputTokens * 5));
      break;
    case "summarization":
      min = Math.max(80, Math.ceil(inputTokens * 0.2));
      max = Math.max(180, Math.ceil(inputTokens * 0.6));
      break;
    case "translation":
      min = Math.max(60, Math.ceil(inputTokens * 0.7));
      max = Math.max(120, Math.ceil(inputTokens * 1.3));
      break;
    case "brainstorming":
      min = 600;
      max = 1500;
      break;
    case "academic_writing":
      min = 800;
      max = 2000;
      break;
    case "planning":
      min = 500;
      max = 1400;
      break;
    case "data_analysis":
      min = 450;
      max = 1300;
      break;
    case "short_answer":
      min = 50;
      max = 300;
      break;
    case "unknown":
      min = 100;
      max = 600;
      break;
  }

  if (features.requestsDetailedExplanation) {
    min = Math.ceil(min * 1.2);
    max = Math.ceil(max * 1.4);
  }

  if (features.taskCount >= 4) {
    max = Math.ceil(max * 1.2);
  }

  [min, max] = withLengthLimit(min, max, features);

  return {
    inputTokens,
    outputTokensMin: min,
    outputTokensMax: max,
    totalTokensMin: inputTokens + min,
    totalTokensMax: inputTokens + max,
    confidence: confidenceFor(promptType, features),
    tokenizerMethod: "approximate",
    modelProfile: options.modelProfile ?? "gpt_like"
  };
}
