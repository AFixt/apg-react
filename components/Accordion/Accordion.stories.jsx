import React, { useState } from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Accordion from './Accordion';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

const sampleItems = [
  { title: 'What is APG-React?', content: 'A library of accessible React components implementing WAI-ARIA Authoring Practices Guide patterns.' },
  { title: 'How do I use it?', content: 'Install from npm, import the components you need, and include the styles.' },
  { title: 'Is it accessible?', content: 'Yes — every component implements the full keyboard and ARIA contract from the APG.' },
];

const Template = (args) => {
  const [openIndex, setOpenIndex] = useState(args.openIndex ?? null);
  const toggleItem = (index) => setOpenIndex(openIndex === index ? null : index);
  return <Accordion {...args} openIndex={openIndex} toggleItem={toggleItem} />;
};

export const Default = {
  render: Template,
  args: {
    items: sampleItems,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const firstHeader = canvas.getByRole('button', { name: sampleItems[0].title });

    await step('Initially collapsed', async () => {
      await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Click expands the first panel', async () => {
      await userEvent.click(firstHeader);
      await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    });

    await step('ArrowDown moves focus to the next header', async () => {
      firstHeader.focus();
      await userEvent.keyboard('{ArrowDown}');
      const secondHeader = canvas.getByRole('button', { name: sampleItems[1].title });
      await expect(secondHeader).toHaveFocus();
    });
  },
};

export const FirstOpen = {
  render: Template,
  args: {
    items: sampleItems,
    openIndex: 0,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: sampleItems[0].title });
    await step('First panel renders expanded', async () => {
      await expect(first).toHaveAttribute('aria-expanded', 'true');
    });
    await step('Click collapses the open panel', async () => {
      await userEvent.click(first);
      await expect(first).toHaveAttribute('aria-expanded', 'false');
    });
    await step('End jumps focus to last header', async () => {
      first.focus();
      await userEvent.keyboard('{End}');
      const last = canvas.getByRole('button', { name: sampleItems[sampleItems.length - 1].title });
      await expect(last).toHaveFocus();
    });
  },
};
