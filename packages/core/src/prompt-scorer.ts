import type { PromptFeatures, PromptScore, ScoreLabel } from "./types";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score <= 40) {
    return "poor";
  }

  if (score <= 60) {
    return "needs_improvement";
  }

  if (score <= 80) {
    return "good";
  }

  return "excellent";
}

export function scorePrompt(features: PromptFeatures): PromptScore {
  if (features.wordCount === 0) {
    return {
      overall: 0,
      label: "poor",
      breakdown: {
        clarity: 0,
        specificity: 0,
        tokenEfficiency: 0,
        outputControl: 0,
        contextQuality: 0,
        redundancyControl: 0
      }
    };
  }

  const clarity = clampScore(
    35 +
      (features.hasPrimaryAction ? 30 : 0) +
      (features.hasQuestion ? 10 : 0) +
      (features.wordCount >= 6 ? 15 : -15) +
      (features.taskCount >= 4 ? -15 : 0),
  );

  const specificity = clampScore(
    30 +
      (features.hasContext ? 25 : 0) +
      (features.hasGoal ? 15 : 0) +
      (features.hasAudience ? 10 : 0) +
      (features.wordCount >= 18 ? 15 : 0) -
      (features.wordCount < 7 ? 20 : 0),
  );

  const tokenEfficiency = clampScore(
    90 -
      Math.max(0, features.inputTokens - 160) * 0.15 -
      features.redundantPhrases.length * 12 -
      features.repeatedTerms.length * 6 -
      (features.requestsDetailedExplanation ? 8 : 0),
  );

  const outputControl = clampScore(
    25 +
      (features.hasOutputFormat ? 35 : 0) +
      (features.hasLengthLimit ? 30 : 0) +
      (features.shortAnswerIndicators ? 10 : 0),
  );

  const contextQuality = clampScore(
    35 +
      (features.hasContext ? 30 : 0) +
      (features.wordCount >= 12 ? 15 : 0) +
      (features.hasAudience ? 10 : 0) -
      (features.wordCount > 180 ? 10 : 0),
  );

  const redundancyControl = clampScore(
    95 - features.redundantPhrases.length * 15 - features.repeatedTerms.length * 8,
  );

  const overall = clampScore(
    clarity * 0.25 +
      specificity * 0.2 +
      tokenEfficiency * 0.2 +
      outputControl * 0.15 +
      contextQuality * 0.1 +
      redundancyControl * 0.1,
  );

  return {
    overall,
    label: getScoreLabel(overall),
    breakdown: {
      clarity,
      specificity,
      tokenEfficiency,
      outputControl,
      contextQuality,
      redundancyControl
    }
  };
}
