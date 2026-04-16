import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../components/styles.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div style={{ padding: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default preview;
