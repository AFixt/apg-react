/**
 * To use the Disclosure component in a React application,
 * you should import it into the file where you want to use it.
 * This component allows users to toggle the visibility of
 * content associated with a specific title.
 *
 * The component requires two props:
 *   title: The text displayed on the disclosure button.
 *   children: The content that will be shown or hidden based on the toggle state.
 *
 * In this example, MyComponent includes two Disclosure components,
 * each with a different title and content. When you click on the
 * title of each Disclosure, it toggles the visibility of the
 * content beneath it. This pattern is commonly used for FAQs,
 * collapsible sections in a webpage, or to hide and show additional
 * information without overwhelming the user with content.
 */

import React from "react";
import Disclosure from "./Disclosure"; // Adjust the import path based on your project structure

function MyComponent() {
    return (
        <div>
            <h1>My React Component Using Disclosure</h1>
            {/* Usage of Disclosure component */}
            <Disclosure title="Click to View More">
                <p>
                    This is the content that gets shown or hidden when the
                    disclosure control is toggled. It can be any React node,
                    such as this paragraph.
                </p>
            </Disclosure>

            {/* Another Disclosure with different content */}
            <Disclosure title="More Information">
                <div>
                    <p>More detailed information can be placed here.</p>
                    <ul>
                        <li>Detail 1</li>
                        <li>Detail 2</li>
                        <li>Detail 3</li>
                    </ul>
                </div>
            </Disclosure>
        </div>
    );
}

export default MyComponent;
