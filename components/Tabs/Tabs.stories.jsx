import { expect, userEvent, within } from '@storybook/test';
import React from 'react';
import Tabs from './Tabs';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

const tabs = [
  { id: 'overview', label: 'Overview', content: <p>Overview content goes here.</p> },
  { id: 'pricing', label: 'Pricing', content: <p>Pricing details and plans.</p> },
  { id: 'faq', label: 'FAQ', content: <p>Frequently asked questions.</p> },
];

export const Horizontal = {
  args: { tabs, idPrefix: 'h' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');

    await step('First tab is selected', async () => {
      await expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    await step('ArrowRight moves activation to next tab (automatic)', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });

    await step('End jumps to last tab', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('tab');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-selected', 'true');
    });
  },
};

export const Vertical = {
  args: { tabs, orientation: 'vertical', idPrefix: 'v' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');
    await step('ArrowDown moves to next tab in vertical orientation', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });
  },
};

export const ManualActivation = {
  args: { tabs, activation: 'manual', idPrefix: 'm' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');

    await step('Focus moves but selection does not (manual mode)', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    });

    await step('Enter activates the focused tab', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });
  },
};
