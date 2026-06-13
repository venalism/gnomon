import { estimateTokens } from "@gnomon/tokenizer";

import type { PromptFeatures } from "./types";

const ACTION_PATTERN =
  /\b(explain|summarize|translate|write|create|make|build|debug|fix|review|analyze|compare|plan|brainstorm|generate|jelaskan|ringkas|terjemahkan|buat|bikin|perbaiki|debug|analisis|bandingkan|rencanakan)\b/i;
const FORMAT_PATTERN =
  /\b(format|table|bullet|bullets|list|markdown|json|yaml|csv|step-by-step|steps|outline|tabel|poin|daftar|langkah|struktur)\b/i;
const LENGTH_LIMIT_PATTERN =
  /\b(max|maximum|limit|under|below|brief|concise|short|shortly|no more than|at most|maksimal|batas|singkat|ringkas|pendek|tidak lebih dari)\b|\b\d+\s*(words?|tokens?|sentences?|paragraphs?|kata|token|kalimat|paragraf)\b/i;
const DETAIL_PATTERN =
  /\b(complete|comprehensive|in-depth|detailed|detail|step-by-step|from scratch|end-to-end|lengkap|mendalam|rinci|dari awal sampai akhir|sedetail mungkin)\b/i;
const AUDIENCE_PATTERN =
  /\b(for|audience|reader|beginner|student|developer|team|stakeholder|untuk|target|pembaca|pemula|mahasiswa|developer|tim)\b/i;
const GOAL_PATTERN =
  /\b(goal|objective|so that|in order to|tujuan|agar|supaya|hasil akhir|outcome)\b/i;
const CONTEXT_PATTERN =
  /\b(context|background|given|based on|using|because|project|case|scenario|konteks|latar belakang|berdasarkan|dengan|karena|proyek|kasus|skenario)\b/i;

const REDUNDANT_PATTERNS = [
  /tolong bantu saya untuk/gi,
  /mohon bantu saya/gi,
  /saya ingin meminta bantuan/gi,
  /please help me to/gi,
  /i would like you to/gi,
  /can you please/gi,
  /secara lengkap dan detail/gi,
  /dari awal sampai akhir/gi
];

const KEYWORD_PATTERNS = {
  coding:
    /\b(code|function|component|class|hook|sql query|schema|endpoint handler|kode|fungsi|komponen)\b|```/i,
  debugging: /\b(error|bug|stack trace|exception|failed|fix|debug|crash|gagal|kesalahan|perbaiki)\b/i,
  summarization: /\b(summarize|summary|tl;dr|ringkas|rangkum|resume)\b/i,
  translation: /\b(translate|translation|terjemahkan|alih bahasa)\b/i,
  brainstorming: /\b(brainstorm|ideas|ide|gagasan|alternatives|opsi)\b/i,
  academic: /\b(essay|paper|thesis|citation|literature|academic|jurnal|skripsi|makalah|esai)\b/i,
  planning: /\b(plan|roadmap|strategy|milestone|timeline|rencana|strategi|jadwal)\b/i,
  dataAnalysis: /\b(analyze data|dataset|chart|metric|csv|statistics|statistik|visualisasi|data)\b/i,
  shortAnswer: /\b(short answer|briefly|one sentence|yes or no|quickly|jawab singkat|singkat saja)\b/i
};

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function getWords(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? [];
}

function estimateLengthLimitTokens(text: string): number {
  const lower = text.toLowerCase();
  const explicit = lower.match(
    /\b(\d{1,5})\s*(words?|tokens?|sentences?|paragraphs?|kata|token|kalimat|paragraf)\b/i,
  );

  if (!explicit) {
    if (/\b(one sentence|1 sentence|satu kalimat)\b/i.test(lower)) {
      return 40;
    }

    if (/\b(brief|concise|short|singkat|ringkas|pendek)\b/i.test(lower)) {
      return 250;
    }

    return 600;
  }

  const value = Number.parseInt(explicit[1] ?? "0", 10);
  const unit = explicit[2] ?? "tokens";

  if (unit.startsWith("token")) {
    return Math.max(20, value);
  }

  if (unit.startsWith("sentence") || unit === "kalimat") {
    return Math.max(30, value * 35);
  }

  if (unit.startsWith("paragraph") || unit === "paragraf") {
    return Math.max(80, value * 120);
  }

  return Math.max(20, Math.ceil(value * 1.35));
}

function detectRepeatedTerms(words: string[]): string[] {
  const counts = new Map<string, number>();
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "atau",
    "dan",
    "yang",
    "untuk",
    "dengan",
    "saya"
  ]);

  for (const word of words) {
    if (word.length < 5 || stopWords.has(word)) {
      continue;
    }

    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .map(([word]) => word)
    .slice(0, 4);
}

function detectRedundantPhrases(text: string): string[] {
  return REDUNDANT_PATTERNS.flatMap((pattern) => {
    const matches = text.match(pattern) ?? [];
    return matches.map((match) => match.trim());
  }).slice(0, 4);
}

export function extractPromptFeatures(prompt: string, inputTokens?: number): PromptFeatures {
  const normalizedText = prompt.replace(/\s+/g, " ").trim();
  const lowerText = normalizedText.toLowerCase();
  const words = getWords(normalizedText);
  const wordCount = words.length;
  const sentenceCount = Math.max(0, countMatches(normalizedText, /[.!?]+/g));
  const conjunctionCount = countMatches(
    lowerText,
    /\b(and|also|then|plus|as well as|dan|juga|lalu|serta|kemudian)\b/g,
  );
  const listTaskCount = countMatches(lowerText, /\b\d+[.)]\s|\b(first|second|third|pertama|kedua|ketiga)\b/g);
  const taskCount = Math.max(1, conjunctionCount + listTaskCount + (wordCount > 0 ? 1 : 0));
  const hasLengthLimit = LENGTH_LIMIT_PATTERN.test(normalizedText);
  const requestsDetailedExplanation = DETAIL_PATTERN.test(normalizedText);
  const redundantPhrases = detectRedundantPhrases(normalizedText);
  const repeatedTerms = detectRepeatedTerms(words);
  const estimatedInputTokens = inputTokens ?? estimateTokens(normalizedText);

  return {
    normalizedText,
    lowerText,
    charCount: normalizedText.length,
    wordCount,
    sentenceCount,
    inputTokens: estimatedInputTokens,
    hasQuestion: /[?？]|\b(what|why|how|when|where|who|apa|kenapa|mengapa|bagaimana|kapan|di mana|siapa)\b/i.test(
      normalizedText,
    ),
    hasPrimaryAction: ACTION_PATTERN.test(normalizedText),
    hasOutputFormat: FORMAT_PATTERN.test(normalizedText),
    hasLengthLimit,
    lengthLimitTokenEstimate: hasLengthLimit ? estimateLengthLimitTokens(normalizedText) : 0,
    hasAudience: AUDIENCE_PATTERN.test(normalizedText),
    hasGoal: GOAL_PATTERN.test(normalizedText),
    hasContext: CONTEXT_PATTERN.test(normalizedText) || wordCount >= 28,
    requestsDetailedExplanation,
    longOutputRisk:
      requestsDetailedExplanation ||
      (!hasLengthLimit && (wordCount > 80 || conjunctionCount >= 4 || DETAIL_PATTERN.test(normalizedText))),
    codingIndicators: KEYWORD_PATTERNS.coding.test(normalizedText),
    debuggingIndicators: KEYWORD_PATTERNS.debugging.test(normalizedText),
    summarizationIndicators: KEYWORD_PATTERNS.summarization.test(normalizedText),
    translationIndicators: KEYWORD_PATTERNS.translation.test(normalizedText),
    brainstormingIndicators: KEYWORD_PATTERNS.brainstorming.test(normalizedText),
    academicIndicators: KEYWORD_PATTERNS.academic.test(normalizedText),
    planningIndicators: KEYWORD_PATTERNS.planning.test(normalizedText),
    dataAnalysisIndicators: KEYWORD_PATTERNS.dataAnalysis.test(normalizedText),
    shortAnswerIndicators: KEYWORD_PATTERNS.shortAnswer.test(normalizedText),
    taskCount,
    conjunctionCount,
    redundantPhrases,
    repeatedTerms
  };
}
