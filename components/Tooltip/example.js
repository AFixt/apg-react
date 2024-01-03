/**
 * To use the Tooltip component in a React application,
 * you need to import it into a component where you want
 * to display additional information as a tooltip.
 * The tooltip is typically used for providing extra context
 * or explanations for elements in the UI, appearing
 * when the user hovers over or focuses on the element.
 *
 * The Tooltip component accepts the following props:
 *   children: The content that the tooltip is associated with.
 *   text: The text to be displayed inside the tooltip.
 *   position (optional): The position of the tooltip relative
 *   to the content. It can be 'top', 'right', 'bottom', or 'left'.
 *
 * In this example, MyComponent includes two Tooltip components:
 *   The first tooltip is associated with a button. When the user hovers
 *   over or focuses on the button, the tooltip will appear to the right
 *   of the button (as specified by the position prop) and display the text
 *   "More information about this button".
 *   The second tooltip is associated with a paragraph of text. The
 *   tooltip appears at the default position ('top') when the paragraph
 *   is focused, displaying "Additional details here".
 *
 * The tooltips enhance the user experience by providing
 * additional context when interacting with UI elements.
 */

import React from "react";
import Tooltip from "./Tooltip"; // Adjust the import path based on your project structure

function MyComponent() {
    return (
        <div>
            <h1>My Interactive Component</h1>
            <Tooltip text="More information about this button" position="right">
                <button>Hover over me!</button>
            </Tooltip>
            <Tooltip text="Additional details here">
                <p tabIndex={0}>Focus on this text to see the tooltip</p>
            </Tooltip>
        </div>
    );
}

export default MyComponent;
