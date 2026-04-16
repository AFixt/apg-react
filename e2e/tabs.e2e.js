const { openStory } = require("./helpers");

const TAB = "#storybook-root [role='tab']";

describe("Tabs (E2E)", () => {
    test("Arrow Right cycles tabs with automatic activation", async () => {
        const { page, close } = await openStory("components-tabs--horizontal");
        await page.focus(TAB);
        await page.keyboard.press("ArrowRight");
        const activeIdx = await page.evaluate(() => {
            const tabs = Array.from(
                document.querySelectorAll("#storybook-root [role='tab']")
            );
            return tabs.findIndex(
                (t) => t.getAttribute("aria-selected") === "true"
            );
        });
        expect(activeIdx).toBe(1);
        await close();
    });

    test("End key jumps to last tab", async () => {
        const { page, close } = await openStory("components-tabs--horizontal");
        await page.focus(TAB);
        await page.keyboard.press("End");
        const lastSelected = await page.evaluate(() => {
            const tabs = Array.from(
                document.querySelectorAll("#storybook-root [role='tab']")
            );
            return (
                tabs[tabs.length - 1].getAttribute("aria-selected") === "true"
            );
        });
        expect(lastSelected).toBe(true);
        await close();
    });

    test("manual activation: Arrow moves focus but not selection; Enter activates", async () => {
        const { page, close } = await openStory(
            "components-tabs--manual-activation"
        );
        // play() may have run already; find the currently-selected tab index
        const startIdx = await page.evaluate(() => {
            const tabs = Array.from(
                document.querySelectorAll("#storybook-root [role='tab']")
            );
            return tabs.findIndex(
                (t) => t.getAttribute("aria-selected") === "true"
            );
        });
        // Focus the currently-selected tab
        await page.evaluate((idx) => {
            document.querySelectorAll("#storybook-root [role='tab']")[idx]?.focus();
        }, startIdx);
        // ArrowRight moves focus but NOT selection (manual mode)
        await page.keyboard.press("ArrowRight");
        const unchanged = await page.evaluate((idx) => {
            const tabs = Array.from(
                document.querySelectorAll("#storybook-root [role='tab']")
            );
            return tabs[idx].getAttribute("aria-selected");
        }, startIdx);
        expect(unchanged).toBe("true");
        // Enter activates the now-focused (but not selected) tab
        await page.keyboard.press("Enter");
        const nextIdx = (startIdx + 1) % 3;
        const nowActive = await page.evaluate((idx) => {
            const tabs = Array.from(
                document.querySelectorAll("#storybook-root [role='tab']")
            );
            return tabs[idx].getAttribute("aria-selected");
        }, nextIdx);
        expect(nowActive).toBe("true");
        await close();
    });
});
