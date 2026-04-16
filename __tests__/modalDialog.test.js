import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalDialog from "../components/ModalDialog/ModalDialog";

/**
 * APG pattern: Dialog (Modal)
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Key requirements:
 *   - Dialog has role="dialog".
 *   - Dialog has aria-modal="true".
 *   - Dialog is labelled via aria-labelledby (or aria-label).
 *   - Dialog is described via aria-describedby when supplementary content exists.
 *   - Dialog receives focus when opened.
 *   - Escape key closes the dialog.
 *   - Dialog is removed from the DOM when closed.
 */

const DialogHarness = ({ initialOpen = false, ...rest }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Open modal
            </button>
            <ModalDialog
                {...rest}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <h2 id="modal-title">Dialog title</h2>
                <p id="modal-desc">Dialog description</p>
            </ModalDialog>
        </>
    );
};

describe("ModalDialog Component (APG modal dialog pattern)", () => {
    test("is not rendered when closed", () => {
        render(<DialogHarness ariaLabel="modal-title" />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("renders with role=dialog and aria-modal=true when open", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    test("is labelled via aria-labelledby", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
        expect(document.getElementById("modal-title")).toHaveTextContent(
            "Dialog title"
        );
    });

    test("is described via aria-describedby when supplied", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-describedby", "modal-desc");
    });

    test("receives focus when opened", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveFocus();
    });

    test("Escape key closes the dialog", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        const dialog = screen.getByRole("dialog");
        fireEvent.keyDown(dialog, { key: "Escape" });
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("clicking the close button closes the dialog", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        fireEvent.click(screen.getByLabelText("Close dialog"));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("close button has an accessible name", () => {
        render(
            <DialogHarness
                initialOpen
                ariaLabel="modal-title"
                ariaDescribedby="modal-desc"
            />
        );
        expect(
            screen.getByRole("button", { name: "Close dialog" })
        ).toBeInTheDocument();
    });

    test("opening from a trigger places the dialog in the DOM", () => {
        render(<DialogHarness ariaLabel="modal-title" />);
        fireEvent.click(screen.getByText("Open modal"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
});
