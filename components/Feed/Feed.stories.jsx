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
