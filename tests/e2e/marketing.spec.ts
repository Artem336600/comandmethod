import { test, expect } from "@playwright/test";

test("marketing page exposes the primary product message", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /see delivery as a system/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open workspace/i })).toBeVisible();
});
