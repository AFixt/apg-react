import React from 'react';
import { MemoryRouter, Link as RouterLink } from 'react-router-dom';
import { LinkComponentProvider } from '../components/internal/link-component';
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
        {/* Demonstrates the opt-in router integration; without this provider
            Link and Breadcrumb render plain anchors. */}
        <LinkComponentProvider value={RouterLink}>
          <div style={{ padding: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Story />
          </div>
        </LinkComponentProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
