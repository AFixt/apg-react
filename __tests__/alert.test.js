import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alert from "../components/Alert/Alert";

describe("Alert Component", () => {
    const message = "This is a test alert";
    const type = "info";

    test("Alert Role and Accessibility", () => {
        render(<Alert message={message} type={type} />);
        const alert = screen.getByRole("alert");

        expect(alert).toBeInTheDocument();
        expect(alert).toHaveAttribute("aria-live", "assertive");
        expect(alert).toHaveTextContent(message);
    });

    test("Alert Appearance and Behavior", () => {
        render(<Alert message={message} type={type} />);
        const alert = screen.getByRole("alert");
        const dismissButton = screen.getByText("Dismiss");

        expect(alert).toBeVisible();
        fireEvent.click(dismissButton);
        expect(alert).not.toBeInTheDocument();
    });

    test("Alert Content and Importance", () => {
        render(<Alert message={message} type={type} />);
        const alert = screen.getByRole("alert");

        expect(alert).toHaveTextContent(message);
    });

    test("Alert Design Considerations", () => {
        const { container } = render(<Alert message={message} type={type} />);
        const alert = container.querySelector(`.alert-${type}`);

        expect(alert).toBeInTheDocument();
    });

    test("Alert on Page Load", () => {
        render(<Alert message={message} type={type} />);
        const alert = screen.getByRole("alert");

        expect(alert).toBeInTheDocument();
    });
});
