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
  // --- Regression coverage -------------------------------------------------

  describe('auto-rotation lifecycle (#150)', () => {
    test('keeps advancing past the first tick', async () => {
      render(<Carousel slides={slides} />);

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.getByText('Content 2')).toBeVisible();

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.getByText('Content 3')).toBeVisible();

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    test('does not report a user-initiated pause it invented itself', async () => {
      render(<Carousel slides={slides} />);

      await act(async () => {
        jest.advanceTimersByTime(6000);
      });

      // The timer advanced twice; the user touched nothing, so the control
      // must still offer to pause rather than to resume.
      expect(screen.getByLabelText(/pause rotation/i)).toBeInTheDocument();
    });
  });

  describe('hover pause (#161)', () => {
    test('hovering does not relabel the rotation control', async () => {
      render(<Carousel slides={slides} />);

      await act(async () => {
        fireEvent.mouseEnter(screen.getByRole('region'));
      });

      expect(screen.getByLabelText(/pause rotation/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/start rotation/i)).not.toBeInTheDocument();
    });

    test('rotation resumes when the pointer leaves', async () => {
      render(<Carousel slides={slides} />);
      const region = screen.getByRole('region');

      await act(async () => {
        fireEvent.mouseEnter(region);
      });
      await act(async () => {
        jest.advanceTimersByTime(6000);
      });
      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        fireEvent.mouseLeave(region);
      });
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    test('clicking the control while hovered pauses rather than starts', async () => {
      render(<Carousel slides={slides} />);
      const region = screen.getByRole('region');

      await act(async () => {
        fireEvent.mouseEnter(region);
      });

      const pause = screen.getByLabelText(/pause rotation/i);
      await act(async () => {
        pause.focus();
        fireEvent.click(pause);
      });

      expect(screen.getByLabelText(/start rotation/i)).toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseLeave(region);
      });
      await act(async () => {
        jest.advanceTimersByTime(6000);
      });
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });

  describe('focus entry (APG)', () => {
    test('focus entering the carousel stops rotation', async () => {
      render(<Carousel slides={slides} />);

      await act(async () => {
        screen.getByLabelText(/next/i).focus();
      });

      expect(screen.getByLabelText(/start rotation/i)).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(6000);
      });
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });

  describe('slide picker (#162)', () => {
    test('the picker for the displayed slide is aria-disabled', () => {
      render(<Carousel slides={slides} />);
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      expect(pickers[0]).toHaveAttribute('aria-disabled', 'true');
      expect(pickers[1]).not.toHaveAttribute('aria-disabled');
      expect(pickers[2]).not.toHaveAttribute('aria-disabled');
    });

    test('aria-disabled follows the displayed slide', async () => {
      render(<Carousel slides={slides} />);
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      await act(async () => {
        fireEvent.click(pickers[2]);
      });

      expect(pickers[2]).toHaveAttribute('aria-disabled', 'true');
      expect(pickers[0]).not.toHaveAttribute('aria-disabled');
    });

    test('activating the picker for the displayed slide is a no-op', async () => {
      render(<Carousel slides={slides} />);
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      // Stop rotation first so the assertion is about the picker alone.
      await act(async () => {
        fireEvent.click(screen.getByLabelText(/pause rotation/i));
      });
      await act(async () => {
        fireEvent.click(pickers[1]);
      });
      expect(screen.getByText('Content 2')).toBeVisible();

      await act(async () => {
        fireEvent.click(pickers[1]);
      });
      expect(screen.getByText('Content 2')).toBeVisible();
      expect(pickers[1]).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('control names (#234)', () => {
    /*
     * An audit of the demo page flagged the rotation control's glyph as a
     * visible label missing from its name (2.5.3 Label in Name) and as a
     * second labelling strategy beside the aria-label. The glyph is decoration,
     * so it is hidden from assistive technology the same way the previous/next
     * chevrons always were.
     *
     * The slide pickers are the deliberate exception: their digit is real
     * visible text, and hiding it would hide visible content from assistive
     * technology, so it stays exposed beside the aria-label. The label ends
     * with the digit, which is what keeps the visible label in the name.
     */
    test('the rotation control exposes its glyph only as decoration', () => {
      render(<Carousel slides={slides} />);
      const control = screen.getByRole('button', { name: 'Pause rotation' });
      const glyph = control.querySelector('[aria-hidden="true"]');
      expect(glyph).toHaveTextContent('\u2016');
      expect(
        Array.from(control.childNodes).filter(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '',
        ),
      ).toHaveLength(0);

      act(() => {
        fireEvent.click(control);
      });
      const paused = screen.getByRole('button', { name: 'Start rotation' });
      expect(paused.querySelector('[aria-hidden="true"]')).toHaveTextContent('\u25B6');
    });

    test('each slide picker keeps its digit as visible text and at the end of its name', () => {
      render(<Carousel slides={slides} />);
      const pickers = screen.getAllByRole('button', { name: /^Select slide \d$/ });
      expect(pickers).toHaveLength(slides.length);
      pickers.forEach((picker, index) => {
        const digit = String(index + 1);
        expect(picker.querySelector('[aria-hidden="true"]')).toBeNull();
        expect(picker).toHaveTextContent(digit);
        expect(picker.getAttribute('aria-label').endsWith(digit)).toBe(true);
      });
    });
  });
});
