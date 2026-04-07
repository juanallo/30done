import { expect, test } from "@playwright/test";
import { getAllChallenges } from "../lib/data";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("home landing", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});

test("challenges list", async ({ page }) => {
  await page.goto("/challenges");
  await expect(page).toHaveScreenshot("challenges-list.png", { fullPage: true });
});

test("dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveScreenshot("dashboard.png", { fullPage: true });
});

test("progress overview", async ({ page }) => {
  await page.goto("/progress");
  await expect(page).toHaveScreenshot("progress.png", { fullPage: true });
});

test("offline page", async ({ page }) => {
  await page.goto("/offline");
  await expect(page).toHaveScreenshot("offline.png", { fullPage: true });
});

for (const challenge of getAllChallenges()) {
  test(`challenge detail: ${challenge.title}`, async ({ page }) => {
    await page.goto(`/challenges/${challenge.id}`);
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveScreenshot(`challenge-detail-${challenge.id}.png`, {
      fullPage: true,
      timeout: 30_000,
    });
  });
}
