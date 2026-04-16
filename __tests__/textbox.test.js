import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Textbox from "../components/Textbox/Textbox";

const Harness = (props) => {
    const [value, setValue] = useState(props.initialValue ?? "");
    return <Textbox {...props} value={value} onChange={setValue} />;
};

describe("Textbox Component (role=textbox)", () => {
    test("single-line renders with role=textbox and associates its label", () => {
        render(<Harness label="Name" />);
        const input = screen.getByRole("textbox", { name: "Name" });
        expect(input).toBeInTheDocument();
    });

    test("multiline sets aria-multiline=true", () => {
        render(<Harness label="Bio" multiline />);
        const area = screen.getByRole("textbox", { name: "Bio" });
        expect(area).toHaveAttribute("aria-multiline", "true");
    });

    test("required sets aria-required=true", () => {
        render(<Harness label="Username" required />);
        expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    test("readOnly sets aria-readonly=true", () => {
        render(<Harness label="ID" readOnly initialValue="abc" />);
        expect(screen.getByRole("textbox")).toHaveAttribute("aria-readonly", "true");
    });

    test("invalid surfaces aria-invalid and references an errormessage element", () => {
        render(
            <Harness
                label="Email"
                initialValue="x"
                invalid
                errorMessage="Bad email"
            />
        );
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("aria-invalid", "true");
        const errId = input.getAttribute("aria-errormessage");
        expect(errId).toBeTruthy();
        expect(document.getElementById(errId)).toHaveTextContent("Bad email");
    });

    test("helper text is referenced via aria-describedby", () => {
        render(<Harness label="Bio" helperText="Max 200 chars" />);
        const input = screen.getByRole("textbox");
        const describedBy = input.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy)).toHaveTextContent("Max 200 chars");
    });

    test("typing invokes onChange", () => {
        const onChange = jest.fn();
        render(<Textbox label="X" value="" onChange={onChange} />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "hi" } });
        expect(onChange).toHaveBeenCalledWith("hi", expect.anything());
    });
});
