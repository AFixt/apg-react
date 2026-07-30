import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Link as RouterLink } from 'react-router-dom';
import { LinkComponentProvider } from '../components/internal/link-component';
import Link from '../components/Link/Link';

/**
 * APG pattern: Link
 * https://www.w3.org/WAI/ARIA/apg/patterns/link/
 *
 * Key requirements:
 *   - Element has role="link".
 *   - Element is keyboard focusable (tabindex="0" when non-native).
 *   - Enter key activates the link (invoking onClick when provided).
 *   - Pointer activation invokes onClick identically to Enter.
 *   - Visible label / accessible name is the link's content.
 */
describe('Link Component (APG link pattern)', () => {
  const renderLink = (props = {}, children = 'Go home') =>
    render(
      <Link to="/home" {...props}>
        {children}
      </Link>,
    );

  // A spy that swallows the default action, so jsdom does not attempt to
  // navigate when a click reaches the anchor.
  const clickSpy = () => jest.fn((event) => event.preventDefault());

  /**
   * Reproduces what a browser does when Enter is pressed on a focused anchor:
   * a keydown, followed by the anchor's synthesised click. jsdom does not
   * derive the click from the keydown, so the test issues both.
   */
  const pressEnter = (element) => {
    fireEvent.keyDown(element, { key: 'Enter' });
    fireEvent.click(element);
  };

  test('has role=link', () => {
    renderLink();
    expect(screen.getByRole('link', { name: 'Go home' })).toBeInTheDocument();
  });

  test('is keyboard focusable as a native link', () => {
    renderLink();
    const link = screen.getByRole('link', { name: 'Go home' });
    // Native <a> with href is focusable without explicit tabindex
    expect(link.tagName).toBe('A');
  });

  test('Enter key triggers the onClick handler exactly once', () => {
    const onClick = clickSpy();
    renderLink({ onClick });
    pressEnter(screen.getByRole('link', { name: 'Go home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('mouse click triggers the onClick handler exactly once', () => {
    const onClick = clickSpy();
    renderLink({ onClick });
    fireEvent.click(screen.getByRole('link', { name: 'Go home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('onClick receives the activation event for both modalities', () => {
    const onClick = clickSpy();
    renderLink({ onClick });
    const link = screen.getByRole('link', { name: 'Go home' });

    fireEvent.click(link);
    expect(onClick.mock.calls[0][0].type).toBe('click');
    expect(onClick.mock.calls[0][0].target).toBe(link);

    pressEnter(link);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick.mock.calls[1][0].type).toBe('click');
  });

  test('keydown alone does not invoke onClick, so Enter cannot double-fire', () => {
    // The component relies on native anchor activation for Enter. Handling
    // Enter in the keydown handler as well would invoke onClick twice in a
    // real browser; this asserts that the keydown path stays inert.
    const onClick = clickSpy();
    renderLink({ onClick });
    const link = screen.getByRole('link', { name: 'Go home' });

    fireEvent.keyDown(link, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.keyDown(link, { key: ' ' });
    fireEvent.keyDown(link, { key: 'F10', shiftKey: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  test('accessible name comes from link text content', () => {
    renderLink({}, 'Read the docs');
    expect(screen.getByRole('link', { name: 'Read the docs' })).toBeInTheDocument();
  });

  test('navigates to the configured href', () => {
    renderLink();
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/home');
  });
});

/**
 * The library must not depend on a router. Link renders a plain anchor by
 * default and only defers to a router when one is explicitly supplied.
 */
describe('Link Component (optional router integration)', () => {
  test('renders a plain anchor with no router present', () => {
    render(<Link to="/home">Go home</Link>);
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  test('flattens a location object into an href in the fallback', () => {
    render(
      <Link to={{ pathname: '/search', search: '?q=aria', hash: '#results' }}>Search results</Link>,
    );
    expect(screen.getByRole('link', { name: 'Search results' })).toHaveAttribute(
      'href',
      '/search?q=aria#results',
    );
  });

  test('uses a router Link supplied via the linkComponent prop', () => {
    render(
      <MemoryRouter>
        <Link to="/home" linkComponent={RouterLink}>
          Go home
        </Link>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/home');
  });

  test('uses a router Link supplied via LinkComponentProvider', () => {
    render(
      <MemoryRouter>
        <LinkComponentProvider value={RouterLink}>
          <Link to="/home">Go home</Link>
        </LinkComponentProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/home');
  });

  test('the linkComponent prop overrides the provider value', () => {
    const Custom = ({ to, children, ...rest }) => (
      <a href={to} data-custom="yes" {...rest}>
        {children}
      </a>
    );

    render(
      <MemoryRouter>
        <LinkComponentProvider value={RouterLink}>
          <Link to="/home" linkComponent={Custom}>
            Go home
          </Link>
        </LinkComponentProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('data-custom', 'yes');
  });

  describe('activation with an injected router Link', () => {
    const renderRouterLink = (onClick) =>
      render(
        <MemoryRouter>
          <LinkComponentProvider value={RouterLink}>
            <Link to="/home" onClick={onClick}>
              Go home
            </Link>
          </LinkComponentProvider>
        </MemoryRouter>,
      );

    test('Enter triggers onClick exactly once', () => {
      const onClick = jest.fn();
      renderRouterLink(onClick);
      const link = screen.getByRole('link', { name: 'Go home' });
      fireEvent.keyDown(link, { key: 'Enter' });
      fireEvent.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('mouse click triggers onClick exactly once', () => {
      const onClick = jest.fn();
      renderRouterLink(onClick);
      fireEvent.click(screen.getByRole('link', { name: 'Go home' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('keydown alone does not invoke onClick', () => {
      const onClick = jest.fn();
      renderRouterLink(onClick);
      fireEvent.keyDown(screen.getByRole('link', { name: 'Go home' }), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
