import { test, expect } from "@playwright/test";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? "";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";

test.describe("login", () => {
  test("user can login", async ({ page }) => {
    await page.goto("/login");

    await page.locator('input[name="email"]').fill(TEST_USER_EMAIL);
    await page.locator('input[name="password"]').fill(TEST_USER_PASSWORD);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Feed")).toBeVisible();
  });

  test("wrong password, shows error", async ({ page }) => {
    await page.goto("/login");

    await page.locator('input[name="email"]').fill(TEST_USER_EMAIL);
    await page.locator('input[name="password"]').fill("wrongpassword");

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.locator("#loginError")).toContainText(
      "Invalid credentials. Please try again.",
    );
  });
});
