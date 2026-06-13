import { useEffect, useState } from "react";

import type { UserSettings } from "@gnomon/core";
import { Badge, Button, Card } from "@gnomon/ui";
import { DEFAULT_SETTINGS, getSettings, saveSettings, t, updateSettings } from "@gnomon/shared";

export function OptionsApp() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const language = settings.language;

  useEffect(() => {
    void getSettings().then(setSettings);
  }, []);

  const save = async (partial: Partial<UserSettings>) => {
    const next = await updateSettings(partial);
    setSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const reset = async () => {
    const next = await saveSettings(DEFAULT_SETTINGS);
    setSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t(language, "appName")} Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(language, "privacyNote")}</p>
        </div>
        {saved ? <Badge tone="good">{t(language, "settingsSaved")}</Badge> : null}
      </header>

      <Card className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{t(language, "status")}</span>
            <input
              checked={settings.enabled}
              type="checkbox"
              onChange={(event) => void save({ enabled: event.currentTarget.checked })}
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{t(language, "showInlineWidget")}</span>
            <input
              checked={settings.showInlineWidget}
              type="checkbox"
              onChange={(event) => void save({ showInlineWidget: event.currentTarget.checked })}
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{t(language, "showSidebar")}</span>
            <input
              checked={settings.showSidebar}
              type="checkbox"
              onChange={(event) => void save({ showSidebar: event.currentTarget.checked })}
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{t(language, "localAnalysis")}</span>
            <input
              checked={settings.localOnlyMode}
              type="checkbox"
              onChange={(event) => void save({ localOnlyMode: event.currentTarget.checked })}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">{t(language, "tokenBudget")}</span>
            <input
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              min={100}
              step={100}
              type="number"
              value={settings.tokenBudget}
              onChange={(event) => void save({ tokenBudget: Number(event.currentTarget.value) })}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">{t(language, "optimizationMode")}</span>
            <select
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
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

          <label className="grid gap-2 text-sm">
            <span className="font-medium">{t(language, "language")}</span>
            <select
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={settings.language}
              onChange={(event) => void save({ language: event.currentTarget.value as UserSettings["language"] })}
            >
              <option value="en">English</option>
              <option value="id">Indonesia</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Model profile</span>
            <select
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={settings.modelProfile}
              onChange={(event) =>
                void save({ modelProfile: event.currentTarget.value as UserSettings["modelProfile"] })
              }
            >
              <option value="gpt_like">GPT-like</option>
              <option value="claude_like">Claude-like</option>
              <option value="gemini_like">Gemini-like</option>
              <option value="custom">Custom approximate</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={reset}>
            Reset defaults
          </Button>
        </div>
      </Card>
    </main>
  );
}
