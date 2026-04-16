import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Switch from "../components/Switch/Switch";

/**
 * APG pattern: Switch
 * https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * Contract:
 *   - role=switch
 *   - aria-checked reflects state
 *   - Space and Enter toggle
 *   - Click toggles
 *   - Keyboard focusable
 */
describe("Switch Component (APG switch pattern)", () => {
    const label = "Enable notifications";

    test("has role=switch", () => {
        render(<Switch label={label} />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    test("exposes visible label text", () => {
        render(<Switch label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    test("defaults to aria-checked=false", () => {
        render(<Switch label={label} />);
        expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    });

    test("respects initialChecked prop", () => {
        render(<Switch label={label} initialChecked />);
        expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    test("is keyboard focusable via tabindex=0", () => {
        render(<Switch label={label} />);
        expect(screen.getByRole("switch")).toHaveAttribute("tabindex", "0");
    });

    test("Space key toggles the state", () => {
        render(<Switch label={label} />);
        const sw = screen.getByRole("switch");
        fireEvent.keyDown(sw, { key: " " });
        expect(sw).toHaveAttribute("aria-checked", "true");
        fireEvent.keyDown(sw, { key: " " });
        expect(sw).toHaveAttribute("aria-checked", "false");
    });

    test("Enter key toggles the state", () => {
        render(<Switch label={label} />);
        const sw = screen.getByRole("switch");
        fireEvent.keyDown(sw, { key: "Enter" });
        expect(sw).toHaveAttribute("aria-checked", "true");
        fireEvent.keyDown(sw, { key: "Enter" });
        expect(sw).toHaveAttribute("aria-checked", "false");
    });

    test("click toggles the state", () => {
        render(<Switch label={label} />);
        const sw = screen.getByRole("switch");
        fireEvent.click(sw);
        expect(sw).toHaveAttribute("aria-checked", "true");
        fireEvent.click(sw);
        expect(sw).toHaveAttribute("aria-checked", "false");
    });

    test("forwards ariaLabelledby / ariaDescribedby", () => {
        render(
            <Switch
                label={label}
                ariaLabelledby="ext-label"
                ariaDescribedby="ext-desc"
            />
        );
        const sw = screen.getByRole("switch");
        expect(sw).toHaveAttribute("aria-labelledby", "ext-label");
        expect(sw).toHaveAttribute("aria-describedby", "ext-desc");
    });

    test("non-space/enter keys do not toggle", () => {
        render(<Switch label={label} />);
        const sw = screen.getByRole("switch");
        fireEvent.keyDown(sw, { key: "ArrowRight" });
        fireEvent.keyDown(sw, { key: "a" });
        expect(sw).toHaveAttribute("aria-checked", "false");
    });

    test("matches the snapshot", () => {
        const { asFragment } = render(<Switch label={label} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
