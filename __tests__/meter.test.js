import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Meter from "../components/Meter/Meter";

/**
 * APG pattern: Meter
 * https://www.w3.org/WAI/ARIA/apg/patterns/meter/
 *
 * Key requirements:
 *   - Element has role="meter".
 *   - aria-valuenow is set to the current value.
 *   - aria-valuemin and aria-valuemax describe the value range.
 *   - When the numeric value is not user-friendly, aria-valuetext provides text.
 *   - Meter has an accessible name (label or aria-labelledby).
 *   - Meter is NOT focusable (it is a non-interactive display widget).
 */
describe("Meter Component (APG meter pattern)", () => {
    test("has role=meter", () => {
        render(<Meter value={50} label="Disk usage" />);
        expect(screen.getByRole("meter")).toBeInTheDocument();
    });

    test("reports aria-valuenow matching the supplied value", () => {
        render(<Meter value={72} label="Battery" />);
        expect(screen.getByRole("meter")).toHaveAttribute(
            "aria-valuenow",
            "72"
        );
    });

    test("exposes the range via aria-valuemin / aria-valuemax", () => {
        render(<Meter value={5} minValue={0} maxValue={10} label="Score" />);
        const meter = screen.getByRole("meter");
        expect(meter).toHaveAttribute("aria-valuemin", "0");
        expect(meter).toHaveAttribute("aria-valuemax", "10");
    });

    test("defaults min/max to 0..100 when not supplied", () => {
        render(<Meter value={30} label="Progress" />);
        const meter = screen.getByRole("meter");
        expect(meter).toHaveAttribute("aria-valuemin", "0");
        expect(meter).toHaveAttribute("aria-valuemax", "100");
    });

    test("uses userFriendlyText for aria-valuetext when provided", () => {
        const friendly = (v) => `${v} percent full`;
        render(
            <Meter value={65} label="Disk" userFriendlyText={friendly} />
        );
        expect(screen.getByRole("meter")).toHaveAttribute(
            "aria-valuetext",
            "65 percent full"
        );
    });

    test("associates an accessible name via aria-labelledby", () => {
        render(<Meter value={10} label="Fuel" labelId="fuel-label" />);
        const meter = screen.getByRole("meter");
        expect(meter).toHaveAttribute("aria-labelledby", "fuel-label");
        expect(document.getElementById("fuel-label")).toHaveTextContent("Fuel");
    });

    test("is not keyboard focusable (non-interactive)", () => {
        render(<Meter value={50} label="X" />);
        const meter = screen.getByRole("meter");
        expect(meter).not.toHaveAttribute("tabindex");
    });

    test("renders a visual fill bar whose width reflects the value", () => {
        const { container } = render(
            <Meter value={40} minValue={0} maxValue={100} label="X" />
        );
        const fill = container.querySelector(".meter-fill");
        expect(fill).toBeInTheDocument();
        expect(fill.style.width).toBe("40%");
    });
});
