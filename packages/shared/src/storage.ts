import type { UserSettings } from "@gnomon/core";

import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "./constants";

let memorySettings: UserSettings = DEFAULT_SETTINGS;

type StorageArea = chrome.storage.StorageArea;

function mergeSettings(settings?: Partial<UserSettings>): UserSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(settings ?? {}),
    enabledSites: settings?.enabledSites ?? DEFAULT_SETTINGS.enabledSites
  };
}

function getChromeStorage(): StorageArea | undefined {
  return globalThis.chrome?.storage?.sync ?? globalThis.chrome?.storage?.local;
}

function readLocalStorage(): UserSettings | undefined {
  try {
    const raw = globalThis.localStorage?.getItem(SETTINGS_STORAGE_KEY);
    return raw ? mergeSettings(JSON.parse(raw) as Partial<UserSettings>) : undefined;
  } catch {
    return undefined;
  }
}

function writeLocalStorage(settings: UserSettings): void {
  try {
    globalThis.localStorage?.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    memorySettings = settings;
  }
}

export async function getSettings(): Promise<UserSettings> {
  const storage = getChromeStorage();

  if (!storage) {
    return readLocalStorage() ?? memorySettings;
  }

  const result = await storage.get(SETTINGS_STORAGE_KEY);
  return mergeSettings(result[SETTINGS_STORAGE_KEY] as Partial<UserSettings> | undefined);
}

export async function saveSettings(settings: UserSettings): Promise<UserSettings> {
  const merged = mergeSettings(settings);
  const storage = getChromeStorage();

  if (!storage) {
    memorySettings = merged;
    writeLocalStorage(merged);
    return merged;
  }

  await storage.set({ [SETTINGS_STORAGE_KEY]: merged });
  return merged;
}

export async function updateSettings(
  updater: Partial<UserSettings> | ((settings: UserSettings) => UserSettings),
): Promise<UserSettings> {
  const current = await getSettings();
  const next = typeof updater === "function" ? updater(current) : mergeSettings({ ...current, ...updater });
  return saveSettings(next);
}

export function isSiteEnabled(settings: UserSettings, hostname: string): boolean {
  if (!settings.enabled) {
    return false;
  }

  const isChatGpt = hostname.includes("chatgpt.com") || hostname.includes("chat.openai.com");
  return isChatGpt && settings.enabledSites.includes("chatgpt");
}
