import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AlertDialog from '../components/AlertDialog/AlertDialog';

describe('AlertDialog Component', () => {
  const title = 'Alert Title';
  const message = 'This is an important alert message.';
  const mockOnClose = jest.fn();

  test('Alert Dialog Snapshot', () => {
    const { asFragment } = render(
      <AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

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
    const labelId = alertDialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId)).toHaveTextContent(title);
  });

  test('Describing the Alert Dialog Content', () => {
    render(<AlertDialog isOpen={true} title={title} message={message} onClose={mockOnClose} />);
    const alertDialog = screen.getByRole('alertdialog');
    const descId = alertDialog.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId)).toHaveTextContent(message);
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
  // --- Regression coverage -------------------------------------------------

  describe('confirm / cancel actions (#143)', () => {
    const confirmProps = (overrides = {}) => ({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete your account?',
      onClose: jest.fn(),
      ...overrides,
    });

    test('with no actions it is still an acknowledge-only dialog', () => {
      render(<AlertDialog {...confirmProps()} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('Close');
    });

    test('labels.close renames the acknowledge button', () => {
      render(<AlertDialog {...confirmProps({ labels: { close: 'Dismiss' } })} />);
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    test("actions render as the dialog's choices", () => {
      render(
        <AlertDialog
          {...confirmProps({
            actions: [{ label: 'Cancel' }, { label: 'OK', destructive: true }],
          })}
        />,
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    test('initial focus goes to the least destructive action by default', () => {
      render(
        <AlertDialog
          {...confirmProps({
            actions: [{ label: 'OK', destructive: true }, { label: 'Cancel' }],
          })}
        />,
      );

      // Cancel is second, but OK is destructive -- the APG's guidance is to
      // focus the least destructive choice, so listing order must not decide it.
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('initialFocus overrides that', () => {
      render(
        <AlertDialog
          {...confirmProps({
            actions: [{ label: 'Cancel' }, { label: 'OK', destructive: true, initialFocus: true }],
          })}
        />,
      );

      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'OK' }));
    });

    test('the first action is focused when none is destructive', () => {
      render(
        <AlertDialog {...confirmProps({ actions: [{ label: 'Later' }, { label: 'Now' }] })} />,
      );

      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Later' }));
    });

    test('activating an action runs onSelect and closes', () => {
      const onSelect = jest.fn();
      const onClose = jest.fn();
      render(
        <AlertDialog
          {...confirmProps({
            onClose,
            actions: [{ label: 'Cancel' }, { label: 'OK', onSelect, destructive: true }],
          })}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('each action gets its own onSelect', () => {
      const cancel = jest.fn();
      const confirm = jest.fn();
      render(
        <AlertDialog
          {...confirmProps({
            actions: [
              { label: 'Cancel', onSelect: cancel },
              { label: 'OK', onSelect: confirm, destructive: true },
            ],
          })}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(cancel).toHaveBeenCalledTimes(1);
      expect(confirm).not.toHaveBeenCalled();
    });

    test('an action without onSelect still closes', () => {
      const onClose = jest.fn();
      render(<AlertDialog {...confirmProps({ onClose, actions: [{ label: 'Cancel' }] })} />);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('the destructive action is marked as such', () => {
      render(
        <AlertDialog
          {...confirmProps({
            actions: [{ label: 'Cancel' }, { label: 'OK', destructive: true }],
          })}
        />,
      );

      expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('dialog-action-destructive');
      expect(screen.getByRole('button', { name: 'Cancel' })).not.toHaveClass(
        'dialog-action-destructive',
      );
    });

    test('Escape is still equivalent to dismissing', () => {
      const onClose = jest.fn();
      render(
        <AlertDialog
          {...confirmProps({
            onClose,
            actions: [{ label: 'Cancel' }, { label: 'OK', destructive: true }],
          })}
        />,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('the dialog keeps its alertdialog semantics with actions', () => {
      render(
        <AlertDialog
          {...confirmProps({
            actions: [{ label: 'Cancel' }, { label: 'OK', destructive: true }],
          })}
        />,
      );
      const dialog = screen.getByRole('alertdialog');

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAccessibleName('Confirm Delete');
    });

    test('an empty actions array falls back to the acknowledge button', () => {
      render(<AlertDialog {...confirmProps({ actions: [] })} />);

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });
  test('two actions sharing a label both render (#143)', () => {
    render(
      <AlertDialog
        isOpen
        title="Confirm"
        message="Pick one"
        onClose={() => {}}
        actions={[{ label: 'Retry' }, { label: 'Retry' }]}
      />,
    );

    // A duplicate React key would silently drop one of them.
    expect(screen.getAllByRole('button', { name: 'Retry' })).toHaveLength(2);
  });
});
