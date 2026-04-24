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
