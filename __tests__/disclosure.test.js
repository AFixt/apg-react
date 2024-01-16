import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Disclosure from "../components/Disclosure/Disclosure";

describe("Disclosure Component", () => {
    const title = "Disclosure Title";
    const content = "Disclosure Content";

    test("Toggling the Visibility of Content with Keyboard", () => {

        const { asFragment } = render(<Disclosure title={title}>{content}</Disclosure>);

        // Snapshot before interaction
        expect(asFragment()).toMatchSnapshot();

        // Adjust the query to include the visual indicator
        const button = screen.getByRole("button", {
            name: /Disclosure Title ▼/,
        });
        expect(screen.queryByText(content)).not.toBeInTheDocument();

        fireEvent.keyDown(button, { key: "Enter" });
        expect(screen.getByText(content)).toBeInTheDocument();

        // Snapshot after opening
        expect(asFragment()).toMatchSnapshot();

        fireEvent.keyDown(button, { key: "Enter" });
        expect(screen.queryByText(content)).not.toBeInTheDocument();

        // Snapshot after closing
        expect(asFragment()).toMatchSnapshot();
    });

    test("Accessibility Features of the Disclosure Control", () => {
        const { asFragment } = render(<Disclosure title={title}>{content}</Disclosure>);
        expect(asFragment()).toMatchSnapshot();

        const button = screen.getByRole("button", {
            name: /Disclosure Title ▼/,
        });
        expect(button).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(button);
        expect(button).toHaveAttribute("aria-expanded", "true");
    });

    test("Visual Indicators for Content Visibility", () => {
        render(<Disclosure title={title}>{content}</Disclosure>);

        const button = screen.getByRole("button", {
            name: /Disclosure Title ▼/,
        });
        const indicator = screen.getByText(/▼/); // Indicator when content is hidden

        fireEvent.click(button);
        expect(screen.getByText(/▲/)).toBeInTheDocument(); // Indicator when content is visible
    });
});
