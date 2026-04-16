import React from 'react';
import Meter from './Meter';

export default {
  title: 'Components/Meter',
  component: Meter,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

export const Default = {
  args: {
    value: 72,
    label: 'Disk usage',
  },
};

export const Low = {
  args: {
    value: 15,
    label: 'Battery level',
  },
};

export const WithCustomRange = {
  args: {
    value: 7,
    minValue: 0,
    maxValue: 10,
    label: 'Satisfaction score',
  },
};
