/**
 * To use this Button component in a React application,
 * you should import it into the file where you want to use it.
 *
 * The component accepts several props:
 *   action: A function to be executed when the button is clicked.
 *   label: The text displayed on the button.
 *   shortcutKey (optional): A key that acts as a shortcut for the button click.
 *   ariaDescribedby (optional): The ID of the element that describes the button.
 *   isDisabled (optional): A boolean indicating if the button should be disabled.
 *   isToggleButton (optional): A boolean to specify if the button is a toggle button.
 *   toggleState (optional): The initial state of the toggle button if it is a toggle button.
 *
 * In this example, MyComponent includes several Button
 * components with different configurations.
 *
 * The handleClick function logs a message to the console
 * and is passed to the buttons as the action prop.
 *
 * The toggle button changes its state when clicked,
 * and the last button can be activated with the 'b' key as a shortcut.
 */

import React from "react";
import Button from "./Button"; // Adjust the import path based on your project structure

function MyComponent() {
    const handleClick = () => {
        console.log("Button clicked");
    };

    return (
        <div>
            <h1>My React Component</h1>
            {/* Basic button usage */}
            <Button label="Click Me" action={handleClick} />

            {/* Toggle button usage */}
            <Button
                label="Toggle Me"
                action={() => console.log("Toggle button clicked")}
                isToggleButton={true}
                toggleState={false}
            />

            {/* Disabled button usage */}
            <Button
                label="Disabled Button"
                action={handleClick}
                isDisabled={true}
            />

            {/* Button with a keyboard shortcut */}
            <Button
                label="Shortcut Button"
                action={handleClick}
                shortcutKey="b"
            />
        </div>
    );
}

export default MyComponent;
