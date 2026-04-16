import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Progressbar from "../components/Progressbar/Progressbar";

describe("Progressbar Component (role=progressbar)", () => {
    test("has role=progressbar", () => {
        render(<Progressbar value={50} label="Loading" />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("exposes aria-valuenow / aria-valuemin / aria-valuemax", () => {
        render(<Progressbar value={42} min={0} max={100} label="X" />);
        const pb = screen.getByRole("progressbar");
        expect(pb).toHaveAttribute("aria-valuenow", "42");
        expect(pb).toHaveAttribute("aria-valuemin", "0");
        expect(pb).toHaveAttribute("aria-valuemax", "100");
    });

    test("respects custom min/max range", () => {
        render(<Progressbar value={5} min={0} max={10} label="X" />);
        const pb = screen.getByRole("progressbar");
        expect(pb).toHaveAttribute("aria-valuemin", "0");
        expect(pb).toHaveAttribute("aria-valuemax", "10");
        expect(pb).toHaveAttribute("aria-valuenow", "5");
    });

    test("aria-valuetext overrides numeric text when provided", () => {
        render(<Progressbar value={3} max={10} label="X" valueText="3 of 10" />);
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "aria-valuetext",
            "3 of 10"
        );
    });

    test("indeterminate progressbar omits aria-valuenow", () => {
        render(<Progressbar label="Loading" />);
        expect(screen.getByRole("progressbar")).not.toHaveAttribute(
            "aria-valuenow"
        );
    });

    test("has accessible label via aria-labelledby", () => {
        render(<Progressbar value={10} label="My task" labelId="pb-1" />);
        const pb = screen.getByRole("progressbar");
        expect(pb).toHaveAttribute("aria-labelledby", "pb-1");
        expect(document.getElementById("pb-1")).toHaveTextContent("My task");
    });
});
