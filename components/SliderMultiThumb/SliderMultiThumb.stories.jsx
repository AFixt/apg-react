import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import SliderMultiThumb from './SliderMultiThumb';

export default {
  title: 'Components/SliderMultiThumb',
  component: SliderMultiThumb,
  tags: ['autodocs'],
};

export const PriceRange = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    initialLow: 20,
    initialHigh: 80,
    labelLow: 'Minimum price',
    labelHigh: 'Maximum price',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sliders = canvas.getAllByRole('slider');

    await step('Two sliders rendered with distinct labels', async () => {
      await expect(sliders).toHaveLength(2);
      await expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum price');
      await expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum price');
    });

    await step('Low thumb cannot exceed high thumb', async () => {
      await expect(sliders[0]).toHaveAttribute('aria-valuemax', '80');
      await expect(sliders[1]).toHaveAttribute('aria-valuemin', '20');
    });

    await step('ArrowRight on low thumb increments it', async () => {
      sliders[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(sliders[0]).toHaveAttribute('aria-valuenow', '21');
    });

    await step('Low thumb constrained by high thumb value', async () => {
      await userEvent.keyboard('{End}');
      await expect(sliders[0]).toHaveAttribute('aria-valuenow', '80');
    });
  },
};
