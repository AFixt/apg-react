import { expect, userEvent, within } from '@storybook/test';
import CheckboxGroup from './CheckboxGroup';

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    label: 'Notification preferences',
    items: [
      { id: '1', label: 'Email notifications' },
      { id: '2', label: 'SMS notifications' },
      { id: '3', label: 'Push notifications' },
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('checkbox', { name: 'All' });
    const email = canvas.getByRole('checkbox', { name: 'Email notifications' });
    const sms = canvas.getByRole('checkbox', { name: 'SMS notifications' });

    await step('Checking one child puts parent in mixed state', async () => {
      await userEvent.click(email);
      await expect(parent).toHaveAttribute('aria-checked', 'mixed');
      await expect(parent.indeterminate).toBe(true);
    });

    await step('Clicking parent in mixed state checks all children', async () => {
      await userEvent.click(parent);
      await expect(email).toBeChecked();
      await expect(sms).toBeChecked();
    });

    await step('Clicking parent when all checked unchecks every child', async () => {
      await userEvent.click(parent);
      await expect(email).not.toBeChecked();
      await expect(sms).not.toBeChecked();
    });
  },
};
