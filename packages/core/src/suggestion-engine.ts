import type { Language, PromptFeatures, PromptIssue, PromptSuggestion } from "./types";

type SuggestionTemplate = Omit<PromptSuggestion, "id">;

const EN_SUGGESTIONS: Record<PromptIssue["type"], SuggestionTemplate> = {
  missing_output_format: {
    type: "add_format",
    title: "Add output structure",
    description: "Ask for a concrete format such as bullets, table, markdown, JSON, or steps.",
    example: "Format the answer as 5 bullet points with a short summary."
  },
  missing_length_limit: {
    type: "add_length_limit",
    title: "Add a response budget",
    description: "Limit the answer length so the model does not expand beyond what you need.",
    example: "Keep the answer under 300 words."
  },
  too_ambiguous: {
    type: "clarify_goal",
    title: "Clarify the task",
    description: "State the exact outcome you want instead of asking broadly.",
    example: "Explain the tradeoffs and recommend one option."
  },
  too_many_tasks: {
    type: "split_prompt",
    title: "Split or structure the tasks",
    description: "Break the prompt into sections or ask the model to answer each task separately.",
    example: "Use sections: context, analysis, recommendation, next steps."
  },
  high_output_risk: {
    type: "reduce_scope",
    title: "Reduce the response scope",
    description: "Ask for the most important points first, then expand only if needed.",
    example: "Focus on the top 3 risks and give one mitigation per risk."
  },
  redundant_phrase: {
    type: "remove_redundancy",
    title: "Remove redundant phrasing",
    description: "Delete polite filler and repeated terms that do not add constraints.",
    example: "Replace 'please help me to create' with 'create'."
  },
  insufficient_context: {
    type: "add_audience",
    title: "Add context and audience",
    description: "Mention who the answer is for and what background the model should assume.",
    example: "Assume the reader is a junior developer."
  }
};

const ID_SUGGESTIONS: Record<PromptIssue["type"], SuggestionTemplate> = {
  missing_output_format: {
    type: "add_format",
    title: "Tambahkan struktur output",
    description: "Minta format konkret seperti bullet, tabel, markdown, JSON, atau langkah.",
    example: "Format jawaban sebagai 5 poin bullet dengan ringkasan singkat."
  },
  missing_length_limit: {
    type: "add_length_limit",
    title: "Tambahkan batas jawaban",
    description: "Batasi panjang jawaban agar model tidak melebar dari kebutuhan.",
    example: "Batasi jawaban maksimal 300 kata."
  },
  too_ambiguous: {
    type: "clarify_goal",
    title: "Perjelas tugas",
    description: "Sebutkan hasil akhir yang kamu inginkan secara langsung.",
    example: "Jelaskan tradeoff dan rekomendasikan satu opsi."
  },
  too_many_tasks: {
    type: "split_prompt",
    title: "Pecah atau strukturkan tugas",
    description: "Pisahkan prompt menjadi beberapa bagian atau minta jawaban per bagian.",
    example: "Gunakan bagian: konteks, analisis, rekomendasi, langkah berikutnya."
  },
  high_output_risk: {
    type: "reduce_scope",
    title: "Persempit cakupan jawaban",
    description: "Minta poin terpenting dulu, lalu perluas hanya jika dibutuhkan.",
    example: "Fokus pada 3 risiko utama dan 1 mitigasi untuk tiap risiko."
  },
  redundant_phrase: {
    type: "remove_redundancy",
    title: "Hapus frasa berulang",
    description: "Buang basa-basi dan pengulangan yang tidak menambah batasan.",
    example: "Ganti 'tolong bantu saya untuk membuat' menjadi 'buat'."
  },
  insufficient_context: {
    type: "add_audience",
    title: "Tambahkan konteks dan audiens",
    description: "Sebutkan jawaban ini untuk siapa dan asumsi latar belakangnya.",
    example: "Anggap pembaca adalah developer junior."
  }
};

const FALLBACK_ORDER: PromptIssue["type"][] = [
  "missing_output_format",
  "missing_length_limit",
  "clarify_goal" as PromptIssue["type"],
  "insufficient_context"
].filter((type): type is PromptIssue["type"] =>
  Object.prototype.hasOwnProperty.call(EN_SUGGESTIONS, type),
);

export function generateSuggestions(
  issues: PromptIssue[],
  features: PromptFeatures,
  language: Language = "en",
): PromptSuggestion[] {
  if (issues.length === 0 && features.wordCount === 0) {
    return [];
  }

  const dictionary = language === "id" ? ID_SUGGESTIONS : EN_SUGGESTIONS;
  const suggestions = issues.map((promptIssue) => ({
    id: `suggestion_${promptIssue.type}`,
    ...dictionary[promptIssue.type]
  }));

  for (const type of FALLBACK_ORDER) {
    if (suggestions.length >= 3) {
      break;
    }

    if (!suggestions.some((suggestion) => suggestion.type === dictionary[type].type)) {
      suggestions.push({
        id: `suggestion_${type}`,
        ...dictionary[type]
      });
    }
  }

  return suggestions.slice(0, 5);
}
