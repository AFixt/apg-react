import { expect, within } from '@storybook/test';
import Progressbar from './Progressbar';

export default {
  title: 'Components/Progressbar',
  component: Progressbar,
  tags: ['autodocs'],
};

export const Determinate = {
  args: { value: 65, label: 'Upload progress' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Has role=progressbar with aria-valuenow', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).toHaveAttribute('aria-valuenow', '65');
      await expect(pb).toHaveAttribute('aria-valuemin', '0');
      await expect(pb).toHaveAttribute('aria-valuemax', '100');
    });
  },
};

export const Indeterminate = {
  args: { label: 'Loading' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Indeterminate progressbar omits aria-valuenow', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).not.toHaveAttribute('aria-valuenow');
    });
  },
};

export const WithValueText = {
  args: { value: 3, min: 0, max: 10, label: 'Steps completed', valueText: '3 of 10 steps' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('aria-valuetext overrides numeric announcement', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).toHaveAttribute('aria-valuetext', '3 of 10 steps');
    });
  },
};
