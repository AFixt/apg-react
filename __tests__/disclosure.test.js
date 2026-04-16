import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Disclosure from "../components/Disclosure/Disclosure";

/**
 * APG pattern: Disclosure
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Contract:
 *   - Trigger is a <button> with aria-expanded and aria-controls.
 *   - Enter and Space toggle content visibility.
 *   - Click toggles content visibility.
 */
describe("Disclosure Component (APG disclosure pattern)", () => {
    const title = "More details";
    const content = "Hidden content";

    const getButton = () =>
        screen.getByRole("button", { name: new RegExp(title) });

    test("button starts with aria-expanded=false", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        expect(getButton()).toHaveAttribute("aria-expanded", "false");
    });

    test("button references controlled content via aria-controls", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        const button = getButton();
        const controlledId = button.getAttribute("aria-controls");
        expect(controlledId).toBeTruthy();
        const panel = document.getElementById(controlledId);
        expect(panel).toHaveTextContent(content);
    });

    test("content is hidden initially", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        expect(
            screen.getByText(content).closest(".disclosure-content")
        ).toHaveClass("hidden");
    });

    test("click toggles aria-expanded and content visibility", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        const button = getButton();

        fireEvent.click(button);
        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(
            screen.getByText(content).closest(".disclosure-content")
        ).not.toHaveClass("hidden");

        fireEvent.click(button);
        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(
            screen.getByText(content).closest(".disclosure-content")
        ).toHaveClass("hidden");
    });

    test("Enter key toggles content", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        const button = getButton();
        fireEvent.keyDown(button, { key: "Enter" });
        expect(button).toHaveAttribute("aria-expanded", "true");
        fireEvent.keyDown(button, { key: "Enter" });
        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("visual indicator flips between ▼ and ▲", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        const button = getButton();
        expect(button).toHaveTextContent("▼");
        fireEvent.click(button);
        expect(button).toHaveTextContent("▲");
    });

    test("button is a real <button> (native keyboard semantics)", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);
        expect(getButton().tagName).toBe("BUTTON");
    });

    test("matches the snapshot (closed)", () => {
        const { asFragment } = render(
            <Disclosure title={title}>{content}</Disclosure>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
