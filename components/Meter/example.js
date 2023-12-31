/**
 * To use the Meter component in a React application,
 * you should import it into a component where you wish to
 * display a meter indicating a value within a specified range.
 * This component is particularly useful for visually
 * representing quantities like progress, capacity, or other measurements.
 *
 * The Meter component accepts several props:
 *   value: The current value of the meter.
 *   minValue (optional): The minimum value of the meter.
 *   maxValue (optional): The maximum value of the meter.
 *   label (optional): The label for the meter.
 *   labelId (optional): The ID of the label element.
 *   userFriendlyText (optional): A function that returns a user-friendly text representation of the value.
 *
 * In this example, MyComponent includes a Meter component that represents a battery level.
 * The value prop is set to 70, indicating the current battery level.
 * The minValue and maxValue props define the range of the meter from 0 to 100.
 * The label provides a textual description of what the meter represents,
 * and the userFriendlyText function is used to give a more
 * qualitative description of the value, like 'Low', 'Medium', or 'High',
 * based on the current value. This enhances the accessibility and user experience of the meter.
 */

import React from "react";
import Meter from "./Meter"; // Adjust the import path based on your project structure

function MyComponent() {
    const value = 70; // Example current value for the meter

    // Optional: A function to provide a user-friendly text representation of the value
    const getUserFriendlyText = (value) => {
        if (value < 30) return "Low";
        if (value < 70) return "Medium";
        return "High";
    };

    return (
        <div>
            <h1>Meter Example</h1>
            <Meter
                value={value}
                minValue={0}
                maxValue={100}
                label="Battery Level"
                userFriendlyText={getUserFriendlyText}
            />
        </div>
    );
}

export default MyComponent;
