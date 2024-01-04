import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkbox from "../components/Checkbox/Checkbox";

describe("Checkbox Component", () => {
    test("Interacting with a Dual-State Checkbox", () => {
        let checked = false;
        const handleChange = jest.fn((newChecked) => (checked = newChecked));
        const { rerender } = render(
            <Checkbox
                label="Dual-State Checkbox"
                checked={checked}
                onChange={handleChange}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.keyDown(checkbox, { key: " " });
        expect(handleChange).toHaveBeenCalledWith(true);

        rerender(
            <Checkbox
                label="Dual-State Checkbox"
                checked={checked}
                onChange={handleChange}
            />
        );
        fireEvent.keyDown(checkbox, { key: " " });
        expect(handleChange).toHaveBeenCalledWith(false);
    });
});
