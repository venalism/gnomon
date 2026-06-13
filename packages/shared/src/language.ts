import type { Language, PromptIssue, PromptSuggestion, ScoreLabel } from "@gnomon/core";

export const messages = {
  en: {
    appName: "Gnomon",
    appDescription: "AI Token & Prompt Optimizer",
    active: "Active",
    disabled: "Disabled",
    promptScore: "Prompt Score",
    inputTokens: "Input tokens",
    predictedOutput: "Predicted output",
    estimatedTotal: "Estimated total",
    confidence: "Confidence",
    issues: "Issues",
    suggestions: "Suggestions",
    optimizePrompt: "Optimize Prompt",
    applyOptimizedPrompt: "Apply Optimized Prompt",
    copy: "Copy",
    copied: "Copied",
    dismiss: "Dismiss",
    tokenBudget: "Token budget",
    optimizationMode: "Optimization mode",
    localAnalysis: "Local analysis",
    language: "Language",
    showInlineWidget: "Show inline widget",
    showSidebar: "Show sidebar",
    status: "Status",
    openSettings: "Open Settings",
    disableOnThisSite: "Disable on this site",
    enableOnThisSite: "Enable on this site",
    original: "Original",
    optimized: "Optimized",
    saved: "Saved",
    settingsSaved: "Settings saved",
    noPrompt: "Type a prompt to see token estimates.",
    privacyNote: "Prompts are analyzed locally and are not sent to external APIs.",
    scoreLabels: {
      poor: "Poor",
      needs_improvement: "Needs improvement",
      good: "Good",
      excellent: "Excellent"
    } satisfies Record<ScoreLabel, string>,
    severities: {
      low: "Low",
      medium: "Medium",
      high: "High"
    } satisfies Record<PromptIssue["severity"], string>
  },
  id: {
    appName: "Gnomon",
    appDescription: "Pengoptimal Prompt & Token AI",
    active: "Aktif",
    disabled: "Nonaktif",
    promptScore: "Nilai Prompt",
    inputTokens: "Token input",
    predictedOutput: "Prediksi output",
    estimatedTotal: "Estimasi total",
    confidence: "Keyakinan",
    issues: "Masalah",
    suggestions: "Saran",
    optimizePrompt: "Optimalkan Prompt",
    applyOptimizedPrompt: "Terapkan Prompt",
    copy: "Salin",
    copied: "Tersalin",
    dismiss: "Tutup",
    tokenBudget: "Batas token",
    optimizationMode: "Mode optimasi",
    localAnalysis: "Analisis lokal",
    language: "Bahasa",
    showInlineWidget: "Tampilkan widget inline",
    showSidebar: "Tampilkan sidebar",
    status: "Status",
    openSettings: "Buka Pengaturan",
    disableOnThisSite: "Nonaktifkan di situs ini",
    enableOnThisSite: "Aktifkan di situs ini",
    original: "Asli",
    optimized: "Optimal",
    saved: "Hemat",
    settingsSaved: "Pengaturan tersimpan",
    noPrompt: "Ketik prompt untuk melihat estimasi token.",
    privacyNote: "Prompt dianalisis lokal dan tidak dikirim ke API eksternal.",
    scoreLabels: {
      poor: "Buruk",
      needs_improvement: "Perlu diperbaiki",
      good: "Baik",
      excellent: "Sangat baik"
    } satisfies Record<ScoreLabel, string>,
    severities: {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi"
    } satisfies Record<PromptIssue["severity"], string>
  }
};

export type MessageKey = Exclude<keyof (typeof messages)["en"], "scoreLabels" | "severities">;

export function t(language: Language, key: MessageKey): string {
  return messages[language][key];
}

export function scoreLabel(language: Language, label: ScoreLabel): string {
  return messages[language].scoreLabels[label];
}

export function severityLabel(language: Language, severity: PromptIssue["severity"]): string {
  return messages[language].severities[severity];
}

export function localizeSuggestion(
  suggestion: PromptSuggestion,
  _language: Language,
): PromptSuggestion {
  return suggestion;
}
