import { test, expect } from "@playwright/test";

test.describe("Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the home page", async ({ page }) => {
    await expect(page).toHaveTitle(/Agentic Search/i);
  });

  test("should navigate to search page", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display search input on search page", async ({ page }) => {
    await page.goto("/search");
    const searchInput = page.locator(
      'textarea, input[type="text"], input[type="search"], [role="textbox"]',
    );
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test("should handle CSRF token initialization", async ({ page }) => {
    await page.goto("/search");
    // CSRF token is fetched automatically - verify no 403 errors
    const response = await page.request.get("/api/csrf-token");
    expect(response.status()).toBe(200);
  });

  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Check that navigation links exist
    const nav = page.locator("nav, header");
    await expect(nav.first()).toBeVisible();

    // Navigate to history
    await page.goto("/history");
    await expect(page.locator("body")).toBeVisible();

    // Navigate to settings
    await page.goto("/settings");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display search results area on search page", async ({
    page,
  }) => {
    await page.goto("/search");
    // The page should render without errors
    await expect(page.locator("body")).not.toHaveText(/Error/i);
  });
});
