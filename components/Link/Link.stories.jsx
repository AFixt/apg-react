import React from 'react';
import { fn } from '@storybook/test';
import Link from './Link';

export default {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    to: '/destination',
    children: 'Go to destination',
  },
};

export const WithOnClick = {
  args: {
    to: '/profile',
    onClick: fn(),
    children: 'View profile',
  },
};
