import { useEffect, useMemo, useState } from "react";

import type { UserSettings } from "@gnomon/core";
import { Badge, Button, Card } from "@gnomon/ui";
import { DEFAULT_SETTINGS, getSettings, isSiteEnabled, t, updateSettings } from "@gnomon/shared";

function isChatGptHost(hostname: string): boolean {
  return hostname.includes("chatgpt.com") || hostname.includes("chat.openai.com");
}

async function getActiveHostname(): Promise<string> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tabs[0]?.url;

  if (!url) {
    return "";
  }

  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function PopupApp() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    void Promise.all([getSettings(), getActiveHostname()]).then(([loadedSettings, activeHostname]) => {
      setSettings(loadedSettings);
      setHostname(activeHostname);
    });
  }, []);

  const supported = isChatGptHost(hostname);
  const active = supported && isSiteEnabled(settings, hostname);
  const language = settings.language;
  const statusTone = active ? "good" : "warning";
  const statusText = active ? t(language, "active") : t(language, "disabled");

  const siteActionLabel = useMemo(() => {
    if (!supported) {
      return t(language, "disabled");
    }

    return active ? t(language, "disableOnThisSite") : t(language, "enableOnThisSite");
  }, [active, language, supported]);

  const save = async (partial: Partial<UserSettings>) => {
    const next = await updateSettings(partial);
    setSettings(next);
  };

  const toggleSite = async () => {
    if (!supported) {
      return;
    }

    const enabledSites: UserSettings["enabledSites"] = active ? [] : ["chatgpt"];
    await save({ enabledSites });
  };

  return (
    <main className="w-[360px] p-4">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{t(language, "appName")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t(language, "appDescription")}</p>
        </div>
        <Badge tone={statusTone}>{statusText}</Badge>
      </header>

      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{t(language, "status")}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {hostname || "No active tab"}
            </span>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">{t(language, "tokenBudget")}</span>
            <input
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              min={100}
              step={100}
              type="number"
              value={settings.tokenBudget}
              onChange={(event) => void save({ tokenBudget: Number(event.currentTarget.value) })}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">{t(language, "optimizationMode")}</span>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={settings.optimizationMode}
              onChange={(event) =>
                void save({ optimizationMode: event.currentTarget.value as UserSettings["optimizationMode"] })
              }
            >
              <option value="safe">Safe</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">{t(language, "language")}</span>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={settings.language}
              onChange={(event) => void save({ language: event.currentTarget.value as UserSettings["language"] })}
            >
              <option value="en">English</option>
              <option value="id">Indonesia</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{t(language, "localAnalysis")}</span>
            <input
              checked={settings.localOnlyMode}
              type="checkbox"
              onChange={(event) => void save({ localOnlyMode: event.currentTarget.checked })}
            />
          </label>
        </div>
      </Card>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t(language, "privacyNote")}</p>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1" size="sm" onClick={() => chrome.runtime.openOptionsPage()}>
          {t(language, "openSettings")}
        </Button>
        <Button className="flex-1" size="sm" variant="secondary" disabled={!supported} onClick={toggleSite}>
          {siteActionLabel}
        </Button>
      </div>
    </main>
  );
}
