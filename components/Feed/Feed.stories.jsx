import React from 'react';
import Feed from './Feed';

export default {
  title: 'Components/Feed',
  component: Feed,
  tags: ['autodocs'],
};

let nextId = 1;
const makeArticles = (count) =>
  Array.from({ length: count }, () => {
    const id = nextId++;
    return {
      id: String(id),
      title: `Article ${id}`,
      content: `This is the body content for article number ${id}. Scroll down to load more.`,
    };
  });

const fetchArticles = () =>
  new Promise((resolve) => setTimeout(() => resolve(makeArticles(3)), 400));

export const Default = {
  args: {
    fetchArticles,
  },
};

// Ctrl+Home and Ctrl+End move focus to the focusable element before and after
// the feed, so they cannot be exercised against `Default`, which renders the
// feed on its own. This variant supplies a target on each side. It is the
// story the feed-ctrl-home / feed-ctrl-end use cases drive.
export const InPageContext = {
  render: (args) => (
    <div>
      <button type="button">Before the feed</button>
      <Feed {...args} />
      <button type="button">After the feed</button>
    </div>
  ),
  args: {
    fetchArticles,
    ariaLabel: 'News',
  },
};
