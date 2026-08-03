import React from 'react';
import Article from './Article';

export default {
  title: 'Components/Article',
  component: Article,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    article: {
      id: '1',
      title: 'Building accessible components',
      content:
        'Accessibility is not an afterthought — it should be baked into every component from the start. Every interactive element needs proper keyboard support, ARIA attributes, and semantic markup.',
    },
    ariaPosinset: 1,
    ariaSetsize: 1,
  },
};

/*
 * `content` takes any ReactNode, and Article.css styles links inside it. That
 * rule is only reachable once the content actually contains one, which is what
 * this story is for — the E2E suite tabs to this link to assert the focus ring
 * renders, in ordinary and forced-colors modes alike.
 */
export const WithLink = {
  args: {
    article: {
      id: '2',
      title: 'Further reading',
      content: (
        <p>
          The patterns implemented here come from the{' '}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/">WAI-ARIA Authoring Practices Guide</a>
          , which specifies the keyboard interaction and ARIA for each one.
        </p>
      ),
    },
    ariaPosinset: 1,
    ariaSetsize: 1,
  },
};
