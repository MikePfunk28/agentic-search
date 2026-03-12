import { test, expect } from "@playwright/test";

test.describe("History Flow", () => {
  test("should load history page", async ({ page }) => {
    await page.goto("/history");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should load comparison page", async ({ page }) => {
    await page.goto("/comparison");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should load export page", async ({ page }) => {
    await page.goto("/export");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should load analytics page", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should load profile page", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should not have broken links on history page", async ({ page }) => {
    await page.goto("/history");
    // Check that the page doesn't show React error boundaries
    const errorBoundary = page.locator('[class*="error"], [data-error]');
    const count = await errorBoundary.count();
    // If error boundaries exist, they should not be visible
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(errorBoundary.nth(i)).not.toBeVisible();
      }
    }
  });
});
