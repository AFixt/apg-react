import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Article from '../components/Article/Article';

describe('Article Component (APG-compliant structure)', () => {
  const article = {
    id: 'a1',
    title: 'Test Article Title',
    content: 'This is the body of the test article.',
  };

  test('renders a native <article> landmark', () => {
    const { container } = render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    const articleEl = container.querySelector('article');
    expect(articleEl).toBeInTheDocument();
  });

  /*
   * Article.css and the `.feed .article` half of Feed.css are both written
   * against this class, and neither had anything to match: the component
   * rendered a bare <article>, so every rule in both files was inert. jsdom
   * does not resolve stylesheets, so nothing in this suite could have noticed —
   * the class itself is the contract that has to be asserted here, with
   * e2e/article.e2e.js covering the computed style a real engine produces.
   */
  test('carries the class its stylesheet is keyed off', () => {
    const { container } = render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    expect(container.querySelector('article')).toHaveClass('article');
  });

  test('has an accessible heading derived from title', () => {
    render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(article.title);
  });

  test('heading has a stable id matching article id for labelling', () => {
    render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', `article-title-${article.id}`);
  });

  test('exposes aria-posinset and aria-setsize for Feed pattern consumption', () => {
    const { container } = render(<Article article={article} ariaPosinset={3} ariaSetsize={10} />);
    const articleEl = container.querySelector('article');
    expect(articleEl).toHaveAttribute('aria-posinset', '3');
    expect(articleEl).toHaveAttribute('aria-setsize', '10');
  });

  test('renders the article content', () => {
    render(<Article article={article} ariaPosinset={1} ariaSetsize={1} />);
    expect(screen.getByText(article.content)).toBeInTheDocument();
  });
});
