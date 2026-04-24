import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Tooltip from '../components/Tooltip/Tooltip';

/**
 * APG pattern: Tooltip
 * https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * Contract:
 *   - Tooltip element has role=tooltip.
 *   - Shown on hover AND focus.
 *   - Hidden on pointer leave, focus loss, or Escape.
 *   - Tooltip is associated with the trigger via aria-describedby.
 */
describe('Tooltip Component (APG tooltip pattern)', () => {
  const text = 'Helpful hint';
  const title = 'Trigger';
  const content = <button>{title}</button>;

  const renderTooltip = (position = 'top') =>
    render(
      <Tooltip text={text} position={position}>
        {content}
      </Tooltip>,
    );

  test('tooltip is hidden initially', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('shows on pointer hover', async () => {
    renderTooltip();
    fireEvent.mouseEnter(screen.getByText(title));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent(text);
    });
  });

  test('hides on pointer leave', async () => {
    renderTooltip();
    const trigger = screen.getByText(title);
    fireEvent.mouseEnter(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    fireEvent.mouseLeave(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('shows on keyboard focus', async () => {
    renderTooltip();
    const trigger = screen.getByText(title);
    fireEvent.focus(trigger);
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  test('hides on focus loss (blur)', async () => {
    renderTooltip();
    const trigger = screen.getByText(title);
    fireEvent.focus(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    fireEvent.blur(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('Escape key dismisses the tooltip', async () => {
    renderTooltip();
    const trigger = screen.getByText(title);
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('position prop is reflected as data-position attribute', async () => {
    renderTooltip('bottom');
    fireEvent.mouseEnter(screen.getByText(title));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-position', 'bottom');
    });
  });

  test.each(['top', 'right', 'bottom', 'left'])('supports %s position', async (position) => {
    renderTooltip(position);
    fireEvent.mouseEnter(screen.getByText(title));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-position', position);
    });
  });

  test('tooltip snapshot (closed)', () => {
    const { asFragment } = render(<Tooltip text={text}>{content}</Tooltip>);
    expect(asFragment()).toMatchSnapshot();
  });
});
