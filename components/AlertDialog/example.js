/**
 * To use the AlertDialog component in a React application,
 * you need to import it into the component where you want
 * it to be displayed.
 *
 * This AlertDialog component accepts four props:
 * isOpen, title, message, and onClose.
 *
 * The isOpen prop determines whether the dialog is visible,
 * title and message set the dialog's content,
 * and onClose is a callback function that should be triggered
 * when the dialog needs to be closed.
 *
 * In this example, MyComponent is a functional component
 * that includes a button to open the AlertDialog.
 *
 * When the button is clicked, isDialogOpen is set to true,
 * causing the AlertDialog to be displayed. The dialog can be
 * closed either by clicking its close button or by triggering
 * the handleCloseDialog function from outside the dialog.
 *
 * The AlertDialog will be hidden again once isDialogOpen is set to false.
 *
 */

import React, { useState } from "react";
import AlertDialog from "./AlertDialog"; // Adjust the import path based on your project structure

function MyComponent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <h1>Example Component</h1>
            <button onClick={() => setIsDialogOpen(true)}>Open Dialog</button>

            {/* Usage of AlertDialog component */}
            <AlertDialog
                isOpen={isDialogOpen}
                title="Alert Dialog Title"
                message="This is the content of the alert dialog."
                onClose={handleCloseDialog}
            />
        </div>
    );
}

export default MyComponent;
