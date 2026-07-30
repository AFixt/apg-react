import { fn } from '@storybook/test';
import React, { useState } from 'react';
import Link from './Link';

export default {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    to: '/destination',
    children: 'Go to destination',
  },
};

export const WithOnClick = {
  args: {
    to: '/profile',
    onClick: fn(),
    children: 'View profile',
  },
};

/**
 * Renders the number of times onClick has fired so a real browser can assert
 * that pointer and keyboard activation each invoke the handler exactly once.
 *
 * The handler deliberately does not call preventDefault: cancelling a keydown
 * suppresses the click a browser synthesises from Enter, which would hide a
 * double invocation rather than expose it. The link targets '#' so the default
 * action is a harmless hash change.
 */
const ActivationCounter = (args) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Link {...args} onClick={() => setCount((previous) => previous + 1)} />
      <p>
        Activations: <output data-testid="activation-count">{count}</output>
      </p>
    </>
  );
};

// No play function: the E2E tests assert on this story's count, so it has to
// start at zero on load.
export const ActivationCount = {
  render: ActivationCounter,
  args: {
    to: '#',
    children: 'Activate me',
  },
};
