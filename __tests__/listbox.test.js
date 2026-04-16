import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Listbox from "../components/Listbox/Listbox";

/**
 * APG pattern: Listbox
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
const opts = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "c", label: "C" },
];

const Single = (props) => {
    const [value, setValue] = useState(props.initial ?? "a");
    return <Listbox options={opts} value={value} onChange={setValue} label="X" />;
};

const Multi = (props) => {
    const [value, setValue] = useState(props.initial ?? []);
    return (
        <Listbox
            options={opts}
            multiple
            value={value}
            onChange={setValue}
            label="X"
        />
    );
};

describe("Listbox Component (APG listbox pattern)", () => {
    test("container has role=listbox and is labelled", () => {
        render(<Single />);
        const list = screen.getByRole("listbox");
        expect(list).toHaveAttribute("aria-labelledby");
    });

    test("single-select: ArrowDown moves focus and selection", () => {
        render(<Single />);
        const options = screen.getAllByRole("option");
        options[0].focus();
        fireEvent.keyDown(options[0], { key: "ArrowDown" });
        expect(options[1]).toHaveFocus();
        expect(options[1]).toHaveAttribute("aria-selected", "true");
    });

    test("single-select: only one option is aria-selected", () => {
        render(<Single />);
        const options = screen.getAllByRole("option");
        fireEvent.keyDown(options[0], { key: "End" });
        const selected = options.filter(
            (o) => o.getAttribute("aria-selected") === "true"
        );
        expect(selected).toHaveLength(1);
    });

    test("multi-select: listbox has aria-multiselectable=true", () => {
        render(<Multi />);
        expect(screen.getByRole("listbox")).toHaveAttribute(
            "aria-multiselectable",
            "true"
        );
    });

    test("multi-select: ArrowDown does NOT change selection (focus only)", () => {
        render(<Multi />);
        const options = screen.getAllByRole("option");
        options[0].focus();
        fireEvent.keyDown(options[0], { key: "ArrowDown" });
        expect(options[1]).toHaveFocus();
        expect(options[1]).toHaveAttribute("aria-selected", "false");
    });

    test("multi-select: Space toggles selection of focused option", () => {
        render(<Multi />);
        const options = screen.getAllByRole("option");
        options[1].focus();
        fireEvent.keyDown(options[1], { key: " " });
        expect(options[1]).toHaveAttribute("aria-selected", "true");
        fireEvent.keyDown(options[1], { key: " " });
        expect(options[1]).toHaveAttribute("aria-selected", "false");
    });

    test("multi-select: Shift+ArrowDown extends selection", () => {
        render(<Multi />);
        const options = screen.getAllByRole("option");
        options[0].focus();
        fireEvent.keyDown(options[0], { key: "ArrowDown", shiftKey: true });
        expect(options[0]).toHaveAttribute("aria-selected", "true");
        expect(options[1]).toHaveAttribute("aria-selected", "true");
    });

    test("click selects in single mode", () => {
        render(<Single />);
        const options = screen.getAllByRole("option");
        fireEvent.click(options[2]);
        expect(options[2]).toHaveAttribute("aria-selected", "true");
    });
});
