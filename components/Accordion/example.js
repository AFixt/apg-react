/**
 * To use the Accordion component in a React application,
 * you should first ensure that the items array, the toggleItem function,
 * and the openIndex state are correctly set up.
 *
 * The items array should contain objects with title and
 * content properties for each accordion item.
 *
 * The toggleItem function should change the openIndex
 * state to show or hide the accordion content,
 * and openIndex holds the index of the currently open accordion item.
 *
 * In this example, AccordionComponent uses an items array
 * to generate the accordion. The toggleItem function is
 * used to set which accordion item is open. When a header
 *  button is clicked or a key is pressed, the corresponding
 * accordion item will open or close, and the focus will move
 * appropriately if the arrow keys, Home, or End keys are used.
 *
 */

import React, { useState } from "react";

function AccordionComponent() {
    // Sample items for the accordion
    const items = [
        { title: "Item 1 Title", content: "Content for item 1" },
        { title: "Item 2 Title", content: "Content for item 2" },
        { title: "Item 3 Title", content: "Content for item 3" },
        // Add more items as needed
    ];

    // State to track the open accordion item
    const [openIndex, setOpenIndex] = useState(null);

    // Function to toggle the accordion item
    const toggleItem = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Render the accordion component
    return (
        <div className="accordion">
            {items.map((item, index) => (
                <div key={index}>
                    <h2>
                        <button
                            id={`accordion-header-${index}`}
                            className="accordion-header"
                            onClick={() => toggleItem(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`panel-${index}`}
                        >
                            {item.title}
                        </button>
                    </h2>
                    <div
                        id={`panel-${index}`}
                        className={`accordion-body ${
                            openIndex === index ? "open" : ""
                        }`}
                        role="region"
                        aria-labelledby={`accordion-header-${index}`}
                    >
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AccordionComponent;
