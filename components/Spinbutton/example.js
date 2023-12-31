/**
 * To use the Spinbutton component in a React application,
 * you need to import it into the component where you want
 * to display a numeric input with increment and decrement
 * capabilities. This component is particularly useful for
 * inputs that require precise control over the values,
 * such as setting a quantity, choosing a date, or adjusting
 * settings within a specific range.
 *
 * The Spinbutton component accepts several props:
 *   min: The minimum value allowed.
 *   max: The maximum value allowed.
 *   step (optional): The increment or decrement step.
 *   ariaLabelledby (optional): The ID of the element that labels the spin button.
 *   initialValue (optional): The initial value of the spin button.
 *
 * In this example, MyComponent includes a Spinbutton for adjusting
 * a quantity. The minimum value is set to 0, the maximum to 100,
 * and the step increment is 1. The spin button starts with an initial
 * value of 10. A label with the ID "quantity-label" provides an
 * accessible name for the spin button, as referenced by the ariaLabelledby prop.
 *
 * Users can increase or decrease the value using the keyboard arrows,
 * or they can enter a number directly into the input field.
 * The spin button will ensure that the value stays within the specified range of 0 to 100.
 */

import React from "react";
import Spinbutton from "./Spinbutton"; // Adjust the import path based on your project structure

function MyComponent() {
    return (
        <div>
            <h1>Adjust Quantity</h1>
            <label id="quantity-label">Quantity:</label>
            <Spinbutton
                min={0}
                max={100}
                step={1}
                ariaLabelledby="quantity-label"
                initialValue={10}
            />
        </div>
    );
}

export default MyComponent;
