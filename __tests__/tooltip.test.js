import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from '../components/Tooltip/Tooltip';

describe('Tooltip Component', () => {
    const text = 'Tooltip Information';
    const title = 'Hover or Focus Me';
    const tooltipContent = <button>{title}</button>;

    test('Displaying Tooltip on Focus or Hover', async () => {
        render(<Tooltip text={text}>{tooltipContent}</Tooltip>);

        const triggerElement = screen.getByText(title);
        fireEvent.mouseEnter(triggerElement);

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toHaveTextContent(text);
        });

        fireEvent.mouseLeave(triggerElement);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    test('Hiding Tooltip on Focus Loss or Pointer Exit', async () => {
        render(<Tooltip text={text}>{tooltipContent}</Tooltip>);

        const triggerElement = screen.getByText(title);
        fireEvent.mouseEnter(triggerElement);

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        fireEvent.mouseLeave(triggerElement);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    test('Closing Tooltip with Escape Key', async () => {
        render(<Tooltip text={text}>{tooltipContent}</Tooltip>);

        const triggerElement = screen.getByText(title);
        fireEvent.focus(triggerElement);
        fireEvent.keyDown(triggerElement, { key: 'Escape' });

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });

    test('Tooltip Visibility and Positioning', () => {
        render(<Tooltip text={text} position="bottom">{tooltipContent}</Tooltip>);

        const triggerElement = screen.getByText(title);
        fireEvent.mouseEnter(triggerElement);

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle('position: bottom');
    });

    // Add snapshot test if necessary
    test('Tooltip snapshot', () => {
        const { asFragment } = render(<Tooltip text={text}>{tooltipContent}</Tooltip>);
        expect(asFragment()).toMatchSnapshot();
    });
});
