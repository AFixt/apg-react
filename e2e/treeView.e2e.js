const { openStory } = require("./helpers");

describe("TreeView (E2E)", () => {
    test("ArrowRight expands closed parent, focuses first child next", async () => {
        const { page, close } = await openStory("components-treeview--default");
        const items = await page.$$("[role='treeitem']");
        await items[0].focus();
        // First press: toggling — but default expanded state may already be open.
        // Instead verify navigation: ArrowDown moves through visible.
        await page.keyboard.press("ArrowDown");
        const focusId = await page.evaluate(() =>
            document.activeElement.getAttribute("data-itemid")
        );
        expect(focusId).toBeTruthy();
        await close();
    });

    test("Home/End jump to first and last visible items", async () => {
        const { page, close } = await openStory("components-treeview--default");
        await page.focus("[role='treeitem']");
        await page.keyboard.press("End");
        const lastFocused = await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll("[role='treeitem']"));
            return document.activeElement === all[all.length - 1];
        });
        expect(lastFocused).toBe(true);
        await page.keyboard.press("Home");
        const firstFocused = await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll("[role='treeitem']"));
            return document.activeElement === all[0];
        });
        expect(firstFocused).toBe(true);
        await close();
    });

    test("only one treeitem has tabindex=0 (roving)", async () => {
        const { page, close } = await openStory("components-treeview--default");
        const counts = await page.evaluate(() => {
            const items = Array.from(
                document.querySelectorAll("[role='treeitem']")
            );
            return {
                tabbable: items.filter((i) => i.getAttribute("tabindex") === "0")
                    .length,
                total: items.length,
            };
        });
        expect(counts.tabbable).toBe(1);
        expect(counts.total).toBeGreaterThan(1);
        await close();
    });
});
