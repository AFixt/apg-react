import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Switch from "../components/Switch/Switch";

describe("Switch Component", () => {
    const label = "Test Switch";

    // Test for keyboard interactions
    describe("Toggling the State of the Switch with Keyboard", () => {

        // Optional Enter key press test
        it("toggles on Enter key press", () => {
            render(<Switch label={label} />);
            const switchElement = screen.getByRole("switch");
            fireEvent.keyPress(switchElement, { key: "Enter", keyCode: 13 });
            expect(switchElement).toHaveAttribute("aria-checked", "true");
        });
    });

    // Test for accessibility features
    describe("Accessibility Features of the Switch", () => {
        it("has the correct role and accessible label", () => {
            render(<Switch label={label} />);
            expect(screen.getByRole("switch")).toBeInTheDocument();
            expect(screen.getByText(label)).toBeInTheDocument();
        });

        it("changes aria-checked attribute based on state", () => {
            render(<Switch label={label} initialChecked />);
            const switchElement = screen.getByRole("switch");
            expect(switchElement).toHaveAttribute("aria-checked", "true");
        });
    });

    // Snapshot test
    it("matches the snapshot", () => {
        const { asFragment } = render(<Switch label={label} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
