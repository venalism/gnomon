import { createRoot, type Root } from "react-dom/client";

import { analyzePrompt, type PromptAnalysisResult, type UserSettings } from "@gnomon/core";
import { getSettings, isSiteEnabled, SETTINGS_STORAGE_KEY } from "@gnomon/shared";

import { GnomonWidget } from "../overlay/GnomonWidget";
import { widgetStyles } from "../overlay/widget-styles";
import { observePromptInput, type PromptObserver } from "./prompt-observer";
import { isSupportedHost } from "./supported-sites";

let root: Root | null = null;
let container: HTMLDivElement | null = null;
let promptObserver: PromptObserver | null = null;
let settings: UserSettings | null = null;
let latestAnalysis: PromptAnalysisResult | null = null;

function ensureStyles(): void {
  if (document.getElementById("gnomon-widget-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "gnomon-widget-styles";
  style.textContent = widgetStyles;
  document.documentElement.append(style);
}

function ensureContainer(): HTMLDivElement {
  if (container) {
    return container;
  }

  ensureStyles();
  container = document.createElement("div");
  container.className = "gnomon-root";
  document.documentElement.append(container);
  root = createRoot(container);
  return container;
}

function cleanup(): void {
  promptObserver?.disconnect();
  promptObserver = null;
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  latestAnalysis = null;
}

function render(): void {
  if (!settings?.showInlineWidget) {
    return;
  }

  ensureContainer();
  root?.render(
    <GnomonWidget
      analysis={latestAnalysis}
      language={settings.language}
      optimizationMode={settings.optimizationMode}
      tokenBudget={settings.tokenBudget}
      onApply={(prompt) => promptObserver?.setCurrentPrompt(prompt)}
    />,
  );
}

async function boot(): Promise<void> {
  if (!isSupportedHost(window.location.hostname)) {
    return;
  }

  settings = await getSettings();

  if (!isSiteEnabled(settings, window.location.hostname) || !settings.showInlineWidget) {
    cleanup();
    return;
  }

  render();
  promptObserver?.disconnect();
  promptObserver = observePromptInput(({ text }) => {
    latestAnalysis = text.trim()
      ? analyzePrompt(text, {
          language: settings?.language,
          tokenBudget: settings?.tokenBudget,
          optimizationMode: settings?.optimizationMode,
          modelProfile: settings?.modelProfile
        })
      : null;
    render();
  });
}

void boot();

chrome.storage?.onChanged?.addListener((changes) => {
  if (changes[SETTINGS_STORAGE_KEY]) {
    void boot();
  }
});
