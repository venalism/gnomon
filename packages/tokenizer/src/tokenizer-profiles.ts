export type ModelProfile = "gpt_like" | "claude_like" | "gemini_like" | "custom";

export interface TokenizerProfile {
  id: ModelProfile;
  label: string;
  charsPerToken: number;
}

export const TOKENIZER_PROFILES: Record<ModelProfile, TokenizerProfile> = {
  gpt_like: {
    id: "gpt_like",
    label: "GPT-like",
    charsPerToken: 4
  },
  claude_like: {
    id: "claude_like",
    label: "Claude-like",
    charsPerToken: 4.2
  },
  gemini_like: {
    id: "gemini_like",
    label: "Gemini-like",
    charsPerToken: 4.1
  },
  custom: {
    id: "custom",
    label: "Custom approximate",
    charsPerToken: 4
  }
};

export function getTokenizerProfile(modelProfile: ModelProfile = "gpt_like"): TokenizerProfile {
  return TOKENIZER_PROFILES[modelProfile] ?? TOKENIZER_PROFILES.gpt_like;
}
