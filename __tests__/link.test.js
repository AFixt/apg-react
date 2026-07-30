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
 *   - Visible label / accessible name is the link's content.
 */
describe('Link Component (APG link pattern)', () => {
  const renderLink = (props = {}, children = 'Go home') =>
    render(
      <Link to="/home" {...props}>
        {children}
      </Link>,
    );

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

  test('Enter key triggers the onClick handler', () => {
    const onClick = jest.fn();
    renderLink({ onClick });
    const link = screen.getByRole('link', { name: 'Go home' });
    fireEvent.keyDown(link, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
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

  test('Enter still triggers onClick when a router Link is injected', () => {
    const onClick = jest.fn();
    render(
      <MemoryRouter>
        <LinkComponentProvider value={RouterLink}>
          <Link to="/home" onClick={onClick}>
            Go home
          </Link>
        </LinkComponentProvider>
      </MemoryRouter>,
    );
    fireEvent.keyDown(screen.getByRole('link', { name: 'Go home' }), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
