/**
 * E2E test helpers — bridge to the Puppeteer browser launched in globalSetup
 * and Storybook's story URL format.
 */
const puppeteer = require("puppeteer");

async function getBrowser() {
    return puppeteer.connect({
        browserWSEndpoint: process.env.E2E_BROWSER_WS_ENDPOINT,
    });
}

function storyUrl(storyId) {
    // Storybook iframe URL renders a single story without the UI chrome.
    return `${process.env.E2E_BASE_URL}/iframe.html?args=&id=${storyId}&viewMode=story`;
}

/**
 * Open a fresh page pointed at the given story, wait for its root to render,
 * and return { page, browser, close } for convenient teardown.
 */
async function openStory(storyId, { selector = "#storybook-root > *" } = {}) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    await page.goto(storyUrl(storyId), { waitUntil: "networkidle0" });
    await page.waitForSelector(selector, { timeout: 10000 });
    return {
        page,
        browser,
        close: async () => {
            await page.close();
            await browser.disconnect();
        },
    };
}

/**
 * Accessibility helpers that run inside the page (no external libs).
 * Everything below is written from first principles.
 */
const injectA11yHelpers = async (page) => {
    await page.evaluate(() => {
        window.__a11y = {
            getAccessibleName(el) {
                if (!el) return "";
                const lb = el.getAttribute("aria-labelledby");
                if (lb) {
                    const txt = lb
                        .split(/\s+/)
                        .map(
                            (id) =>
                                document.getElementById(id)?.textContent?.trim() ??
                                ""
                        )
                        .filter(Boolean)
                        .join(" ");
                    if (txt) return txt;
                }
                const al = el.getAttribute("aria-label");
                if (al && al.trim()) return al.trim();
                if (el.id) {
                    const lab = document.querySelector(`label[for="${el.id}"]`);
                    if (lab) return lab.textContent.trim();
                }
                const parentLabel = el.closest?.("label");
                if (parentLabel && parentLabel.textContent?.trim()) {
                    return parentLabel.textContent.trim();
                }
                const tag = el.tagName.toLowerCase();
                const role = el.getAttribute("role") || "";
                const textContentRoles = [
                    "button", "link", "menuitem", "option", "tab",
                    "treeitem", "radio", "switch", "checkbox",
                ];
                if (
                    tag === "button" ||
                    tag === "a" ||
                    /^h[1-6]$/.test(tag) ||
                    textContentRoles.includes(role)
                ) {
                    return el.textContent?.trim() || "";
                }
                // For inputs, check value or placeholder as last resort
                if (tag === "input" || tag === "textarea") {
                    return el.getAttribute("placeholder")?.trim() || "";
                }
                return el.getAttribute("title")?.trim() || "";
            },
            isVisibleFocusRing(el) {
                // A focused element should have a visible box-shadow OR outline.
                const cs = getComputedStyle(el);
                const hasOutline =
                    cs.outlineStyle !== "none" &&
                    parseFloat(cs.outlineWidth) > 0;
                const hasShadow =
                    cs.boxShadow && cs.boxShadow !== "none";
                return hasOutline || hasShadow;
            },
        };
    });
};

module.exports = { getBrowser, openStory, storyUrl, injectA11yHelpers };
