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

  test('the tooltip id can be used in a selector', async () => {
    /*
     * `useId` returns ":r0:", and `querySelector('#tooltip-:r0:')` throws on
     * those colons. Anything that resolves `aria-describedby` by building a
     * selector from it then cannot find the tooltip and reports it missing --
     * which is exactly what an audit of the demo page did.
     */
    renderTooltip();
    fireEvent.mouseEnter(screen.getByText(title));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    const id = screen.getByRole('tooltip').id;
    expect(id).not.toMatch(/:/);
    expect(document.querySelector(`#${id}`)).toBe(screen.getByRole('tooltip'));

    const describedby = screen.getByText(title).getAttribute('aria-describedby');
    expect(document.querySelector(`#${describedby}`)).toBe(screen.getByRole('tooltip'));
  });

  describe('hoverable: the pointer can reach the tooltip (WCAG 1.4.13)', () => {
    /*
     * The tooltip sits beside its trigger, so reaching it means leaving the
     * trigger. Hiding on the trigger's own leave made it unreachable -- the
     * pointer never arrived, because the tooltip was gone by the time it got
     * there. That is failure technique F95, and it was compounded by
     * `pointer-events: none`, which meant the element could not take a pointer
     * at all.
     *
     * `relatedTarget` is what distinguishes the two cases: the tooltip when the
     * pointer moves onto it, null when it leaves for nowhere.
     */
    test('stays open when the pointer moves from the trigger onto the tooltip', async () => {
      renderTooltip();
      const trigger = screen.getByText(title);

      fireEvent.mouseEnter(trigger);
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
      const tooltip = screen.getByRole('tooltip');

      fireEvent.mouseLeave(trigger, { relatedTarget: tooltip });
      fireEvent.mouseEnter(tooltip);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    test('hides once the pointer leaves the trigger and the tooltip together', async () => {
      const { container } = renderTooltip();
      const trigger = screen.getByText(title);

      fireEvent.mouseEnter(trigger);
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

      fireEvent.mouseLeave(container.querySelector('.tooltip-container'));

      await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });

    test('the tooltip does not opt out of pointer events', async () => {
      // `pointer-events: none` is what made the element unreachable. jsdom does
      // not resolve stylesheets, so this reads the rule as text -- the same
      // approach the stylesheet contract suites take.
      const fs = require('fs');
      const path = require('path');
      const css = fs.readFileSync(
        path.join(__dirname, '..', 'components', 'Tooltip', 'Tooltip.css'),
        'utf8',
      );
      const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
      expect(withoutComments).not.toMatch(/pointer-events\s*:\s*none/);
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
  // --- Regression coverage -------------------------------------------------

  describe('unique ids across instances (#156)', () => {
    const TwoTriggers = () => (
      <>
        <Tooltip text="Tooltip on the top" position="top">
          <button>Hover over me (top)!</button>
        </Tooltip>
        <Tooltip text="Tooltip on the right" position="right">
          <button>Hover over me (right)!</button>
        </Tooltip>
      </>
    );

    test('two visible tooltips do not share an id', () => {
      render(<TwoTriggers />);
      const top = screen.getByRole('button', { name: /top/i });
      const right = screen.getByRole('button', { name: /right/i });

      fireEvent.focus(top);
      fireEvent.mouseEnter(right);

      const tooltips = screen.getAllByRole('tooltip');
      expect(tooltips).toHaveLength(2);

      const ids = tooltips.map((t) => t.id);
      expect(new Set(ids).size).toBe(2);
    });

    test('a hovered trigger resolves aria-describedby to its own tooltip', () => {
      render(<TwoTriggers />);
      const top = screen.getByRole('button', { name: /top/i });
      const right = screen.getByRole('button', { name: /right/i });

      fireEvent.focus(top);
      fireEvent.mouseEnter(right);

      const describedBy = right.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy)).toHaveTextContent('Tooltip on the right');
    });

    test('a focused trigger resolves aria-describedby to its own tooltip', () => {
      render(<TwoTriggers />);
      const top = screen.getByRole('button', { name: /top/i });
      const right = screen.getByRole('button', { name: /right/i });

      fireEvent.focus(top);
      fireEvent.mouseEnter(right);

      const describedBy = top.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy)).toHaveTextContent('Tooltip on the top');
    });
  });

  describe('Escape dismisses regardless of trigger (#157)', () => {
    test('Escape hides a hover-triggered tooltip', () => {
      render(
        <Tooltip text="Tooltip on the bottom" position="bottom">
          <button>Hover over me!</button>
        </Tooltip>,
      );

      fireEvent.mouseEnter(screen.getByRole('button'));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Deliberately dispatched at the document, not the trigger: WCAG 1.4.13
      // requires dismissal without moving the pointer or focus, and a
      // hover-triggered tooltip usually means focus is elsewhere entirely.
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('Escape hides a focus-triggered tooltip', () => {
      render(
        <Tooltip text="Tooltip on the bottom" position="bottom">
          <button>Focus me!</button>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByRole('button'));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('the tooltip stays dismissed without moving the pointer', () => {
      render(
        <Tooltip text="Tooltip on the bottom" position="bottom">
          <button>Hover over me!</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole('button');

      fireEvent.mouseEnter(trigger);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // No mouseleave/mouseenter: the pointer has not moved.
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(trigger).not.toHaveAttribute('aria-describedby');
    });

    test('keys other than Escape do not dismiss it', () => {
      render(
        <Tooltip text="Tooltip on the bottom" position="bottom">
          <button>Hover over me!</button>
        </Tooltip>,
      );

      fireEvent.mouseEnter(screen.getByRole('button'));
      fireEvent.keyDown(document, { key: 'a' });

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    test('the document listener is removed once hidden', () => {
      const removeSpy = jest.spyOn(document, 'removeEventListener');
      const { unmount } = render(
        <Tooltip text="Tooltip" position="top">
          <button>Hover over me!</button>
        </Tooltip>,
      );

      fireEvent.mouseEnter(screen.getByRole('button'));
      fireEvent.keyDown(document, { key: 'Escape' });
      unmount();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeSpy.mockRestore();
    });
  });

  describe('the trigger keeps its own onKeyDown', () => {
    test('a child key handler is not clobbered by the tooltip', () => {
      const onKeyDown = jest.fn();
      render(
        <Tooltip text="Tooltip" position="top">
          <button onKeyDown={onKeyDown}>Press me</button>
        </Tooltip>,
      );

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });

      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
