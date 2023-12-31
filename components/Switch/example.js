/**
 * To use the Switch component in a React application,
 * you need to import it into a component where you want
 * to display a toggle switch. This switch can be used
 * for settings that have an on/off or true/false state,
 * such as enabling or disabling features in an application.
 *
 * The Switch component accepts the following props:
 *   label: The label for the switch.
 *   ariaLabelledby: The ID of the element that labels the switch.
 *   ariaDescribedby: The ID of the element that describes the switch.
 *   initialChecked: The initial checked (on/off) state of the switch.
 *
 * In this example, MyComponent includes two Switch components.
 * The first one is for enabling or disabling a dark mode feature,
 * and the second one is for toggling notifications on or off.
 * The label prop provides the text displayed next to the switch,
 * and the ariaLabelledby prop associates the switch with the
 * corresponding label for accessibility. The initialChecked prop
 * determines whether the switch is on or off when the component first renders.
 *
 * Users can toggle each switch by clicking on it or by focusing on it
 * and pressing the space or enter key.
 * The switch's visual state will change to reflect its on or off status.
 */

import React from "react";
import Switch from "./Switch"; // Adjust the import path based on your project structure

function MyComponent() {
    return (
        <div>
            <h1>Settings</h1>
            <div>
                <label id="dark-mode-label">Dark Mode:</label>
                <Switch
                    label="Enable Dark Mode"
                    ariaLabelledby="dark-mode-label"
                    initialChecked={false}
                />
            </div>
            <div>
                <label id="notifications-label">Notifications:</label>
                <Switch
                    label="Enable Notifications"
                    ariaLabelledby="notifications-label"
                    initialChecked={true}
                />
            </div>
        </div>
    );
}

export default MyComponent;
