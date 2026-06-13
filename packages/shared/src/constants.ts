import type { SupportedSite, UserSettings } from "@gnomon/core";

export const SUPPORTED_SITES: SupportedSite[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    matches: ["chatgpt.com", "chat.openai.com"],
    inputSelectors: [
      "[data-testid='prompt-textarea']",
      "textarea",
      "[contenteditable='true']",
      "div[role='textbox']"
    ]
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  enabled: true,
  showInlineWidget: true,
  showSidebar: true,
  localOnlyMode: true,
  tokenBudget: 1000,
  optimizationMode: "balanced",
  language: "en",
  modelProfile: "gpt_like",
  enabledSites: ["chatgpt"]
};

export const SETTINGS_STORAGE_KEY = "gnomon.settings";
