/**
 * Handles the keydown event for the accordion buttons.
 * @param {Event} event - The keydown event object.
 * @param {number} index - The index of the accordion button.
 */
const handleKeyDown = (event, index) => {
    const totalItems = items.length;
    let newIndex = index;

    switch (event.key) {
        case "ArrowDown":
            newIndex = (index + 1) % totalItems;
            break;
        case "ArrowUp":
            newIndex = (index - 1 + totalItems) % totalItems;
            break;
        case "Home":
            newIndex = 0;
            break;
        case "End":
            newIndex = totalItems - 1;
            break;
        default:
            return;
    }

    // Set focus to the new accordion header
    document.getElementById(`accordion-header-${newIndex}`).focus();
};

/**
 * Renders the accordion component.
 * @returns {JSX.Element} The rendered accordion component.
 */
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
