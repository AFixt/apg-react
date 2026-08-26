import WindowSplitter from './WindowSplitter';

export default {
  title: 'Components/WindowSplitter',
  component: WindowSplitter,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    defaultValue: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

const panes = {
  primary: 'Primary pane. Use the separator to resize it.',
  secondary: 'Secondary pane. It takes whatever room is left.',
};

export const Default = {
  args: {
    label: 'Resize panes',
    ...panes,
  },
};

export const Horizontal = {
  args: {
    label: 'Resize panes',
    orientation: 'horizontal',
    ...panes,
  },
};

export const Constrained = {
  args: {
    label: 'Resize panes',
    min: 20,
    max: 80,
    defaultValue: 40,
    ...panes,
  },
};
