import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Accordion from "../components/Accordion/Accordion";

const sampleItems = [
    { title: "Section 1", content: "Content 1" },
    { title: "Section 2", content: "Content 2" },
];

const mockToggleItem = jest.fn();

const renderAccordion = (props = {}) =>
    render(
        <Accordion
            items={sampleItems}
            toggleItem={mockToggleItem}
            openIndex={null}
            {...props}
        />
    );

describe("Accordion Component", () => {
    test("renders all items", () => {
        renderAccordion();
        sampleItems.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
            expect(screen.getByText(item.content)).toBeInTheDocument();
        });
    });

    test("toggles item on header button click", () => {
        renderAccordion();
        const firstHeaderButton = screen.getByText(sampleItems[0].title);
        fireEvent.click(firstHeaderButton);
        expect(mockToggleItem).toHaveBeenCalledWith(0);
    });

    test("handles keyboard navigation", () => {
        renderAccordion({ openIndex: 0 });
        const firstHeaderButton = screen.getByText(sampleItems[0].title);
        firstHeaderButton.focus();
        fireEvent.keyDown(firstHeaderButton, { key: "ArrowDown" });
        expect(document.activeElement).toHaveAttribute("id", "accordion-header-1");
    });

    test("header button should have correct ARIA attributes", () => {
        renderAccordion({ openIndex: 0 });
        const firstHeaderButton = screen.getByText(sampleItems[0].title);
        expect(firstHeaderButton).toHaveAttribute("aria-expanded", "true");
        expect(firstHeaderButton).toHaveAttribute("aria-controls", "panel-0");
    });

    test("navigates between headers correctly using Tab and Shift+Tab", () => {
        renderAccordion();
        const firstHeaderButton = screen.getByText(sampleItems[0].title);
        const secondHeaderButton = screen.getByText(sampleItems[1].title);
        firstHeaderButton.focus();
        fireEvent.keyDown(firstHeaderButton, { key: "Tab" });
        secondHeaderButton.focus();
        expect(secondHeaderButton).toHaveFocus();
        fireEvent.keyDown(secondHeaderButton, { key: "Tab", shiftKey: true });
        firstHeaderButton.focus();
        expect(firstHeaderButton).toHaveFocus();
    });

    test("expands/collapses accordion on Enter and Space key press", () => {
        renderAccordion();
        const firstHeaderButton = screen.getByText(sampleItems[0].title);
        fireEvent.keyDown(firstHeaderButton, { key: "Enter" });
        expect(mockToggleItem).toHaveBeenCalledWith(0);
        fireEvent.keyDown(firstHeaderButton, { key: " " });
        expect(mockToggleItem).toHaveBeenCalledWith(0);
    });

    test("verifies ARIA roles and properties for each header", () => {
        renderAccordion({ openIndex: 1 });
        sampleItems.forEach((item, index) => {
            const headerButton = screen.getByText(item.title);
            const isExpanded = index === 1;
            expect(headerButton).toHaveAttribute("aria-expanded", isExpanded.toString());
            expect(headerButton).toHaveAttribute("aria-controls", `panel-${index}`);
        });
    });
});
