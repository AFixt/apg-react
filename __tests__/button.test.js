import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../components/Button/Button";

describe("Button Component", () => {
    const label = "Test Button";
    const mockAction = jest.fn();

    beforeEach(() => {
        mockAction.mockReset();
    });

    afterEach(cleanup);

    test("Activating a Button", () => {
        render(<Button action={mockAction} label={label} />);
        const button = screen.getByRole("button", { name: label });

        fireEvent.keyDown(button, { key: "Enter" });
        expect(mockAction).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(button, { key: " " });
        expect(mockAction).toHaveBeenCalledTimes(2);
    });

    test("Using a Toggle Button", () => {
        render(
            <Button
                action={mockAction}
                label={label}
                isToggleButton={true}
                toggleState={false}
            />
        );
        const toggleButton = screen.getByRole("button", { name: label });

        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute("aria-pressed", "true");

        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    });

    test("Using a Menu Button", () => {
        render(<Button action={mockAction} label="Menu" />);
        const menuButton = screen.getByRole("button", { name: "Menu" });

        expect(menuButton).toHaveAttribute("aria-haspopup", "menu");
    });

    test("Button Accessibility", () => {
        render(
            <Button
                action={mockAction}
                label={label}
                isDisabled={true}
                ariaDescribedby="descId"
            />
        );
        const button = screen.getByRole("button", { name: label });

        expect(button).toHaveAttribute("aria-disabled", "true");
        expect(button).toHaveAttribute("aria-describedby", "descId");
    });

    test("Activating a Button with Shortcut Key", () => {
        render(<Button action={mockAction} label={label} shortcutKey="k" />);
        const button = screen.getByRole("button", { name: label });

        fireEvent.keyDown(window, { key: "k" });
        expect(mockAction).toHaveBeenCalledTimes(1);
    });
});
