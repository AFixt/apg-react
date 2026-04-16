import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react";
import Spinbutton from "../components/Spinbutton/Spinbutton"; // adjust the import path as necessary

const setup = (props = {}) => {
    const utils = render(<Spinbutton {...props} />);
    const input = utils.getByRole("spinbutton");
    return {
        input,
        ...utils,
    };
};

describe("Spinbutton - Snapshot Tests", () => {
    test("renders correctly with default props", () => {
        const component = renderer.create(<Spinbutton min={0} max={10} />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("renders correctly with all props", () => {
        const component = renderer.create(
            <Spinbutton
                min={0}
                max={10}
                step={1}
                initialValue={5}
                ariaLabelledby="label-id"
            />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Spinbutton - Keyboard Interactions", () => {
    test("increments value on Up Arrow press", () => {
        const { input } = setup({ min: 0, max: 10, initialValue: 5 });
        fireEvent.keyDown(input, { key: "ArrowUp" });
        expect(input).toHaveValue("6");
    });

    test("decrements value on Down Arrow press", () => {
        const { input } = setup({ min: 0, max: 10, initialValue: 5 });
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input).toHaveValue("4");
    });
});

describe("Spinbutton - Direct Editing", () => {
    test("changes value on valid input", () => {
        const { input } = setup({ min: 0, max: 10 });
        fireEvent.change(input, { target: { value: "7" } });
        expect(input).toHaveValue("7");
    });

    test("ignores invalid characters", () => {
        const { input } = setup({ min: 0, max: 10 });
        fireEvent.change(input, { target: { value: "abc" } });
        expect(input).toHaveValue("0"); // assuming the default behavior is to reset to min or 0
    });
});

describe("Spinbutton - Accessibility Features", () => {
    test("has appropriate ARIA attributes", () => {
        const { input } = setup({
            min: 0,
            max: 10,
            initialValue: 5,
            ariaLabelledby: "label-id",
        });
        expect(input).toHaveAttribute("role", "spinbutton");
        expect(input).toHaveAttribute("aria-valuenow", "5");
        expect(input).toHaveAttribute("aria-valuemin", "0");
        expect(input).toHaveAttribute("aria-valuemax", "10");
        expect(input).toHaveAttribute("aria-labelledby", "label-id");
    });

    test("sets aria-invalid to true for invalid values", () => {
        const { input } = setup({ min: 0, max: 10 });
        fireEvent.change(input, { target: { value: "11" } });
        expect(input).toHaveAttribute("aria-invalid", "true");
    });
});

describe("Spinbutton - Invalid Input Handling", () => {
    test("indicates invalid value outside range", () => {
        const { input } = setup({ min: 0, max: 10 });
        fireEvent.change(input, { target: { value: "15" } });
        expect(input).toHaveAttribute("aria-invalid", "true");
    });
});
