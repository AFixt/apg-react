import { expect, userEvent, within } from '@storybook/test';
import LayoutGrid from './LayoutGrid';

export default {
  title: 'Components/LayoutGrid',
  component: LayoutGrid,
  tags: ['autodocs'],
};

const items = [
  { label: 'Accordion', href: '#accordion' },
  { label: 'Breadcrumb', href: '#breadcrumb' },
  { label: 'Carousel', href: '#carousel' },
  { label: 'Combobox', href: '#combobox' },
  { label: 'Disclosure', href: '#disclosure' },
  { label: 'Feed', href: '#feed' },
  { label: 'Listbox', href: '#listbox' },
  { label: 'Menubar', href: '#menubar' },
  { label: 'Slider', href: '#slider' },
];

export const Default = {
  args: {
    label: 'Browse the pattern demos',
    items,
    columns: 3,
    pageSize: 2,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = (name) => canvas.getByRole('link', { name });

    await step('the grid is a single tab stop', async () => {
      const first = link('Accordion');
      expect(first).toHaveAttribute('tabindex', '0');
      expect(link('Breadcrumb')).toHaveAttribute('tabindex', '-1');
    });

    await step('arrow keys move between cells', async () => {
      link('Accordion').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(link('Breadcrumb')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(link('Disclosure')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(link('Combobox')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(link('Accordion')).toHaveFocus();
    });

    await step('Home and End stay within the row', async () => {
      link('Disclosure').focus();
      await userEvent.keyboard('{End}');
      expect(link('Feed')).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(link('Combobox')).toHaveFocus();
    });

    await step('Control+Home and Control+End span the grid (APG-optional here)', async () => {
      link('Disclosure').focus();
      await userEvent.keyboard('{Control>}{End}{/Control}');
      expect(link('Slider')).toHaveFocus();
      await userEvent.keyboard('{Control>}{Home}{/Control}');
      expect(link('Accordion')).toHaveFocus();
    });
  },
};
