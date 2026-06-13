import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

import { chromium, expect, test } from "@playwright/test";

const extensionPath = resolve("dist");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

test("renders token analysis on a mock ChatGPT page", async ({ browserName: _browserName }, testInfo) => {
  test.skip(!existsSync(join(extensionPath, "manifest.json")), "Run pnpm build before e2e tests.");

  const context = await chromium.launchPersistentContext(testInfo.outputPath("profile"), {
    headless: false,
    executablePath: existsSync(edgePath) ? edgePath : undefined,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });

  try {
    const page = await context.newPage();
    await page.route("https://chatgpt.com/**", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <!doctype html>
          <html>
            <body>
              <main style="padding: 40px">
                <textarea data-testid="prompt-textarea" style="width: 600px; height: 160px"></textarea>
              </main>
            </body>
          </html>
        `
      });
    });

    await page.goto("https://chatgpt.com/");
    await page.fill(
      "[data-testid='prompt-textarea']",
      "Explain API Gateway and Swagger in detail for junior developers.",
    );

    await expect(page.locator(".gnomon-root")).toBeVisible();
    await expect(page.locator(".gnomon-root")).toContainText("Gnomon");
    await expect(page.locator(".gnomon-root")).toContainText("Score");
    await page.getByRole("button", { name: "Expand" }).click();
    await page.getByRole("button", { name: "Optimize Prompt" }).click();
    await expect(page.locator(".gnomon-root")).toContainText("Optimized");
  } finally {
    await context.close();
  }
});
