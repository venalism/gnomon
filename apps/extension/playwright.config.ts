import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  fullyParallel: false,
  reporter: "list"
});
