/**
 *
 * To use the NonModalDialog component in a React application, import it into a
 * component where you want to display a dialog that does not take over the
 * page. Unlike ModalDialog, it leaves the rest of the page interactive and does
 * not trap focus, so it suits things like a preferences panel, a filter panel,
 * or a details pane that the user may want to consult while continuing to work.
 *
 * Reach for ModalDialog instead when the user must deal with the dialog before
 * doing anything else — a confirmation, or a blocking error.
 *
 * The NonModalDialog component accepts several props:
 *   isOpen: A boolean that indicates whether the dialog is open.
 *   onClose: A function to be called when the dialog is closed.
 *   ariaLabelledby (optional): The ID of the element that labels the dialog.
 *   ariaDescribedby (optional): The ID of the element that describes the dialog.
 *   children: The content to be rendered inside the dialog.
 *   initialFocusRef (optional): A React ref to the element that should receive
 *     focus when the dialog opens. Defaults to the dialog container.
 *   labels (optional): Translatable labels; `closeDialog` overrides the close
 *     button's accessible name.
 *
 * In this example, MyComponent includes a button to open the NonModalDialog.
 * Because the dialog is non-modal, the search field stays reachable by keyboard
 * and by pointer while the dialog is open, and tabbing out of the dialog does
 * not close it.
 *
 * import React, { useState } from 'react';
 * import { NonModalDialog } from '@afixt/apg-react';
 *
 * function MyComponent() {
 *   const [isDialogOpen, setIsDialogOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button type="button" onClick={() => setIsDialogOpen(true)}>
 *         Open preferences
 *       </button>
 *
 *       <label htmlFor="page-search">Search</label>
 *       <input id="page-search" type="text" />
 *
 *       <NonModalDialog
 *         isOpen={isDialogOpen}
 *         onClose={() => setIsDialogOpen(false)}
 *         ariaLabelledby="prefs-title"
 *         ariaDescribedby="prefs-desc"
 *       >
 *         <h2 id="prefs-title">Preferences</h2>
 *         <p id="prefs-desc">Adjust how results are displayed.</p>
 *         <button type="button">Reset to defaults</button>
 *       </NonModalDialog>
 *     </>
 *   );
 * }
 *
 * Accessibility notes:
 *   - The dialog sets aria-modal="false" explicitly, so assistive technology and
 *     automated checks can distinguish "non-modal" from "unspecified".
 *   - Give the dialog an accessible name by pointing ariaLabelledby at a heading
 *     inside children.
 *   - Escape closes the dialog only while focus is inside it. A non-modal dialog
 *     does not own the page's key events.
 *   - Focus returns to whichever element opened the dialog when it closes.
 *
 */
