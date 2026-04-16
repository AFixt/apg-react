/**
 * Cross-component accessibility E2E smoke test.
 *
 * Navigates to a set of representative stories in a real browser and asserts
 * fundamental a11y contracts using only first-principles DOM inspection. NO
 * external accessibility libraries (axe-core, etc.) are used.
 */
const { openStory, injectA11yHelpers } = require("./helpers");

const STORIES = [
    "components-button--default",
    "components-checkbox--unchecked",
    "components-combobox--autocomplete-list",
    "components-listbox--single-select",
    "components-radiogroup--default",
    "components-menubutton--default",
    "components-menubar--default",
    "components-modaldialog--default",
    "components-progressbar--determinate",
    "components-slider--horizontal",
    "components-spinbutton--default",
    "components-switch--off",
    "components-tabs--horizontal",
    "components-textbox--single-line",
    "components-toolbar--default",
    "components-treeview--default",
    "components-treegrid--default",
];

// Progressbar, Meter are display-only widgets — no interactive elements expected.
const NON_INTERACTIVE = new Set([
    "components-progressbar--determinate",
]);

describe.each(STORIES)("[a11y smoke] %s", (storyId) => {
    test("every interactive element has an accessible name", async () => {
        const { page, close } = await openStory(storyId);
        await injectA11yHelpers(page);
        const offenders = await page.evaluate(() => {
            const interactive = Array.from(
                document.querySelectorAll(
                    [
                        "button:not([aria-hidden='true'])",
                        "a[href]",
                        "[role='button']",
                        "[role='link']",
                        "[role='menuitem']",
                        "[role='option']",
                        "[role='tab']",
                        "[role='switch']",
                        "[role='checkbox']",
                        "[role='radio']",
                        "[role='slider']",
                        "[role='spinbutton']",
                        "[role='combobox']",
                        "[role='treeitem']",
                        "input:not([type='hidden'])",
                        "textarea",
                        "select",
                    ].join(",")
                )
            );
            return interactive
                .filter((el) => {
                    // Skip elements hidden from a11y tree
                    let n = el;
                    while (n && n !== document.body) {
                        if (n.getAttribute?.("aria-hidden") === "true")
                            return false;
                        n = n.parentElement;
                    }
                    return !window.__a11y.getAccessibleName(el);
                })
                .map((el) => el.outerHTML.slice(0, 120));
        });
        expect(offenders).toEqual([]);
        await close();
    });

    test("all aria-* id references resolve to real elements", async () => {
        const { page, close } = await openStory(storyId);
        const dangling = await page.evaluate(() => {
            const attrs = [
                "aria-labelledby",
                "aria-describedby",
                "aria-activedescendant",
                "aria-errormessage",
                "aria-details",
                "aria-owns",
            ];
            // aria-controls is checked separately: skip when the element has
            // aria-expanded="false" (the controlled popup is legitimately absent).
            const offenders = [];
            document.querySelectorAll("*").forEach((el) => {
                for (const a of attrs) {
                    const v = el.getAttribute(a);
                    if (!v) continue;
                    v.split(/\s+/).forEach((id) => {
                        if (!document.getElementById(id)) {
                            offenders.push(`${el.tagName}[${a}="${id}"]`);
                        }
                    });
                }
                // aria-controls: only flag when the popup is expected to be open
                const controls = el.getAttribute("aria-controls");
                if (controls && el.getAttribute("aria-expanded") !== "false") {
                    controls.split(/\s+/).forEach((id) => {
                        if (!document.getElementById(id)) {
                            offenders.push(
                                `${el.tagName}[aria-controls="${id}"]`
                            );
                        }
                    });
                }
            });
            return offenders;
        });
        expect(dangling).toEqual([]);
        await close();
    });

    test("boolean aria-* attributes carry valid values", async () => {
        const { page, close } = await openStory(storyId);
        const bad = await page.evaluate(() => {
            const BOOLEAN_ATTRS = [
                "aria-expanded",
                "aria-selected",
                "aria-checked",
                "aria-pressed",
                "aria-disabled",
                "aria-hidden",
                "aria-readonly",
                "aria-required",
                "aria-invalid",
                "aria-modal",
                "aria-busy",
                "aria-multiselectable",
            ];
            const TRISTATE_ATTRS = ["aria-checked", "aria-pressed"];
            const offenders = [];
            document.querySelectorAll("*").forEach((el) => {
                BOOLEAN_ATTRS.forEach((a) => {
                    if (!el.hasAttribute(a)) return;
                    const v = el.getAttribute(a);
                    const allowed =
                        v === "true" ||
                        v === "false" ||
                        (TRISTATE_ATTRS.includes(a) && v === "mixed") ||
                        (a === "aria-invalid" &&
                            ["grammar", "spelling"].includes(v));
                    if (!allowed) {
                        offenders.push(`${el.tagName}[${a}="${v}"]`);
                    }
                });
            });
            return offenders;
        });
        expect(bad).toEqual([]);
        await close();
    });

    if (!NON_INTERACTIVE.has(storyId)) {
        test("at least one element inside the story is keyboard focusable", async () => {
            const { page, close } = await openStory(storyId);
            const hasFocusable = await page.evaluate(() => {
                const root = document.querySelector("#storybook-root");
                if (!root) return false;
                const candidates = root.querySelectorAll(
                    "a[href], button, input, textarea, select, [tabindex]"
                );
                return Array.from(candidates).some((el) => {
                    if (el.disabled) return false;
                    const ti = el.getAttribute("tabindex");
                    return ti === null || parseInt(ti, 10) >= 0;
                });
            });
            expect(hasFocusable).toBe(true);
            await close();
        });
    }
});
