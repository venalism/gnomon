import { estimateTokens } from "@gnomon/tokenizer";

import { extractPromptFeatures } from "./features";
import { detectPromptIssues } from "./issue-detector";
import { optimizePrompt } from "./optimizer";
import { predictOutputTokens } from "./output-predictor";
import { classifyPrompt } from "./prompt-classifier";
import { scorePrompt } from "./prompt-scorer";
import { generateSuggestions } from "./suggestion-engine";
import type { AnalyzePromptOptions, PromptAnalysisResult } from "./types";

export function analyzePrompt(
  prompt: string,
  options: AnalyzePromptOptions = {},
): PromptAnalysisResult {
  const modelProfile = options.modelProfile ?? "gpt_like";
  const language = options.language ?? "en";
  const optimizationMode = options.optimizationMode ?? "balanced";
  const inputTokens = estimateTokens(prompt, { modelProfile });
  const features = extractPromptFeatures(prompt, inputTokens);
  const promptType = classifyPrompt(features);
  const token = predictOutputTokens(inputTokens, promptType, features, { modelProfile });
  const score = scorePrompt(features);
  const issues = detectPromptIssues(features, token, { tokenBudget: options.tokenBudget });
  const suggestions = generateSuggestions(issues, features, language);

  return {
    prompt,
    promptType,
    score,
    token,
    issues,
    suggestions,
    ...(options.includeOptimization
      ? { optimizedPrompt: optimizePrompt(prompt, optimizationMode) }
      : {}),
    createdAt: new Date().toISOString()
  };
}
