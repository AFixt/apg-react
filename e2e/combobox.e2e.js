const { openStory } = require("./helpers");

const CB = "#storybook-root [role='combobox']";
const LB = "#storybook-root [role='listbox']";

async function clearAndType(page, selector, text) {
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type(selector, text, { delay: 50 });
}

describe("Combobox (E2E)", () => {
    test("typing filters the popup and Enter selects an option", async () => {
        const { page, close } = await openStory(
            "components-combobox--autocomplete-list"
        );
        await clearAndType(page, CB, "Arg");
        await page.waitForSelector(LB, { timeout: 5000 });
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        const value = await page.$eval(CB, (el) => el.value);
        expect(value).toBe("Argentina");
        await close();
    });

    test("Escape closes the popup", async () => {
        const { page, close } = await openStory(
            "components-combobox--autocomplete-list"
        );
        await clearAndType(page, CB, "A");
        await page.waitForSelector(LB, { timeout: 5000 });
        await page.keyboard.press("Escape");
        await page.waitForFunction(
            () => !document.querySelector("#storybook-root [role='listbox']"),
            { timeout: 5000 }
        );
        await close();
    });

    test("aria-activedescendant points to a real option", async () => {
        const { page, close } = await openStory(
            "components-combobox--autocomplete-list"
        );
        await clearAndType(page, CB, "A");
        await page.waitForSelector(LB, { timeout: 5000 });
        await page.keyboard.press("ArrowDown");
        const { activeId, optionExists } = await page.evaluate(() => {
            const input = document.querySelector(
                "#storybook-root [role='combobox']"
            );
            const activeId = input.getAttribute("aria-activedescendant");
            return {
                activeId,
                optionExists: activeId
                    ? !!document.getElementById(activeId)
                    : false,
            };
        });
        expect(activeId).toBeTruthy();
        expect(optionExists).toBe(true);
        await close();
    });
});
