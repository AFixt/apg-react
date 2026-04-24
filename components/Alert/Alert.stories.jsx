import { expect, within } from '@storybook/test';
import Alert from './Alert';

export default {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['info', 'warning', 'error'],
    },
  },
};

const alertPlay =
  (expectedClass) =>
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Has role=alert with correct variant class', async () => {
      const alert = canvas.getByRole('alert');
      await expect(alert).toHaveClass(expectedClass);
      await expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
    await step('Dismiss button is present with accessible name', async () => {
      const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
      await expect(dismiss).toBeInTheDocument();
    });
    // NOTE: we intentionally do NOT click dismiss; doing so unmounts the alert
    // and leaves the Storybook canvas blank after the play completes.
  };

export const Info = {
  args: {
    type: 'info',
    message: 'This is an informational message.',
  },
  play: alertPlay('alert-info'),
};

export const Warning = {
  args: {
    type: 'warning',
    message: 'This is a warning — proceed with caution.',
  },
  play: alertPlay('alert-warning'),
};

export const Error = {
  args: {
    type: 'error',
    message: 'Something went wrong. Please try again.',
  },
  play: alertPlay('alert-error'),
};
