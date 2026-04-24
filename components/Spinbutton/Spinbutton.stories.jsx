import { expect, userEvent, within } from '@storybook/test';
import Spinbutton from './Spinbutton';

export default {
  title: 'Components/Spinbutton',
  component: Spinbutton,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    min: 0,
    max: 10,
    step: 1,
    initialValue: 5,
    ariaLabel: 'Quantity',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    input.focus();

    await step('ArrowUp increments by step', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(input).toHaveAttribute('aria-valuenow', '6');
    });

    await step('ArrowDown decrements by step', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveAttribute('aria-valuenow', '5');
    });

    await step('Increment button bumps the value', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }));
      await expect(input).toHaveAttribute('aria-valuenow', '6');
    });
  },
};

export const LargeRange = {
  args: {
    min: 0,
    max: 1000,
    step: 10,
    initialValue: 100,
    ariaLabel: 'Amount',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    input.focus();
    await step('ArrowUp increments by step (10)', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(input).toHaveAttribute('aria-valuenow', '110');
    });
    await step('Home jumps to min', async () => {
      await userEvent.keyboard('{Home}');
      await expect(input).toHaveAttribute('aria-valuenow', '0');
    });
    await step('End jumps to max', async () => {
      await userEvent.keyboard('{End}');
      await expect(input).toHaveAttribute('aria-valuenow', '1000');
    });
  },
};
