import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@gnomon/shared";

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  await saveSettings({ ...DEFAULT_SETTINGS, ...settings });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GNOMON_PING") {
    sendResponse({ ok: true });
    return false;
  }

  return false;
});
