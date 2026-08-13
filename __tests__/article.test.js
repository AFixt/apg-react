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

  test('heading has an id that traces back to the article id', () => {
    render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    const heading = screen.getByRole('heading', { level: 2 });
    const id = heading.getAttribute('id');
    expect(id).toBeTruthy();
    // Instance-scoped via useId, so the exact string is not a contract — but
    // it stays greppable back to the article it names.
    expect(id.endsWith(`-${article.id}`)).toBe(true);
  });

  /*
   * role="article" does not take its name from contents, so the heading id
   * above is only useful if the <article> actually references it. The APG
   * Feed pattern requires each article to be labelled by a distinguishing
   * element — without this, every feed stop announces as an unnamed article.
   */
  test('article is labelled by its title (accessible name)', () => {
    render(<Article article={article} ariaPosinset={1} ariaSetsize={5} />);
    const articleEl = screen.getByRole('article');
    const heading = screen.getByRole('heading', { level: 2 });
    expect(articleEl).toHaveAttribute('aria-labelledby', heading.getAttribute('id'));
    expect(articleEl).toHaveAccessibleName(article.title);
  });

  /*
   * `article.id` is unique only within a single feed. Before the id was scoped
   * to the component instance, two articles sharing an id emitted duplicate
   * heading ids, and aria-labelledby resolves a duplicate to the first match
   * in document order — so the second article silently announced the first
   * one's title. A wrong name is worse than no name.
   */
  test('two articles sharing an id still get distinct labels', () => {
    const other = { id: 'a1', title: 'A Different Title', content: 'Other body.' };
    render(
      <>
        <Article article={article} ariaPosinset={1} ariaSetsize={2} />
        <Article article={other} ariaPosinset={2} ariaSetsize={2} />
      </>,
    );

    const [first, second] = screen.getAllByRole('article');
    expect(first.getAttribute('aria-labelledby')).not.toBe(second.getAttribute('aria-labelledby'));
    expect(first).toHaveAccessibleName(article.title);
    expect(second).toHaveAccessibleName(other.title);
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
