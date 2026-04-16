import React from 'react';
import Breadcrumb from './Breadcrumb';

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    items: [
      { path: '/', label: 'Home' },
      { path: '/library', label: 'Library' },
      { path: '/library/data', label: 'Data' },
      { path: '/library/data/reports', label: 'Reports' },
    ],
  },
};

export const TwoLevels = {
  args: {
    items: [
      { path: '/', label: 'Home' },
      { path: '/settings', label: 'Settings' },
    ],
  },
};
