import { test, expect } from "@playwright/test";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? "";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";

test.describe("openUpdatePostModal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");

    await page.locator('input[name="email"]').fill(TEST_USER_EMAIL);
    await page.locator('input[name="password"]').fill(TEST_USER_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL("http://localhost:5173/feed");
    await page.goto("/profile");
    await page.waitForSelector(".post");
    await page.locator(".edit-post-btn").first().click();
    await page.waitForSelector("dialog.app-modal", { state: "visible" });
  });

  test("user can successfully update a post", async ({ page }) => {
    await page.fill("#title", "Updated Title");
    await page.fill("#body", "This is the updated body text.");

    await page.route("**/social/posts/**", async (route) => {
      if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
        return;
      }
      await route.continue();
    });
    await page.getByRole("button", { name: "Save Changes" }).click();

    await page.waitForURL("**/profile");
    await expect(
      page.getByRole("button", { name: "Edit Profile" }),
    ).toBeVisible();
  });

  test("user gets an error message when update post fails", async ({
    page,
  }) => {
    await page.fill("#title", "Broken Update Test");

    await page.route("**/social/posts/**", async (route) => {
      if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 500,
          json: { message: "Update failed on server" },
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("button", { name: "Save Changes" }).click();

    const errorModal = page.locator(".error-modal");

    await expect(errorModal).toBeVisible();
    await page.locator("#errorOkBtn").click();

    await expect(errorModal).not.toBeVisible();
  });

  test("user can successfully delete a post", async ({ page }) => {
    page.once("dialog", (dialog) => dialog.accept());

    await page.route("**/social/posts/**", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
        return;
      }
      await route.continue();
    });

    await page.locator("#deleteBtn").click();
    await page.waitForURL("**/profile");

    await expect(
      page.getByRole("button", { name: "Edit Profile" }),
    ).toBeVisible();
  });

  test("user gets an error message when delete post fails", async ({
    page,
  }) => {
    await page.route("**/social/posts/**", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 500,
          json: { message: "Failed to delete post" },
        });
        return;
      }
      await route.continue();
    });

    await page.locator("#deleteBtn").click();
    await page.locator("#confirmBtn").click();

    const errorModal = page.locator(".error-modal");

    await expect(errorModal).toBeVisible();
    await expect(
      errorModal.getByText("Server error. Please try again later."),
    ).toBeVisible();
    await page.locator("#errorOkBtn").click();

    await expect(errorModal).not.toBeVisible();
  });
});
