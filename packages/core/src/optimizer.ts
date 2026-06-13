import { estimateTokens } from "@gnomon/tokenizer";

import { extractPromptFeatures } from "./features";
import type { OptimizedPrompt, OptimizationMode } from "./types";

interface ReplacementRule {
  pattern: RegExp;
  replacement: string;
  modes: OptimizationMode[];
}

const REPLACEMENTS: ReplacementRule[] = [
  {
    pattern: /\btolong bantu saya untuk membuatkan\b/gi,
    replacement: "buatkan",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\btolong bantu saya untuk\b/gi,
    replacement: "",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\bberikan saya sebuah penjelasan mengenai\b/gi,
    replacement: "jelaskan",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\bsecara lengkap dan detail\b/gi,
    replacement: "secara detail",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\bdari awal sampai akhir\b/gi,
    replacement: "end-to-end",
    modes: ["balanced", "aggressive"]
  },
  {
    pattern: /\bapa saja yang harus saya lakukan\b/gi,
    replacement: "langkah yang diperlukan",
    modes: ["balanced", "aggressive"]
  },
  {
    pattern: /\bplease help me to\b/gi,
    replacement: "",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\bi would like you to\b/gi,
    replacement: "",
    modes: ["safe", "balanced", "aggressive"]
  },
  {
    pattern: /\bcan you please\b/gi,
    replacement: "",
    modes: ["balanced", "aggressive"]
  },
  {
    pattern: /\bin a very complete and detailed way\b/gi,
    replacement: "in detail",
    modes: ["balanced", "aggressive"]
  },
  {
    pattern: /\bkindly\b/gi,
    replacement: "",
    modes: ["aggressive"]
  }
];

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([.,!?;:])/g, "$1").trim();
}

function addOutputFormatIfMissing(prompt: string, mode: OptimizationMode): string {
  const features = extractPromptFeatures(prompt);

  if (features.hasOutputFormat || mode === "safe" || features.wordCount === 0) {
    return prompt;
  }

  if (mode === "aggressive") {
    return `${prompt} Format: concise bullets with clear next steps.`;
  }

  return `${prompt} Format the answer as concise bullet points.`;
}

function addLengthLimitIfMissing(prompt: string, mode: OptimizationMode): string {
  const features = extractPromptFeatures(prompt);

  if (features.hasLengthLimit || mode !== "aggressive" || features.wordCount === 0) {
    return prompt;
  }

  return `${prompt} Keep it under 300 words.`;
}

export function getOptimizedPromptText(prompt: string, mode: OptimizationMode = "balanced"): string {
  let optimized = prompt;

  for (const rule of REPLACEMENTS) {
    if (rule.modes.includes(mode)) {
      optimized = optimized.replace(rule.pattern, rule.replacement);
    }
  }

  optimized = normalizeWhitespace(optimized);
  optimized = addOutputFormatIfMissing(optimized, mode);
  optimized = addLengthLimitIfMissing(optimized, mode);

  return normalizeWhitespace(optimized);
}

export function optimizePrompt(prompt: string, mode: OptimizationMode = "balanced"): OptimizedPrompt {
  const original = prompt.trim();
  const optimized = getOptimizedPromptText(original, mode);
  const originalTokens = estimateTokens(original);
  const optimizedTokens = estimateTokens(optimized);
  const savedTokens = Math.max(0, originalTokens - optimizedTokens);
  const savedPercentage =
    originalTokens === 0 ? 0 : Math.max(0, Math.round((savedTokens / originalTokens) * 100));

  return {
    original,
    optimized,
    originalTokens,
    optimizedTokens,
    savedTokens,
    savedPercentage,
    mode
  };
}
