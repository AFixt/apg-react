import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Link as RouterLink } from 'react-router-dom';
import { LinkComponentProvider } from '../components/_internal/link-component';
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
    // Enter in a keydown handler as well would invoke onClick twice in a real
    // browser; this asserts that no keydown path invokes it.
    const onClick = clickSpy();
    renderLink({ onClick });
    const link = screen.getByRole('link', { name: 'Go home' });

    fireEvent.keyDown(link, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.keyDown(link, { key: ' ' });
    fireEvent.keyDown(link, { key: 'F10', shiftKey: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  test('no key press is intercepted, so native link behaviour is preserved', () => {
    // The component adds no keyboard handling of its own. Cancelling a keydown
    // here would take platform behaviour away from keyboard users — Shift+F10
    // is the keyboard route to the context menu, and Enter activation is what
    // delivers onClick.
    renderLink();
    const link = screen.getByRole('link', { name: 'Go home' });

    for (const init of [{ key: 'Enter' }, { key: 'F10', shiftKey: true }, { key: 'Tab' }]) {
      const event = new KeyboardEvent('keydown', { ...init, bubbles: true, cancelable: true });
      link.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
  });

  test('a consumer onKeyDown is forwarded, not swallowed', () => {
    const onKeyDown = jest.fn();
    renderLink({ onKeyDown });
    fireEvent.keyDown(screen.getByRole('link', { name: 'Go home' }), { key: 'a' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  test('arbitrary props are forwarded to the anchor', () => {
    renderLink({ 'className': 'custom', 'data-testid': 'link', 'target': '_blank' });
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveClass('custom');
    expect(link).toHaveAttribute('data-testid', 'link');
    expect(link).toHaveAttribute('target', '_blank');
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

  test.each([
    ['an empty string', ''],
    ['an empty location object', {}],
  ])('falls back to # rather than href="" for %s', (_label, to) => {
    // href="" resolves to the current page, which is a silently wrong link
    // rather than an obviously inert one.
    render(<Link to={to}>Nowhere</Link>);
    expect(screen.getByRole('link', { name: 'Nowhere' })).toHaveAttribute('href', '#');
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

  test('linkComponent={null} forces a plain anchor inside a provider', () => {
    // An explicit null is the per-instance opt-out. Omitting the prop defers to
    // the provider, so the two must not be treated as the same value.
    render(
      <MemoryRouter>
        <LinkComponentProvider value={RouterLink}>
          <Link to="/home" linkComponent={null}>
            Go home
          </Link>
        </LinkComponentProvider>
      </MemoryRouter>,
    );
    // react-router stamps data-discover on the anchors it renders.
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).not.toHaveAttribute('data-discover');
    expect(link).toHaveAttribute('href', '/home');
  });

  test('onClick still fires on the opted-out plain anchor', () => {
    const onClick = jest.fn((event) => event.preventDefault());
    render(
      <MemoryRouter>
        <LinkComponentProvider value={RouterLink}>
          <Link to="/home" linkComponent={null} onClick={onClick}>
            Go home
          </Link>
        </LinkComponentProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('onClick fires when linkComponent is supplied as a prop', () => {
    const onClick = jest.fn();
    render(
      <MemoryRouter>
        <Link to="/home" linkComponent={RouterLink} onClick={onClick}>
          Go home
        </Link>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
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
