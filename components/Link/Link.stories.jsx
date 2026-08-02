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
 * double invocation rather than expose it. Activation instead stays harmless
 * because the link points at a fragment on this same page, so following it
 * neither unloads the story nor resets the counter.
 */
const ActivationCounter = (args) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Link {...args} onClick={() => setCount((previous) => previous + 1)} />
      <p>
        Activations: <output data-testid="activation-count">{count}</output>
      </p>
      <p id="activation-target">Fragment target for the link above.</p>
    </>
  );
};

const activationArgs = {
  to: '#activation-target',
  children: 'Activate me',
};

// No play function on either story: the E2E tests assert on the counter, so it
// has to start at zero on load.

/**
 * Activation through an injected router link — the path Storybook's global
 * decorator supplies via LinkComponentProvider.
 */
export const ActivationCount = {
  render: ActivationCounter,
  args: activationArgs,
};

/**
 * Activation through the dependency-free default. `linkComponent={null}` opts
 * this instance out of the surrounding provider, so the E2E suite can exercise
 * the plain `<a href>` branch that consumers get when they supply no router.
 */
export const ActivationCountPlainAnchor = {
  render: ActivationCounter,
  args: { ...activationArgs, linkComponent: null },
};
