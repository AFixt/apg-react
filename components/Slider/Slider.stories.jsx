import { expect, userEvent, within } from '@storybook/test';
import React from 'react';
import Slider from './Slider';

export default {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export const Horizontal = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    initialValue: 50,
    ariaLabel: 'Volume',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    slider.focus();

    await step('ArrowRight increments by step', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(slider).toHaveAttribute('aria-valuenow', '51');
    });

    await step('Home jumps to the minimum', async () => {
      await userEvent.keyboard('{Home}');
      await expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    await step('End jumps to the maximum', async () => {
      await userEvent.keyboard('{End}');
      await expect(slider).toHaveAttribute('aria-valuenow', '100');
    });
  },
};

export const Vertical = {
  args: {
    min: 0,
    max: 100,
    step: 5,
    initialValue: 25,
    isVertical: true,
    ariaLabel: 'Volume',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 200 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    slider.focus();
    await step('Has vertical orientation', async () => {
      await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
    await step('ArrowUp increments by step (5)', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(slider).toHaveAttribute('aria-valuenow', '30');
    });
    await step('ArrowDown decrements by step (5)', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(slider).toHaveAttribute('aria-valuenow', '25');
    });
  },
};
