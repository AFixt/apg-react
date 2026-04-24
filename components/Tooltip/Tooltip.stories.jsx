import { expect, userEvent, waitFor, within } from '@storybook/test';
import React from 'react';
import Tooltip from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
};

const Template = (args) => (
  <div style={{ padding: '3rem', display: 'inline-block' }}>
    <Tooltip {...args}>
      <button>Hover or focus me</button>
    </Tooltip>
  </div>
);

const positionPlay =
  (expectedPosition) =>
  async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /hover or focus me/i });
    await step(`Hovering shows the tooltip with data-position="${expectedPosition}"`, async () => {
      await userEvent.hover(trigger);
      await waitFor(async () => {
        const tip = canvas.getByRole('tooltip');
        await expect(tip).toHaveTextContent(args.text);
        await expect(tip).toHaveAttribute('data-position', expectedPosition);
      });
    });
    await step('Unhovering hides the tooltip', async () => {
      await userEvent.unhover(trigger);
      await waitFor(() => {
        expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  };

export const Top = {
  render: Template,
  args: {
    text: 'Tooltip on top',
    position: 'top',
  },
  play: positionPlay('top'),
};

export const Right = {
  render: Template,
  args: {
    text: 'Tooltip on right',
    position: 'right',
  },
  play: positionPlay('right'),
};

export const Bottom = {
  render: Template,
  args: {
    text: 'Tooltip on bottom',
    position: 'bottom',
  },
  play: positionPlay('bottom'),
};

export const Left = {
  render: Template,
  args: {
    text: 'Tooltip on left',
    position: 'left',
  },
  play: positionPlay('left'),
};
