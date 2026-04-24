import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Carousel from '../components/Carousel/Carousel';

describe('Carousel Component', () => {
  const slides = [
    { id: 'slide1', label: 'Slide 1', content: <div>Content 1</div> },
    { id: 'slide2', label: 'Slide 2', content: <div>Content 2</div> },
    { id: 'slide3', label: 'Slide 3', content: <div>Content 3</div> },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Carousel Initial Render Snapshot', () => {
    const { asFragment } = render(<Carousel slides={slides} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Carousel Snapshot After Navigation', () => {
    const { asFragment } = render(<Carousel slides={slides} />);
    const nextButton = screen.getByLabelText(/next/i);

    act(() => {
      fireEvent.click(nextButton);
    });

    expect(asFragment()).toMatchSnapshot();
  });

  test('Controlling Carousel Slide Rotation', () => {
    render(<Carousel slides={slides} />);
    let rotationButton = screen.getByLabelText(/pause rotation/i);
    fireEvent.click(rotationButton);
    rotationButton = screen.getByLabelText(/start rotation/i);
    expect(rotationButton).toBeInTheDocument();
    fireEvent.click(rotationButton);
    expect(screen.getByLabelText(/pause rotation/i)).toBeInTheDocument();
  });

  test('Navigating to Next and Previous Slides', () => {
    render(<Carousel slides={slides} />);
    const nextButton = screen.getByLabelText(/next/i);
    const prevButton = screen.getByLabelText(/prev/i);

    act(() => {
      fireEvent.click(nextButton);
    });
    expect(screen.getByText('Content 2')).toBeVisible();

    act(() => {
      fireEvent.click(prevButton);
    });
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  test('Keyboard Interaction with Carousel', () => {
    render(<Carousel slides={slides} />);
    const carousel = screen.getByRole('region');
    carousel.focus();

    act(() => {
      fireEvent.keyDown(carousel, { key: 'Tab' });
    });
  });

  test('ARIA Roles, States, and Properties of Carousel Elements', () => {
    render(<Carousel slides={slides} />);
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');

    slides.forEach((slide, index) => {
      const slideElement = screen.getByText(`Content ${index + 1}`);
      expect(slideElement.parentElement).toHaveAttribute('aria-roledescription', 'slide');
      expect(slideElement.parentElement).toHaveAttribute('aria-label', slides[index].label);
    });
  });

  test('Selecting a Specific Slide', () => {
    render(<Carousel slides={slides} />);
    slides.forEach((_, index) => {
      const pickerButton = screen.getAllByRole('button', {
        name: /select slide/i,
      })[index];
      fireEvent.click(pickerButton);
      expect(screen.getByText(slides[index].content.props.children)).toBeVisible();
      expect(pickerButton).toHaveAttribute('aria-current', 'true');
    });
  });

  test('Automatic Rotation Control', async () => {
    render(<Carousel slides={slides} />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Content 2')).toBeVisible();

    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole('region'));
    });
    expect(screen.getByText('Content 2')).toBeVisible(); // Assert rotation has stopped
  });
});
