/**
 * To use the Slider component in a React application,
 * you need to import it into the file where you want
 * to display a slider control. This component is
 * versatile, allowing customization for minimum and
 * maximum values, step increments, orientation, and more.
 *
 * It's particularly useful for settings that require a range selection,
 * like volume control, brightness adjustment, or selecting a value within a range.
 *
 * In this example, MyComponent includes two Slider components.
 * The first slider controls volume, with a minimum value of 0,
 *  a maximum of 100, and steps of 5. It has an initial value of
 * 50 and displays percentages as user-friendly values. The second
 * slider controls brightness, is vertical, and ranges from 0 to 100,
 * with an initial value of 70. Each slider has an associated label for accessibility.
 *
 * The getUserFriendlyValue function is provided to the volume slider
 * to display the value as a percentage. This function could be modified
 * or extended for more complex representations of the slider value.
 * The Slider component will handle user interactions like keyboard inputs for adjusting the value.
 */

import React from "react";
import Slider from "./Slider"; // Adjust the import path based on your project structure

function MyComponent() {
    // Example function for getting a user-friendly value
    const getUserFriendlyValue = (value) => {
        return `${value}%`;
    };

    return (
        <div>
            <h1>Adjust Settings</h1>
            <label id="volume-slider-label">Volume Control</label>
            <Slider
                min={0}
                max={100}
                step={5}
                initialValue={50}
                ariaLabelledby="volume-slider-label"
                getUserFriendlyValue={getUserFriendlyValue}
            />

            <label id="brightness-slider-label">Brightness</label>
            <Slider
                min={0}
                max={100}
                initialValue={70}
                ariaLabelledby="brightness-slider-label"
                isVertical={true}
            />
        </div>
    );
}

export default MyComponent;
