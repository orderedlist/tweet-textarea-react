import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test.describe("URLs", async () => {
    test.describe("String matches URL pattern", async () => {
        test("If the user types a string that matches the URL pattern, then it should be highlighted", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("hello.com", { delay: 100 });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("hello.com");
        });

        test("http and https are allowed as part of the URL", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("http://google.com https://google.com", {
                delay: 100,
            });

            const span = editor.locator("span.highlight");

            await expect(await span.count()).toBe(2);
            await expect(span.nth(0)).toHaveText("http://google.com");
            await expect(span.nth(1)).toHaveText("https://google.com");
        });

        test("'www.' should be allowed as part of the URL", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("www.hello.com", { delay: 100 });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("www.hello.com");
        });

        test("Subdomains should be allowed and highlighted as part of the URL", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("test.hello.com", { delay: 100 });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("test.hello.com");
        });

        test("Dots and hyphens are allowed in the top level domain part", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("the-wizard-apprentice.com", { delay: 100 });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("the-wizard-apprentice.com");
        });

        test("Subdirectories should be allowed and highlighted as part of a URL", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("hello.com/greetings", { delay: 100 });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("hello.com/greetings");
        });

        test("All word characters and some non-word characters should be allowed in the subdirectory part of the URL", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("hello.com/greeting&salutations$hi%test.html", {
                delay: 100,
            });

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText(
                "hello.com/greeting&salutations$hi%test.html"
            );
        });

        test("If the user erases characters from a string that is not highlighted as URL, making it match the URL pattern, then it will be highlighted", async ({
            page,
        }) => {
            const editor = page.locator("div.input-area");

            await editor.type("hello .com", { delay: 100 });

            for (let i = 0; i < 4; i++) {
                await editor.press("ArrowLeft");
            }

            await editor.press("Backspace");

            const span = editor.locator("span");

            await expect(span).toBeVisible();
            await expect(await span.count()).toBe(1);
            await expect(span).toHaveText("hello.com");
        });
    });
});
