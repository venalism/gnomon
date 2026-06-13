import type { PromptFeatures, PromptType } from "./types";

export function classifyPrompt(features: PromptFeatures): PromptType {
  if (features.wordCount === 0) {
    return "unknown";
  }

  if (features.debuggingIndicators) {
    return "debugging";
  }

  if (features.summarizationIndicators) {
    return "summarization";
  }

  if (features.translationIndicators) {
    return "translation";
  }

  if (features.brainstormingIndicators) {
    return "brainstorming";
  }

  if (features.academicIndicators) {
    return "academic_writing";
  }

  if (features.planningIndicators) {
    return "planning";
  }

  if (features.dataAnalysisIndicators) {
    return "data_analysis";
  }

  if (features.codingIndicators) {
    return "coding";
  }

  if (features.shortAnswerIndicators || (features.hasQuestion && features.wordCount <= 12)) {
    return "short_answer";
  }

  if (features.hasPrimaryAction || features.requestsDetailedExplanation) {
    return "explanation";
  }

  return "unknown";
}
