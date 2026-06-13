import type { PromptFeatures, PromptIssue, TokenPrediction } from "./types";

export interface DetectIssueOptions {
  tokenBudget?: number;
}

function issue(
  type: PromptIssue["type"],
  severity: PromptIssue["severity"],
  message: string,
  evidence?: string,
): PromptIssue {
  return {
    id: type,
    type,
    severity,
    message,
    ...(evidence ? { evidence } : {})
  };
}

export function detectPromptIssues(
  features: PromptFeatures,
  token: TokenPrediction,
  options: DetectIssueOptions = {},
): PromptIssue[] {
  if (features.wordCount === 0) {
    return [];
  }

  const issues: PromptIssue[] = [];

  if (!features.hasOutputFormat && features.wordCount >= 5) {
    issues.push(
      issue(
        "missing_output_format",
        "medium",
        "No output format specified.",
        "Add a table, bullet list, markdown, JSON, or step-by-step format.",
      ),
    );
  }

  if (!features.hasLengthLimit && (features.longOutputRisk || token.outputTokensMax >= 900)) {
    issues.push(
      issue(
        "missing_length_limit",
        "medium",
        "No response length limit found.",
        "Add a max word, token, paragraph, or sentence limit.",
      ),
    );
  }

  if (!features.hasPrimaryAction || features.wordCount < 6) {
    issues.push(
      issue(
        "too_ambiguous",
        features.wordCount < 4 ? "high" : "medium",
        "The prompt is too ambiguous.",
        "State the task and expected result more directly.",
      ),
    );
  }

  if (features.taskCount >= 4 && features.inputTokens >= 30) {
    issues.push(
      issue(
        "too_many_tasks",
        "high",
        "This prompt contains multiple tasks.",
        "Split large tasks or ask for a structured multi-section answer.",
      ),
    );
  }

  if (
    features.longOutputRisk ||
    token.outputTokensMax > 1200 ||
    (options.tokenBudget !== undefined && token.totalTokensMax > options.tokenBudget)
  ) {
    issues.push(
      issue(
        "high_output_risk",
        token.outputTokensMax > 1500 ? "high" : "medium",
        "This prompt may generate a long response.",
        "Use a tighter scope or response budget.",
      ),
    );
  }

  if (features.redundantPhrases.length > 0 || features.repeatedTerms.length > 0) {
    issues.push(
      issue(
        "redundant_phrase",
        "low",
        "The prompt includes redundant wording.",
        [...features.redundantPhrases, ...features.repeatedTerms].join(", "),
      ),
    );
  }

  if (!features.hasContext && features.wordCount < 24 && !features.shortAnswerIndicators) {
    issues.push(
      issue(
        "insufficient_context",
        "medium",
        "The prompt may not include enough context.",
        "Add audience, goal, constraints, or background.",
      ),
    );
  }

  return issues;
}
