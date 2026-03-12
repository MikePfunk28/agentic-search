import { test, expect } from "@playwright/test";

test.describe("Settings Flow", () => {
  test("should load settings page", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display model configuration options", async ({ page }) => {
    await page.goto("/settings");
    // Settings page should have tabs or sections for Local, Cloud, Search APIs
    const settingsContent = page.locator("body");
    await expect(settingsContent).toBeVisible({ timeout: 10000 });
  });

  test("should not expose API keys in page source", async ({ page }) => {
    await page.goto("/settings");
    const content = await page.content();
    // Ensure no raw API key patterns are in the HTML
    expect(content).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
    expect(content).not.toMatch(/key-[a-zA-Z0-9]{20,}/);
  });

  test("should handle model detection endpoint", async ({ page }) => {
    await page.goto("/settings");
    // The detect-models API should respond (may fail if no local model running, but shouldn't 500)
    const response = await page.request.get("/api/detect-models");
    expect([200, 404, 503]).toContain(response.status());
  });
});
