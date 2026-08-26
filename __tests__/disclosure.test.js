import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Disclosure from '../components/Disclosure/Disclosure';

/**
 * APG pattern: Disclosure
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Contract:
 *   - Trigger is a <button> with aria-expanded and aria-controls.
 *   - Enter and Space toggle content visibility.
 *   - Click toggles content visibility.
 */
describe('Disclosure Component (APG disclosure pattern)', () => {
  const title = 'More details';
  const content = 'Hidden content';

  const getButton = () => screen.getByRole('button', { name: new RegExp(title) });

  test('button starts with aria-expanded=false', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    expect(getButton()).toHaveAttribute('aria-expanded', 'false');
  });

  test('button references controlled content via aria-controls', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    const button = getButton();
    const controlledId = button.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    const panel = document.getElementById(controlledId);
    expect(panel).toHaveTextContent(content);
  });

  test('content is hidden initially', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    expect(screen.getByText(content).closest('.disclosure-content')).toHaveClass('hidden');
  });

  test('click toggles aria-expanded and content visibility', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    const button = getButton();

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(content).closest('.disclosure-content')).not.toHaveClass('hidden');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(content).closest('.disclosure-content')).toHaveClass('hidden');
  });

  test('Enter key toggles content', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    const button = getButton();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('visual indicator flips between ▼ and ▲', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    const button = getButton();
    expect(button).toHaveTextContent('▼');
    fireEvent.click(button);
    expect(button).toHaveTextContent('▲');
  });

  test('button is a real <button> (native keyboard semantics)', () => {
    render(<Disclosure title={title}>{content}</Disclosure>);
    expect(getButton().tagName).toBe('BUTTON');
  });

  test('matches the snapshot (closed)', () => {
    const { asFragment } = render(<Disclosure title={title}>{content}</Disclosure>);
    expect(asFragment()).toMatchSnapshot();
  });
  // --- Regression coverage -------------------------------------------------

  describe('defaultOpen (#171)', () => {
    test('collapsed on load by default', () => {
      render(<Disclosure title="Click Me">Content</Disclosure>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    test('defaultOpen renders expanded on first paint', () => {
      render(
        <Disclosure title="Click Me" defaultOpen>
          Content
        </Disclosure>,
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content')).toBeVisible();
    });

    test('the disclosure still owns its state afterwards', () => {
      render(
        <Disclosure title="Click Me" defaultOpen>
          Content
        </Disclosure>,
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('unmountWhenClosed (#171)', () => {
    test('content is rendered but hidden by default', () => {
      render(<Disclosure title="Click Me">Lazy content</Disclosure>);

      // Present in the DOM, merely class-hidden -- this is the default and it
      // is what makes a "count is 0" assertion impossible against it.
      expect(screen.getByText('Lazy content')).toBeInTheDocument();
    });

    test('content is absent from the DOM until first expanded', () => {
      render(
        <Disclosure title="Click Me" unmountWhenClosed>
          Lazy content
        </Disclosure>,
      );

      expect(screen.queryByText('Lazy content')).not.toBeInTheDocument();
    });

    test('expanding renders the content', () => {
      render(
        <Disclosure title="Click Me" unmountWhenClosed>
          Lazy content
        </Disclosure>,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Lazy content')).toBeInTheDocument();
    });

    test('collapsing removes it again', () => {
      render(
        <Disclosure title="Click Me" unmountWhenClosed>
          Lazy content
        </Disclosure>,
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(screen.queryByText('Lazy content')).not.toBeInTheDocument();
    });

    test('aria-controls still references the container either way', () => {
      render(
        <Disclosure title="Click Me" unmountWhenClosed>
          Lazy content
        </Disclosure>,
      );
      const controls = screen.getByRole('button').getAttribute('aria-controls');

      // The container stays mounted so the IDREF never dangles; only its
      // children come and go.
      expect(document.getElementById(controls)).toBeInTheDocument();
    });

    test('the two props compose', () => {
      render(
        <Disclosure title="Click Me" defaultOpen unmountWhenClosed>
          Lazy content
        </Disclosure>,
      );

      expect(screen.getByText('Lazy content')).toBeInTheDocument();
    });
  });
});
