/**
 *
 * To use the ModalDialog component in a React application,
 * you need to import it into a component where you want to
 * display a modal dialog. This component is designed to show a
 * dialog overlay that can be used for various purposes,
 * like displaying information, confirming actions, or containing forms.
 *
 * The ModalDialog component accepts several props:
 *   isOpen: A boolean that indicates whether the modal dialog is open.
 *   onClose: A function to be called when the modal dialog is closed.
 *   ariaLabel (optional): The ARIA label for the modal dialog, for accessibility purposes.
 *   ariaDescribedby (optional): The ID of the element that describes the modal dialog.
 *   children: The content to be rendered inside the modal dialog.
 *   initialFocusRef (optional): A React ref to the initial focusable element inside the modal dialog.
 *
 * In this example, MyComponent includes a button to open the ModalDialog.
 * When the button is clicked, isModalOpen is set to true,
 * causing the ModalDialog to be displayed.
 *
 * The ModalDialog contains a title, some content, and a close button.
 * The initialFocusRef is used to set the initial focus to the modal
 * title when the modal opens, improving accessibility.
 * The close button inside the modal calls closeModal to close the modal.
 * The onClose prop of the ModalDialog is also set to closeModal
 * to handle closing the modal when the escape key is pressed.
 */

import React, { useRef, useState } from 'react';
import ModalDialog from './ModalDialog'; // Adjust the import path based on your project structure

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFocusRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>My React Component</h1>
      <button onClick={openModal}>Open Modal</button>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        ariaLabel="My Modal Dialog"
        initialFocusRef={initialFocusRef}
      >
        <div>
          <h2 ref={initialFocusRef}>Modal Title</h2>
          <p>Content of the modal dialog goes here.</p>
          <button onClick={closeModal}>Close</button>
        </div>
      </ModalDialog>
    </div>
  );
}

export default MyComponent;
