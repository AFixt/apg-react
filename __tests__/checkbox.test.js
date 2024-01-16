import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkbox from "../components/Checkbox/Checkbox";

describe("Checkbox Component", () => {
    test("Interacting with a Dual-State Checkbox", () => {
        let checked = false;
        const handleChange = jest.fn((newChecked) => (checked = newChecked));
        const { rerender, asFragment } = render(
            <Checkbox
                label="Dual-State Checkbox"
                checked={checked}
                onChange={handleChange}
            />
        );

        // Snapshot before interaction
        expect(asFragment()).toMatchSnapshot();

        const checkbox = screen.getByRole("checkbox");
        fireEvent.keyDown(checkbox, { key: " " });
        expect(handleChange).toHaveBeenCalledWith(true);

        // Rerender with updated state and take another snapshot
        rerender(
            <Checkbox
                label="Dual-State Checkbox"
                checked={true}
                onChange={handleChange}
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
