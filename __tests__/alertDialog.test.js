import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertDialog from '../components/AlertDialog/AlertDialog';

describe('AlertDialog Component', () => {
  const title = "Alert Title";
  const message = "This is an important alert message.";
  const mockOnClose = jest.fn();

  test('Alert Dialog Role and Properties', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const alertDialog = screen.getByRole('alertdialog');

    expect(alertDialog).toBeInTheDocument();
    expect(alertDialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('Labeling the Alert Dialog', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const alertDialog = screen.getByRole('alertdialog');

    expect(alertDialog).toHaveAttribute('aria-labelledby', 'dialogTitle');
  });

  test('Describing the Alert Dialog Content', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const alertDialog = screen.getByRole('alertdialog');

    expect(alertDialog).toHaveAttribute('aria-describedby', 'dialogDesc');
  });

  test('Keyboard Interaction with Alert Dialog', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const closeBtn = screen.getByText('Close');

    fireEvent.keyDown(closeBtn, { key: 'Tab' });
  });

  test('Interrupting User Workflow', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const alertDialog = screen.getByRole('alertdialog');

    expect(alertDialog).toBeVisible();
    // Note: Testing user workflow interruption is subjective and beyond the scope of automated testing
  });

  test('Special Treatment for Alert Dialogs', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
  });

  test('Dialog Closes on Close Button Click', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const closeBtn = screen.getByText('Close');

    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
