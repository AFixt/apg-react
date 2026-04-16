import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkbox from "../components/Checkbox/Checkbox";

/**
 * APG pattern: Checkbox (dual & tri-state)
 * https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */

const Harness = ({ initial = false, isTriState = false, ...rest }) => {
    const [checked, setChecked] = useState(initial);
    return (
        <Checkbox
            label="Accept"
            checked={checked}
            onChange={setChecked}
            isTriState={isTriState}
            {...rest}
        />
    );
};

describe("Checkbox Component (APG checkbox pattern)", () => {
    describe("Dual-state", () => {
        test("role=checkbox and initial unchecked state", () => {
            render(<Harness />);
            const cb = screen.getByRole("checkbox");
            expect(cb).toBeInTheDocument();
            expect(cb).not.toBeChecked();
        });

        test("click toggles state", () => {
            render(<Harness />);
            const cb = screen.getByRole("checkbox");
            fireEvent.click(cb);
            expect(cb).toBeChecked();
            fireEvent.click(cb);
            expect(cb).not.toBeChecked();
        });

        test("Space key toggles state", () => {
            render(<Harness />);
            const cb = screen.getByRole("checkbox");
            fireEvent.keyDown(cb, { key: " " });
            expect(cb).toBeChecked();
        });

        test("invokes onChange with new boolean value", () => {
            const onChange = jest.fn();
            render(
                <Checkbox label="X" checked={false} onChange={onChange} />
            );
            fireEvent.click(screen.getByRole("checkbox"));
            expect(onChange).toHaveBeenCalledWith(true);
        });

        test("associates its label via htmlFor", () => {
            render(<Harness />);
            const cb = screen.getByRole("checkbox");
            const label = screen.getByText("Accept");
            expect(label).toHaveAttribute("for", cb.id);
        });
    });

    describe("Tri-state (mixed)", () => {
        test("checked=null renders aria-checked=mixed and indeterminate DOM prop", () => {
            render(<Harness isTriState initial={null} />);
            const cb = screen.getByRole("checkbox");
            expect(cb).toHaveAttribute("aria-checked", "mixed");
            expect(cb.indeterminate).toBe(true);
        });

        test("click from mixed advances to true", () => {
            const onChange = jest.fn();
            render(
                <Checkbox
                    label="All"
                    checked={null}
                    onChange={onChange}
                    isTriState
                />
            );
            fireEvent.click(screen.getByRole("checkbox"));
            expect(onChange).toHaveBeenCalledWith(true);
        });

        test("Space from mixed advances to true", () => {
            const onChange = jest.fn();
            render(
                <Checkbox
                    label="All"
                    checked={null}
                    onChange={onChange}
                    isTriState
                />
            );
            fireEvent.keyDown(screen.getByRole("checkbox"), { key: " " });
            expect(onChange).toHaveBeenCalledWith(true);
        });

        test("true → false → null cycle via tri-state logic", () => {
            const onChange = jest.fn();
            const { rerender } = render(
                <Checkbox
                    label="All"
                    checked={true}
                    onChange={onChange}
                    isTriState
                />
            );
            fireEvent.click(screen.getByRole("checkbox"));
            expect(onChange).toHaveBeenLastCalledWith(false);

            rerender(
                <Checkbox
                    label="All"
                    checked={false}
                    onChange={onChange}
                    isTriState
                />
            );
            fireEvent.click(screen.getByRole("checkbox"));
            expect(onChange).toHaveBeenLastCalledWith(null);
        });

        test("updating checked prop to null turns indeterminate back on", () => {
            const { rerender } = render(
                <Checkbox label="Accept" checked={true} onChange={() => {}} isTriState />
            );
            expect(screen.getByRole("checkbox").indeterminate).toBe(false);

            rerender(
                <Checkbox label="Accept" checked={null} onChange={() => {}} isTriState />
            );
            expect(screen.getByRole("checkbox").indeterminate).toBe(true);
        });
    });

    test("matches the snapshot", () => {
        const { asFragment } = render(<Harness />);
        expect(asFragment()).toMatchSnapshot();
    });
});
