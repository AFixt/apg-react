import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Slider from "../components/Slider/Slider"; // Adjust the import path as necessary

describe("Slider Component", () => {
    // Snapshot Test
    it("renders correctly", () => {
        const { asFragment } = render(<Slider min={0} max={100} />);
        expect(asFragment()).toMatchSnapshot();
    });

    // Keyboard Interaction Tests
    it("increases value with right/up arrow keys", () => {
        render(<Slider min={0} max={10} />);
        const slider = screen.getByRole("slider");
        fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(slider).toHaveAttribute("aria-valuenow", "1");
        fireEvent.keyDown(slider, { key: "ArrowUp" });
        expect(slider).toHaveAttribute("aria-valuenow", "2");
    });

    describe("Keyboard Interactions", () => {
        const initialValue = 5;
        let slider;

        beforeEach(() => {
            render(
                <Slider min={0} max={10} initialValue={initialValue} step={1} />
            );
            slider = screen.getByRole("slider");
        });

        it("increases value with right arrow key", () => {
            fireEvent.keyDown(slider, { key: "ArrowRight" });
            expect(slider).toHaveAttribute(
                "aria-valuenow",
                String(initialValue + 1)
            );
        });

        it("increases value with up arrow key", () => {
            fireEvent.keyDown(slider, { key: "ArrowUp" });
            expect(slider).toHaveAttribute(
                "aria-valuenow",
                String(initialValue + 1)
            );
        });

        it("decreases value with left arrow key", () => {
            fireEvent.keyDown(slider, { key: "ArrowLeft" });
            expect(slider).toHaveAttribute(
                "aria-valuenow",
                String(initialValue - 1)
            );
        });

        it("decreases value with down arrow key", () => {
            fireEvent.keyDown(slider, { key: "ArrowDown" });
            expect(slider).toHaveAttribute(
                "aria-valuenow",
                String(initialValue - 1)
            );
        });

        it("sets value to minimum with home key", () => {
            fireEvent.keyDown(slider, { key: "Home" });
            expect(slider).toHaveAttribute("aria-valuenow", "0");
        });

        it("sets value to maximum with end key", () => {
            fireEvent.keyDown(slider, { key: "End" });
            expect(slider).toHaveAttribute("aria-valuenow", "10");
        });

        it("increases value by larger step with page up key", () => {
            fireEvent.keyDown(slider, { key: "PageUp" });
            expect(slider).toHaveAttribute("aria-valuenow", "10"); // Updated expected value
        });

        it("decreases value by larger step with page down key", () => {
            fireEvent.keyDown(slider, { key: "PageDown" });
            expect(slider).toHaveAttribute("aria-valuenow", "0"); // Updated expected value
        });
    });

    describe("Accessibility Features", () => {
        it("has the correct role", () => {
            render(<Slider min={0} max={100} />);
            const slider = screen.getByRole("slider");
            expect(slider).toBeInTheDocument();
        });

        it("has correct aria-valuenow attribute", () => {
            const initialValue = 50;
            render(<Slider min={0} max={100} initialValue={initialValue} />);
            const slider = screen.getByRole("slider");
            expect(slider).toHaveAttribute(
                "aria-valuenow",
                String(initialValue)
            );
        });

        it("has correct aria-valuemin and aria-valuemax attributes", () => {
            const min = 0;
            const max = 100;
            render(<Slider min={min} max={max} />);
            const slider = screen.getByRole("slider");
            expect(slider).toHaveAttribute("aria-valuemin", String(min));
            expect(slider).toHaveAttribute("aria-valuemax", String(max));
        });

        it("sets aria-valuetext when provided", () => {
            const getUserFriendlyValue = (value) => `Value is ${value}`;
            render(
                <Slider
                    min={0}
                    max={100}
                    getUserFriendlyValue={getUserFriendlyValue}
                />
            );
            const slider = screen.getByRole("slider");
            expect(slider).toHaveAttribute("aria-valuetext", "Value is 0");
        });

        it("has an accessible label", () => {
            render(<Slider min={0} max={100} ariaLabelledby="slider-label" />);
            const slider = screen.getByRole("slider");
            expect(slider).toHaveAttribute("aria-labelledby", "slider-label");
        });

        it("has aria-orientation set to vertical for vertical sliders", () => {
            render(<Slider min={0} max={100} isVertical={true} />);
            const slider = screen.getByRole("slider");
            expect(slider).toHaveAttribute("aria-orientation", "vertical");
        });

        it("does not have aria-orientation set for horizontal sliders", () => {
            render(<Slider min={0} max={100} isVertical={false} />);
            const slider = screen.getByRole("slider");
            expect(slider).not.toHaveAttribute("aria-orientation", "vertical");
        });
    });

    // User-Friendly Value Representation Test
    it("displays user-friendly value with aria-valuetext", () => {
        const getUserFriendlyValue = (value) => `Value: ${value}`;
        render(
            <Slider
                min={0}
                max={10}
                getUserFriendlyValue={getUserFriendlyValue}
            />
        );
        const slider = screen.getByRole("slider");
        expect(slider).toHaveAttribute("aria-valuetext", "Value: 0");
    });
});
