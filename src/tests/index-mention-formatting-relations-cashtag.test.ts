import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test.describe("Mentions", async () => {
    test.describe("Mentions relation to other entities", async () => {
        test.describe("Mentions in relation to cashtags", async () => {
            test("If the user types the $ character after a highlighted mention, then the highlighting will be maintained", async ({
                page,
            }) => {
                const editor = page.locator("div.input-area");

                await editor.type("Hello @amsaid1989$", { delay: 100 });

                const span = editor.locator("span");

                await expect(span).toBeVisible();
                await expect(await span.count()).toBe(1);
                await expect(span).toHaveText("@amsaid1989");
            });

            test("If the user types a valid cashtag after a highlighted mention, then the highlighting will be maintained", async ({
                page,
            }) => {
                const editor = page.locator("div.input-area");

                await editor.type("Hello @amsaid1989$AMZN", { delay: 100 });

                const span = editor.locator("span");
                const html = await editor.innerHTML();

                await expect(span).toBeVisible();
                await expect(await span.count()).toBe(1);
                await expect(span).toHaveText("@amsaid1989");
            });

            test("If the user types the $ character immediately before a highlighted mention, with no characters separating them, then the highlighting will be removed", async ({
                page,
            }) => {
                const editor = page.locator("div.input-area");

                await editor.type("Hello @amsaid", { delay: 100 });

                for (let i = 0; i < 7; i++) {
                    await editor.press("ArrowLeft");
                }

                await editor.type("$", { delay: 100 });

                const p = editor.locator("p");
                const span = editor.locator("span");

                await expect(span).toBeHidden();
                await expect(await p.count()).toBe(1);
                await expect(p).toHaveText("Hello $@amsaid");
            });

            test("If the user types the $ character, followed by other word characters, immediately before a highlighted hashtag, with no characters separating them, then the highlighting will be removed", async ({
                page,
            }) => {
                const editor = page.locator("div.input-area");

                await editor.type("Hello @amsaid", { delay: 100 });

                const span = editor.locator("span");

                for (let i = 0; i < 7; i++) {
                    await editor.press("ArrowLeft");
                }

                await editor.type("$AMZN", { delay: 100 });

                await expect(span).toBeVisible();
                await expect(await span.count()).toBe(1);
                await expect(span).toHaveText("$AMZN");
            });
        });
    });
});
