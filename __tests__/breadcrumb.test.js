import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';

/**
 * APG pattern: Breadcrumb
 * https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *
 * Contract:
 *   - Wrapping <nav> has aria-label="Breadcrumb".
 *   - Items are an ordered list.
 *   - All items except the last are links.
 *   - The last item represents the current page and is NOT a link; it has aria-current="page".
 */
const items = [
  { path: '/', label: 'Home' },
  { path: '/library', label: 'Library' },
  { path: '/library/data', label: 'Data' },
  { path: '/library/data/reports', label: 'Reports' },
];

const renderBreadcrumb = (bcItems = items) =>
  render(
    <Router>
      <Breadcrumb items={bcItems} />
    </Router>,
  );

describe('Breadcrumb Component (APG breadcrumb pattern)', () => {
  test("container is a navigation landmark labelled 'Breadcrumb'", () => {
    renderBreadcrumb();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  test('items are rendered inside an ordered list', () => {
    renderBreadcrumb();
    const nav = screen.getByRole('navigation');
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
  });

  test('all items except the last are links with correct hrefs', () => {
    renderBreadcrumb();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(items.length - 1);
    links.forEach((link, i) => {
      expect(link).toHaveAttribute('href', items[i].path);
      expect(link).toHaveTextContent(items[i].label);
    });
  });

  test('last item is NOT a link and represents the current page', () => {
    renderBreadcrumb();
    const last = items[items.length - 1];
    const currentPage = screen.getByText(last.label);
    expect(currentPage.tagName).not.toBe('A');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  test('exactly one element has aria-current=page', () => {
    renderBreadcrumb();
    const all = screen.getByRole('navigation').querySelectorAll('[aria-current]');
    expect(all).toHaveLength(1);
    expect(all[0]).toHaveAttribute('aria-current', 'page');
  });

  test('renders correctly with a single item (current page only)', () => {
    renderBreadcrumb([{ path: '/', label: 'Home' }]);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
  });

  test('renders correctly with two items', () => {
    renderBreadcrumb([
      { path: '/', label: 'Home' },
      { path: '/settings', label: 'Settings' },
    ]);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });

  test('matches the snapshot', () => {
    const { asFragment } = renderBreadcrumb();
    expect(asFragment()).toMatchSnapshot();
  });
});
