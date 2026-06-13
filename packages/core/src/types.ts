import type { ModelProfile } from "@gnomon/tokenizer";

export type PromptType =
  | "explanation"
  | "coding"
  | "debugging"
  | "summarization"
  | "translation"
  | "brainstorming"
  | "academic_writing"
  | "planning"
  | "data_analysis"
  | "short_answer"
  | "unknown";

export type ScoreLabel = "poor" | "needs_improvement" | "good" | "excellent";
export type OptimizationMode = "safe" | "balanced" | "aggressive";
export type Language = "en" | "id";
export type Severity = "low" | "medium" | "high";
export type SupportedSiteId = "chatgpt";

export interface PromptScore {
  overall: number;
  label: ScoreLabel;
  breakdown: {
    clarity: number;
    specificity: number;
    tokenEfficiency: number;
    outputControl: number;
    contextQuality: number;
    redundancyControl: number;
  };
}

export interface TokenPrediction {
  inputTokens: number;
  outputTokensMin: number;
  outputTokensMax: number;
  totalTokensMin: number;
  totalTokensMax: number;
  confidence: "low" | "medium" | "high";
  tokenizerMethod: "approximate" | "model_specific";
  modelProfile: ModelProfile;
}

export interface PromptIssue {
  id: string;
  type:
    | "missing_output_format"
    | "missing_length_limit"
    | "too_ambiguous"
    | "too_many_tasks"
    | "high_output_risk"
    | "redundant_phrase"
    | "insufficient_context";
  severity: Severity;
  message: string;
  evidence?: string;
}

export interface PromptSuggestion {
  id: string;
  type:
    | "add_format"
    | "add_length_limit"
    | "remove_redundancy"
    | "split_prompt"
    | "clarify_goal"
    | "add_audience"
    | "reduce_scope";
  title: string;
  description: string;
  example?: string;
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  savedPercentage: number;
  mode: OptimizationMode;
}

export interface PromptAnalysisResult {
  prompt: string;
  promptType: PromptType;
  score: PromptScore;
  token: TokenPrediction;
  issues: PromptIssue[];
  suggestions: PromptSuggestion[];
  optimizedPrompt?: OptimizedPrompt;
  createdAt: string;
}

export interface SupportedSite {
  id: SupportedSiteId;
  name: string;
  matches: string[];
  inputSelectors: string[];
}

export interface UserSettings {
  enabled: boolean;
  showInlineWidget: boolean;
  showSidebar: boolean;
  localOnlyMode: boolean;
  tokenBudget: number;
  optimizationMode: OptimizationMode;
  language: Language;
  modelProfile: ModelProfile;
  enabledSites: SupportedSiteId[];
}

export interface PromptFeatures {
  normalizedText: string;
  lowerText: string;
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  inputTokens: number;
  hasQuestion: boolean;
  hasPrimaryAction: boolean;
  hasOutputFormat: boolean;
  hasLengthLimit: boolean;
  lengthLimitTokenEstimate: number;
  hasAudience: boolean;
  hasGoal: boolean;
  hasContext: boolean;
  requestsDetailedExplanation: boolean;
  longOutputRisk: boolean;
  codingIndicators: boolean;
  debuggingIndicators: boolean;
  summarizationIndicators: boolean;
  translationIndicators: boolean;
  brainstormingIndicators: boolean;
  academicIndicators: boolean;
  planningIndicators: boolean;
  dataAnalysisIndicators: boolean;
  shortAnswerIndicators: boolean;
  taskCount: number;
  conjunctionCount: number;
  redundantPhrases: string[];
  repeatedTerms: string[];
}

export interface AnalyzePromptOptions {
  language?: Language;
  tokenBudget?: number;
  optimizationMode?: OptimizationMode;
  modelProfile?: ModelProfile;
  includeOptimization?: boolean;
}
