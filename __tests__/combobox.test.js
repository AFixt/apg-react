import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Combobox from "../components/Combobox/Combobox";

/**
 * APG pattern: Combobox
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
const options = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana" },
    { value: "c", label: "Cherry" },
    { value: "d", label: "Date" },
];

const Harness = (props) => {
    const [value, setValue] = useState(props.initial ?? "");
    return (
        <Combobox
            options={options}
            value={value}
            onChange={setValue}
            label="Fruit"
            {...props}
        />
    );
};

describe("Combobox Component (APG combobox pattern)", () => {
    test("input has role=combobox and aria-autocomplete", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        expect(input).toHaveAttribute("aria-autocomplete", "list");
        expect(input).toHaveAttribute("aria-expanded", "false");
    });

    test("aria-controls references the listbox id", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        const listId = input.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
    });

    test("typing opens the popup and filters options (autocomplete=list)", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        fireEvent.change(input, { target: { value: "a" } });
        expect(input).toHaveAttribute("aria-expanded", "true");
        const opts = screen.getAllByRole("option");
        opts.forEach((o) => expect(o.textContent.toLowerCase()).toMatch(/a/));
    });

    test("ArrowDown opens popup when closed and sets aria-activedescendant", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        input.focus();
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input).toHaveAttribute("aria-expanded", "true");
        expect(input).toHaveAttribute("aria-activedescendant");
    });

    test("Enter on active option selects it and closes popup", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        fireEvent.change(input, { target: { value: "B" } });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(input).toHaveValue("Banana");
        expect(input).toHaveAttribute("aria-expanded", "false");
    });

    test("Escape closes the popup", () => {
        render(<Harness autocomplete="list" />);
        const input = screen.getByRole("combobox");
        fireEvent.change(input, { target: { value: "a" } });
        fireEvent.keyDown(input, { key: "Escape" });
        expect(input).toHaveAttribute("aria-expanded", "false");
    });

    test("autocomplete=none: focusing opens the full popup", () => {
        render(<Harness autocomplete="none" />);
        const input = screen.getByRole("combobox");
        fireEvent.focus(input);
        expect(input).toHaveAttribute("aria-expanded", "true");
        expect(screen.getAllByRole("option")).toHaveLength(options.length);
    });

    test("autocomplete value reflects the variant prop", () => {
        const { rerender } = render(<Harness autocomplete="none" />);
        expect(screen.getByRole("combobox")).toHaveAttribute(
            "aria-autocomplete",
            "none"
        );
        rerender(<Harness autocomplete="both" />);
        expect(screen.getByRole("combobox")).toHaveAttribute(
            "aria-autocomplete",
            "both"
        );
    });
});
