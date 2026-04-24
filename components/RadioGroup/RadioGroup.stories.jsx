import { expect, userEvent, within } from '@storybook/test';
import RadioGroup from './RadioGroup';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
};

const options = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notification' },
];

export const Default = {
  args: {
    label: 'Preferred contact method',
    name: 'contact',
    options,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');

    await step('First radio is focusable (roving tabindex)', async () => {
      await expect(radios[0]).toHaveAttribute('tabindex', '0');
      await expect(radios[1]).toHaveAttribute('tabindex', '-1');
    });

    await step('ArrowDown moves selection to the next radio', async () => {
      radios[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'true');
    });

    await step('End moves selection to the last radio', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('radio');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-checked', 'true');
    });
  },
};
