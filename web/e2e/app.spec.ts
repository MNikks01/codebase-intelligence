import { test, expect } from "@playwright/test";

test("loads with an accessible heading + primary action; health is ok", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /codebase intelligence/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try a demo repo" }).first()).toBeVisible();
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).status).toBe("ok");
});
