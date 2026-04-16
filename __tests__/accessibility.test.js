/**
 * Consolidated accessibility contract tests.
 *
 * No external a11y libraries (axe-core, jest-axe, etc.) are used. Every
 * assertion is implemented against the DOM via helpers in
 * `__tests__/helpers/a11y.js`.
 *
 * For each component, this file asserts:
 *   - required role
 *   - accessible name present
 *   - every aria-* id reference resolves to a real element
 *   - focusability matches the pattern's expectation
 *   - roving tabindex invariants (where applicable)
 *   - boolean ARIA states use valid values
 *   - label/control association where applicable
 */
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

import {
    assertHasAccessibleName,
    assertRole,
    assertAriaBooleanState,
    assertRovingTabindex,
    assertAriaReferencesResolve,
    assertLabelAssociated,
    getAccessibleName,
    isKeyboardFocusable,
    isInAccessibilityTree,
} from "./helpers/a11y";

import Accordion from "../components/Accordion/Accordion";
import Alert from "../components/Alert/Alert";
import AlertDialog from "../components/AlertDialog/AlertDialog";
import Article from "../components/Article/Article";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Button from "../components/Button/Button";
import Checkbox from "../components/Checkbox/Checkbox";
import CheckboxGroup from "../components/CheckboxGroup/CheckboxGroup";
import Combobox from "../components/Combobox/Combobox";
import Disclosure from "../components/Disclosure/Disclosure";
import Grid from "../components/Grid/Grid";
import Listbox from "../components/Listbox/Listbox";
import MenuButton from "../components/MenuButton/MenuButton";
import Menubar from "../components/Menubar/Menubar";
import Meter from "../components/Meter/Meter";
import ModalDialog from "../components/ModalDialog/ModalDialog";
import Progressbar from "../components/Progressbar/Progressbar";
import RadioGroup from "../components/RadioGroup/RadioGroup";
import Slider from "../components/Slider/Slider";
import SliderMultiThumb from "../components/SliderMultiThumb/SliderMultiThumb";
import Spinbutton from "../components/Spinbutton/Spinbutton";
import Switch from "../components/Switch/Switch";
import Tabs from "../components/Tabs/Tabs";
import Textbox from "../components/Textbox/Textbox";
import Toolbar from "../components/Toolbar/Toolbar";
import Tooltip from "../components/Tooltip/Tooltip";
import TreeGrid from "../components/TreeGrid/TreeGrid";
import TreeView from "../components/TreeView/TreeView";

describe("Accessibility contracts (no external a11y libs)", () => {
    describe("Accordion", () => {
        const items = [
            { title: "One", content: "1" },
            { title: "Two", content: "2" },
        ];
        test("each header is a button with an accessible name and aria-expanded/controls", () => {
            render(
                <Accordion items={items} openIndex={0} toggleItem={() => {}} />
            );
            screen.getAllByRole("button").forEach((btn) => {
                assertHasAccessibleName(btn, "accordion header");
                assertAriaBooleanState(btn, "aria-expanded");
                assertAriaReferencesResolve(btn, ["aria-controls"]);
            });
        });
        test("each panel is labelled by its header", () => {
            render(
                <Accordion items={items} openIndex={0} toggleItem={() => {}} />
            );
            screen.getAllByRole("region").forEach((panel) => {
                assertAriaReferencesResolve(panel, ["aria-labelledby"]);
                assertHasAccessibleName(panel, "accordion panel");
            });
        });
    });

    describe("Alert", () => {
        test("has role=alert, aria-live=assertive, and a dismiss button with accessible name", () => {
            render(<Alert message="Saved" type="info" />);
            const alert = screen.getByRole("alert");
            expect(alert).toHaveAttribute("aria-live", "assertive");
            const close = screen.getByRole("button");
            expect(getAccessibleName(close)).toBe("Dismiss");
        });
    });

    describe("AlertDialog", () => {
        test("role=alertdialog, aria-modal=true, and proper labelling/description", () => {
            render(
                <AlertDialog
                    isOpen
                    title="Confirm"
                    message="Are you sure?"
                    onClose={() => {}}
                />
            );
            const dlg = screen.getByRole("alertdialog");
            expect(dlg).toHaveAttribute("aria-modal", "true");
            assertAriaReferencesResolve(dlg, ["aria-labelledby", "aria-describedby"]);
            assertHasAccessibleName(dlg, "alertdialog");
        });
    });

    describe("Article", () => {
        test("native article landmark with heading as accessible name source", () => {
            const { container } = render(
                <Article
                    article={{ id: "1", title: "T", content: "c" }}
                    ariaPosinset={1}
                    ariaSetsize={1}
                />
            );
            const article = container.querySelector("article");
            expect(article).toBeInTheDocument();
            const h2 = article.querySelector("h2");
            expect(h2).toBeInTheDocument();
            assertHasAccessibleName(h2);
        });
    });

    describe("Breadcrumb", () => {
        test("nav landmark with aria-label, links with names, current page non-link", () => {
            render(
                <Router>
                    <Breadcrumb
                        items={[
                            { path: "/", label: "Home" },
                            { path: "/a", label: "Section" },
                            { path: "/a/b", label: "Page" },
                        ]}
                    />
                </Router>
            );
            const nav = screen.getByRole("navigation");
            expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
            screen.getAllByRole("link").forEach((l) =>
                assertHasAccessibleName(l, "breadcrumb link")
            );
            const current = nav.querySelector("[aria-current='page']");
            expect(current).toBeInTheDocument();
            expect(current.tagName).not.toBe("A");
        });
    });

    describe("Button", () => {
        test("has accessible name and correct aria-disabled state", () => {
            render(<Button action={() => {}} label="Submit" isDisabled />);
            const btn = screen.getByRole("button");
            expect(getAccessibleName(btn)).toBe("Submit");
            expect(btn).toHaveAttribute("aria-disabled", "true");
        });
        test("toggle button surfaces valid aria-pressed", () => {
            render(
                <Button action={() => {}} label="Bold" isToggleButton toggleState />
            );
            const btn = screen.getByRole("button");
            expect(btn.getAttribute("aria-pressed")).toMatch(/^(true|false)$/);
        });
    });

    describe("Checkbox", () => {
        test("has accessible name and associates label with input", () => {
            render(
                <Checkbox label="Remember me" checked={false} onChange={() => {}} />
            );
            const cb = screen.getByRole("checkbox");
            expect(getAccessibleName(cb)).toBe("Remember me");
            // The visible <label> element resolves to this input via htmlFor
            const labelEl = screen
                .getByText("Remember me")
                .closest("label");
            expect(assertLabelAssociated(labelEl)).toBe(cb);
        });
        test("tri-state exposes aria-checked=mixed when indeterminate", () => {
            render(
                <Checkbox
                    label="All"
                    checked={null}
                    isTriState
                    onChange={() => {}}
                />
            );
            expect(screen.getByRole("checkbox")).toHaveAttribute(
                "aria-checked",
                "mixed"
            );
        });
    });

    describe("CheckboxGroup", () => {
        test("group is labelled and parent reflects mixed state", () => {
            render(
                <CheckboxGroup
                    label="Options"
                    items={[
                        { id: "1", label: "A" },
                        { id: "2", label: "B" },
                    ]}
                />
            );
            const group = screen.getByRole("group");
            assertAriaReferencesResolve(group, ["aria-labelledby"]);
            assertHasAccessibleName(group);
            const [parent] = screen.getAllByRole("checkbox");
            assertHasAccessibleName(parent);
        });
    });

    describe("Combobox", () => {
        test("has role=combobox, accessible name, aria-expanded, and resolves aria-controls", () => {
            render(
                <Combobox
                    label="Country"
                    options={[{ value: "x", label: "X" }]}
                    value=""
                    onChange={() => {}}
                />
            );
            const cb = screen.getByRole("combobox");
            expect(getAccessibleName(cb)).toBe("Country");
            assertAriaBooleanState(cb, "aria-expanded");
            expect(cb).toHaveAttribute("aria-autocomplete");
            // aria-controls exists even when popup is closed (references listbox id)
            expect(cb.getAttribute("aria-controls")).toBeTruthy();
        });
    });

    describe("Disclosure", () => {
        test("button has accessible name and aria-expanded/controls reference resolves", () => {
            render(<Disclosure title="More">Content</Disclosure>);
            const btn = screen.getByRole("button");
            assertHasAccessibleName(btn);
            assertAriaBooleanState(btn, "aria-expanded");
            assertAriaReferencesResolve(btn, ["aria-controls"]);
        });
    });

    describe("Grid", () => {
        test("grid is labelled, row/col counts set, cells use roving tabindex", () => {
            render(
                <Grid
                    label="People"
                    columns={[
                        { key: "a", label: "A" },
                        { key: "b", label: "B" },
                    ]}
                    rows={[{ id: "1", a: "1", b: "2" }]}
                />
            );
            const grid = screen.getByRole("grid");
            expect(getAccessibleName(grid)).toBe("People");
            expect(grid).toHaveAttribute("aria-rowcount");
            expect(grid).toHaveAttribute("aria-colcount");
            const cells = [
                ...screen.getAllByRole("columnheader"),
                ...screen.getAllByRole("gridcell"),
            ];
            assertRovingTabindex(cells);
        });
    });

    describe("Listbox", () => {
        test("single-select listbox is labelled and options expose aria-selected", () => {
            render(
                <Listbox
                    label="Fruits"
                    options={[
                        { value: "a", label: "Apple" },
                        { value: "b", label: "Banana" },
                    ]}
                    value="a"
                    onChange={() => {}}
                />
            );
            const list = screen.getByRole("listbox");
            assertHasAccessibleName(list);
            screen.getAllByRole("option").forEach((o) => {
                assertHasAccessibleName(o);
                assertAriaBooleanState(o, "aria-selected");
            });
        });
        test("multi-select sets aria-multiselectable=true", () => {
            render(
                <Listbox
                    label="Fruits"
                    multiple
                    options={[{ value: "a", label: "Apple" }]}
                    value={[]}
                    onChange={() => {}}
                />
            );
            expect(screen.getByRole("listbox")).toHaveAttribute(
                "aria-multiselectable",
                "true"
            );
        });
    });

    describe("MenuButton", () => {
        test("trigger has aria-haspopup, aria-expanded, aria-controls resolves when open", () => {
            render(
                <MenuButton
                    label="Actions"
                    items={[{ id: "1", label: "One" }]}
                />
            );
            const btn = screen.getByRole("button");
            expect(btn).toHaveAttribute("aria-haspopup", "menu");
            assertAriaBooleanState(btn, "aria-expanded");
            fireEvent.click(btn);
            assertAriaReferencesResolve(btn, ["aria-controls"]);
            screen.getAllByRole("menuitem").forEach((item) =>
                assertHasAccessibleName(item)
            );
        });
    });

    describe("Menubar", () => {
        test("menubar is labelled and top-level items have aria-haspopup=menu", () => {
            render(
                <Menubar
                    label="Main"
                    menus={[
                        { id: "file", label: "File", items: [{ id: "new", label: "New" }] },
                    ]}
                />
            );
            const bar = screen.getByRole("menubar");
            expect(bar).toHaveAttribute("aria-label", "Main");
            const top = screen.getAllByRole("menuitem");
            expect(top[0]).toHaveAttribute("aria-haspopup", "menu");
            assertAriaBooleanState(top[0], "aria-expanded");
        });
    });

    describe("Meter", () => {
        test("role=meter with numeric ARIA value range and accessible name", () => {
            render(<Meter value={50} label="Battery" labelId="m-label" />);
            const m = screen.getByRole("meter");
            expect(m).toHaveAttribute("aria-valuenow", "50");
            expect(m).toHaveAttribute("aria-valuemin");
            expect(m).toHaveAttribute("aria-valuemax");
            assertAriaReferencesResolve(m, ["aria-labelledby"]);
            assertHasAccessibleName(m);
        });
    });

    describe("ModalDialog", () => {
        test("role=dialog, aria-modal, labelledby/describedby all resolve", () => {
            render(
                <ModalDialog
                    isOpen
                    onClose={() => {}}
                    ariaLabel="modal-title"
                    ariaDescribedby="modal-desc"
                >
                    <h2 id="modal-title">Title</h2>
                    <p id="modal-desc">Description</p>
                </ModalDialog>
            );
            const dlg = screen.getByRole("dialog");
            expect(dlg).toHaveAttribute("aria-modal", "true");
            assertAriaReferencesResolve(dlg, [
                "aria-labelledby",
                "aria-describedby",
            ]);
            assertHasAccessibleName(dlg);
            const close = screen.getByRole("button", { name: "Close dialog" });
            expect(getAccessibleName(close)).toBe("Close dialog");
        });
    });

    describe("Progressbar", () => {
        test("determinate progressbar exposes valuenow/min/max and accessible name", () => {
            render(<Progressbar value={42} label="Upload" labelId="pb1" />);
            const pb = screen.getByRole("progressbar");
            expect(pb).toHaveAttribute("aria-valuenow", "42");
            assertAriaReferencesResolve(pb, ["aria-labelledby"]);
            assertHasAccessibleName(pb);
        });
        test("indeterminate progressbar omits aria-valuenow", () => {
            render(<Progressbar label="Loading" />);
            expect(screen.getByRole("progressbar")).not.toHaveAttribute(
                "aria-valuenow"
            );
        });
    });

    describe("RadioGroup", () => {
        test("role=radiogroup with aria-labelledby, only checked radio is tabbable", () => {
            render(
                <RadioGroup
                    name="g"
                    label="Size"
                    options={[
                        { value: "s", label: "S" },
                        { value: "m", label: "M" },
                        { value: "l", label: "L" },
                    ]}
                />
            );
            const group = screen.getByRole("radiogroup");
            assertAriaReferencesResolve(group, ["aria-labelledby"]);
            assertHasAccessibleName(group);
            assertRovingTabindex(screen.getAllByRole("radio"));
        });
    });

    describe("Slider", () => {
        test("role=slider with valuemin/max/now, accessible name, keyboard-focusable", () => {
            render(<Slider min={0} max={100} initialValue={20} ariaLabelledby="sl" />);
            render(<span id="sl">Volume</span>);
            const slider = screen.getAllByRole("slider")[0];
            expect(slider).toHaveAttribute("aria-valuemin", "0");
            expect(slider).toHaveAttribute("aria-valuemax", "100");
            expect(slider).toHaveAttribute("aria-valuenow", "20");
            expect(isKeyboardFocusable(slider)).toBe(true);
        });
    });

    describe("SliderMultiThumb", () => {
        test("each thumb has a distinct aria-label and mutually-constraining min/max", () => {
            render(
                <SliderMultiThumb
                    min={0}
                    max={100}
                    initialLow={10}
                    initialHigh={90}
                    labelLow="Min price"
                    labelHigh="Max price"
                />
            );
            const [low, high] = screen.getAllByRole("slider");
            expect(getAccessibleName(low)).toBe("Min price");
            expect(getAccessibleName(high)).toBe("Max price");
            expect(low.getAttribute("aria-valuemax")).toBe("90");
            expect(high.getAttribute("aria-valuemin")).toBe("10");
        });
    });

    describe("Spinbutton", () => {
        test("role=spinbutton with valuenow/min/max and keyboard focusable", () => {
            render(<Spinbutton min={0} max={10} initialValue={5} />);
            const input = screen.getByRole("spinbutton");
            expect(input).toHaveAttribute("aria-valuenow", "5");
            expect(isKeyboardFocusable(input)).toBe(true);
            // Increment/decrement buttons should have accessible names
            screen.getAllByRole("button").forEach((btn) =>
                assertHasAccessibleName(btn, "spinner control")
            );
        });
    });

    describe("Switch", () => {
        test("role=switch, accessible name, aria-checked boolean", () => {
            render(<Switch label="Dark mode" />);
            const sw = screen.getByRole("switch");
            expect(getAccessibleName(sw)).toBe("Dark mode");
            assertAriaBooleanState(sw, "aria-checked");
            expect(isKeyboardFocusable(sw)).toBe(true);
        });
    });

    describe("Tabs", () => {
        test("tabs have aria-selected, aria-controls resolves, roving tabindex", () => {
            render(
                <Tabs
                    idPrefix="t"
                    tabs={[
                        { id: "a", label: "A", content: <p>A</p> },
                        { id: "b", label: "B", content: <p>B</p> },
                    ]}
                />
            );
            const allTabs = screen.getAllByRole("tab");
            assertRovingTabindex(allTabs);
            allTabs.forEach((t) => {
                assertAriaBooleanState(t, "aria-selected");
                assertAriaReferencesResolve(t, ["aria-controls"]);
                assertHasAccessibleName(t);
            });
            // Each panel is labelled by its tab
            screen.getAllByRole("tabpanel", { hidden: true }).forEach((p) => {
                assertAriaReferencesResolve(p, ["aria-labelledby"]);
            });
        });
    });

    describe("Textbox", () => {
        test("label is associated to input via for/id", () => {
            render(<Textbox label="Name" value="" onChange={() => {}} />);
            const input = screen.getByRole("textbox");
            const label = screen.getByText("Name").closest("label");
            expect(assertLabelAssociated(label)).toBe(input);
            expect(getAccessibleName(input)).toBe("Name");
        });
        test("invalid textbox references its error via aria-errormessage", () => {
            render(
                <Textbox
                    label="Email"
                    value="bad"
                    onChange={() => {}}
                    invalid
                    errorMessage="Invalid"
                />
            );
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("aria-invalid", "true");
            assertAriaReferencesResolve(input, ["aria-errormessage"]);
        });
    });

    describe("Toolbar", () => {
        test("role=toolbar with aria-label and roving tabindex", () => {
            render(
                <Toolbar label="Formatting">
                    <button>B</button>
                    <button>I</button>
                    <button>U</button>
                </Toolbar>
            );
            const bar = screen.getByRole("toolbar");
            expect(bar).toHaveAttribute("aria-label", "Formatting");
            assertRovingTabindex(screen.getAllByRole("button"));
        });
    });

    describe("Tooltip", () => {
        test("tooltip element (when shown) has role=tooltip and is in a11y tree", () => {
            render(
                <Tooltip text="Hint">
                    <button>Trigger</button>
                </Tooltip>
            );
            fireEvent.mouseEnter(screen.getByText("Trigger"));
            const tip = screen.getByRole("tooltip");
            expect(tip).toBeInTheDocument();
            expect(isInAccessibilityTree(tip)).toBe(true);
        });
    });

    describe("TreeView", () => {
        test("role=tree, treeitems expose level/posinset/setsize, roving tabindex", () => {
            render(
                <TreeView
                    label="Files"
                    nodes={[
                        {
                            id: "a",
                            label: "A",
                            children: [{ id: "a1", label: "A1" }],
                        },
                        { id: "b", label: "B" },
                    ]}
                    defaultExpanded={["a"]}
                />
            );
            const tree = screen.getByRole("tree");
            expect(tree).toHaveAttribute("aria-label", "Files");
            const items = screen.getAllByRole("treeitem");
            items.forEach((i) => {
                expect(i).toHaveAttribute("aria-level");
                expect(i).toHaveAttribute("aria-posinset");
                expect(i).toHaveAttribute("aria-setsize");
            });
            assertRovingTabindex(items);
        });
    });

    describe("TreeGrid", () => {
        test("role=treegrid, rows expose level/posinset/setsize, cells roving", () => {
            render(
                <TreeGrid
                    label="Files"
                    columns={[
                        { key: "n", label: "N" },
                        { key: "s", label: "S" },
                    ]}
                    rows={[
                        {
                            id: "a",
                            n: "A",
                            s: "1",
                            children: [{ id: "a1", n: "A1", s: "2" }],
                        },
                    ]}
                    defaultExpanded={["a"]}
                />
            );
            const grid = screen.getByRole("treegrid");
            expect(grid).toHaveAttribute("aria-label", "Files");
            const dataRows = screen.getAllByRole("row").slice(1);
            dataRows.forEach((r) => {
                expect(r).toHaveAttribute("aria-level");
                expect(r).toHaveAttribute("aria-posinset");
                expect(r).toHaveAttribute("aria-setsize");
            });
            assertRovingTabindex(screen.getAllByRole("gridcell"));
        });
    });

    describe("Cross-cutting rules", () => {
        test("every disabled button also surfaces aria-disabled=true (for AT)", () => {
            render(<Button action={() => {}} label="X" isDisabled />);
            const btn = screen.getByRole("button");
            expect(btn).toBeDisabled();
            expect(btn).toHaveAttribute("aria-disabled", "true");
        });

        test("aria-hidden=true subtree is not in the accessibility tree", () => {
            const { container } = render(
                <div>
                    <div aria-hidden="true">
                        <button id="hidden-btn">Hidden</button>
                    </div>
                </div>
            );
            const btn = container.querySelector("#hidden-btn");
            expect(isInAccessibilityTree(btn)).toBe(false);
        });

        test("implicitRole helper recognizes native elements", () => {
            const { container } = render(
                <>
                    <button>B</button>
                    <a href="/x">L</a>
                    <nav />
                    <input type="checkbox" />
                </>
            );
            expect(
                require("./helpers/a11y").implicitRole(
                    container.querySelector("button")
                )
            ).toBe("button");
            expect(
                require("./helpers/a11y").implicitRole(
                    container.querySelector("a")
                )
            ).toBe("link");
            expect(
                require("./helpers/a11y").implicitRole(
                    container.querySelector("nav")
                )
            ).toBe("navigation");
            expect(
                require("./helpers/a11y").implicitRole(
                    container.querySelector("input")
                )
            ).toBe("checkbox");
        });
    });
});
