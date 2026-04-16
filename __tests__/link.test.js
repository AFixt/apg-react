import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Link from "../components/Link/Link";

/**
 * APG pattern: Link
 * https://www.w3.org/WAI/ARIA/apg/patterns/link/
 *
 * Key requirements:
 *   - Element has role="link".
 *   - Element is keyboard focusable (tabindex="0" when non-native).
 *   - Enter key activates the link (invoking onClick when provided).
 *   - Visible label / accessible name is the link's content.
 */
describe("Link Component (APG link pattern)", () => {
    const renderLink = (props = {}, children = "Go home") =>
        render(
            <MemoryRouter>
                <Link to="/home" {...props}>
                    {children}
                </Link>
            </MemoryRouter>
        );

    test("has role=link", () => {
        renderLink();
        expect(screen.getByRole("link", { name: "Go home" })).toBeInTheDocument();
    });

    test("is keyboard focusable as a native link", () => {
        renderLink();
        const link = screen.getByRole("link", { name: "Go home" });
        // Native <a> with href is focusable without explicit tabindex
        expect(link.tagName).toBe("A");
    });

    test("Enter key triggers the onClick handler", () => {
        const onClick = jest.fn();
        renderLink({ onClick });
        const link = screen.getByRole("link", { name: "Go home" });
        fireEvent.keyDown(link, { key: "Enter" });
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("accessible name comes from link text content", () => {
        renderLink({}, "Read the docs");
        expect(screen.getByRole("link", { name: "Read the docs" })).toBeInTheDocument();
    });

    test("navigates to the configured href", () => {
        renderLink();
        const link = screen.getByRole("link", { name: "Go home" });
        expect(link).toHaveAttribute("href", "/home");
    });
});
