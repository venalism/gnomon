import { getTokenizerProfile, type ModelProfile } from "./tokenizer-profiles";

export interface TokenEstimate {
  inputTokens: number;
  method: "estimated";
  confidence: "low" | "medium" | "high";
  modelProfile: ModelProfile;
}

export interface EstimateTokenOptions {
  modelProfile?: ModelProfile;
}

export function normalizeForTokenEstimate(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function estimateTokens(text: string, options: EstimateTokenOptions = {}): number {
  const normalized = normalizeForTokenEstimate(text);

  if (!normalized) {
    return 0;
  }

  const profile = getTokenizerProfile(options.modelProfile);
  return Math.max(1, Math.ceil(normalized.length / profile.charsPerToken));
}

export function estimateTokenDetails(
  text: string,
  options: EstimateTokenOptions = {},
): TokenEstimate {
  const modelProfile = options.modelProfile ?? "gpt_like";
  const inputTokens = estimateTokens(text, { modelProfile });

  return {
    inputTokens,
    method: "estimated",
    confidence: inputTokens > 1200 ? "low" : inputTokens > 250 ? "medium" : "high",
    modelProfile
  };
}
