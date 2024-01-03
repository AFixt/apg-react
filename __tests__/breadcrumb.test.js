import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock Breadcrumb items
const breadcrumbItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

describe('Breadcrumb Component', () => {
  const renderBreadcrumb = (items) =>
    render(
      <Router>
        <Breadcrumb items={items} />
      </Router>
    );

  test('Breadcrumb Containment in a Navigation Landmark Region', () => {
    renderBreadcrumb(breadcrumbItems);
    const navElement = screen.getByRole('navigation');

    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  test('Links in Breadcrumb', () => {
    renderBreadcrumb(breadcrumbItems);
    const links = screen.getAllByRole('link');

    links.forEach((link, index) => {
      if (index < breadcrumbItems.length - 1) {
        expect(link).toHaveAttribute('href', breadcrumbItems[index].path);
      }
    });

    const currentPage = screen.getByText(breadcrumbItems[breadcrumbItems.length - 1].label);
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  test('Current Page Representation in Breadcrumb', () => {
    renderBreadcrumb(breadcrumbItems);
    const currentPage = screen.getByText(breadcrumbItems[breadcrumbItems.length - 1].label);

    expect(currentPage).not.toBeInstanceOf(HTMLAnchorElement);
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  test('Visual Structure of Breadcrumb', () => {
    renderBreadcrumb(breadcrumbItems);
    const breadcrumbNav = screen.getByRole('navigation');

    // Note: Visual structure and positioning tests are better suited for visual testing tools or manual inspection.
    expect(breadcrumbNav).toBeInTheDocument();
  });
});
