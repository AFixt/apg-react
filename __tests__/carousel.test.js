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

  describe('non-looping variant (loop={false})', () => {
    /** The bounded carousel, with rotation off so assertions are about the controls alone. */
    const renderBounded = (props) =>
      render(<Carousel slides={slides} loop={false} initiallyRotating={false} {...props} />);

    test('looping is the default, so neither end control is disabled', () => {
      render(<Carousel slides={slides} initiallyRotating={false} />);

      expect(screen.getByLabelText(/previous/i)).not.toHaveAttribute('aria-disabled');
      expect(screen.getByLabelText(/next/i)).not.toHaveAttribute('aria-disabled');
    });

    test('Previous is aria-disabled at the first slide and enabled once away from it', async () => {
      renderBounded();
      const prev = screen.getByLabelText(/previous/i);
      const next = screen.getByLabelText(/next/i);

      expect(prev).toHaveAttribute('aria-disabled', 'true');
      // Only the end the carousel is sitting on is disabled.
      expect(next).not.toHaveAttribute('aria-disabled');

      await act(async () => {
        fireEvent.click(next);
      });
      expect(prev).not.toHaveAttribute('aria-disabled');
    });

    test('activating Previous at the first slide is a no-op', async () => {
      renderBounded();
      const prev = screen.getByLabelText(/previous/i);

      await act(async () => {
        fireEvent.click(prev);
      });

      // Still on slide 1 rather than wrapped round to the last slide.
      expect(screen.getByText('Content 1')).toBeVisible();
      expect(prev).toHaveAttribute('aria-disabled', 'true');
    });

    test('Next is aria-disabled at the last slide and activating it is a no-op', async () => {
      renderBounded();
      const next = screen.getByLabelText(/next/i);
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      await act(async () => {
        fireEvent.click(pickers[slides.length - 1]);
      });
      expect(next).toHaveAttribute('aria-disabled', 'true');

      await act(async () => {
        fireEvent.click(next);
      });
      expect(screen.getByText(`Content ${slides.length}`)).toBeVisible();
    });

    test('auto-rotation stops at the last slide instead of starting over', async () => {
      render(<Carousel slides={slides} loop={false} />);

      // Three slides, so two ticks reach the end; a third would wrap if it looped.
      await act(async () => {
        jest.advanceTimersByTime(9000);
      });

      expect(screen.getByText(`Content ${slides.length}`)).toBeVisible();
      expect(screen.getByLabelText(/start rotation/i)).toBeInTheDocument();
      // ...and says it cannot start again, rather than offering a lap it has
      // no slides left for.
      expect(screen.getByLabelText(/start rotation/i)).toHaveAttribute('aria-disabled', 'true');
    });

    test('the rotation control is aria-disabled at the last slide and activating it is a no-op', async () => {
      renderBounded();
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      await act(async () => {
        fireEvent.click(pickers[slides.length - 1]);
      });

      const rotation = screen.getByLabelText(/start rotation/i);
      expect(rotation).toHaveAttribute('aria-disabled', 'true');
      // Still focusable, so a keyboard user can reach it and find out why.
      expect(rotation).not.toBeDisabled();

      await act(async () => {
        fireEvent.click(rotation);
      });

      // Nothing happened at all: not even the relabel to "Pause rotation" that
      // a control which had actually started rotating would show.
      expect(screen.getByLabelText(/start rotation/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/pause rotation/i)).not.toBeInTheDocument();
      expect(screen.getByText(`Content ${slides.length}`)).toBeVisible();
    });

    test('activating it does not even transiently report the carousel as rotating', async () => {
      renderBounded();
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      await act(async () => {
        fireEvent.click(pickers[slides.length - 1]);
      });

      // Settling back to "start" is not enough. Without the guard in
      // `toggleRotation` the control starts rotating, the stop-at-the-end
      // effect immediately undoes it, and the accessible name flips to "Pause"
      // and back within the one click -- a state change a screen reader can
      // announce for a state the carousel never actually entered. Only
      // watching the attribute as it changes can tell the two apart; asserting
      // after the fact cannot, because both end in the same place.
      const rotation = screen.getByLabelText(/start rotation/i);
      const namesSeen = [rotation.getAttribute('aria-label')];
      const observer = new MutationObserver(() =>
        namesSeen.push(rotation.getAttribute('aria-label')),
      );
      observer.observe(rotation, { attributes: true, attributeFilter: ['aria-label'] });

      await act(async () => {
        fireEvent.click(rotation);
      });
      observer.disconnect();

      expect(namesSeen).toEqual(['Start rotation']);
    });

    test('the rotation control is never disabled when the carousel loops', async () => {
      render(<Carousel slides={slides} initiallyRotating={false} />);
      const pickers = screen.getAllByRole('button', { name: /select slide/i });

      await act(async () => {
        fireEvent.click(pickers[slides.length - 1]);
      });

      const rotation = screen.getByLabelText(/start rotation/i);
      expect(rotation).not.toHaveAttribute('aria-disabled');

      await act(async () => {
        fireEvent.click(rotation);
      });
      expect(screen.getByLabelText(/pause rotation/i)).toBeInTheDocument();
    });
  });

  describe('slide status (showSlideStatus)', () => {
    test('is absent by default', () => {
      render(<Carousel slides={slides} initiallyRotating={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.queryByText(/slide 1 of 3/i)).not.toBeInTheDocument();
    });

    test('reports the current slide and tracks navigation', async () => {
      render(<Carousel slides={slides} showSlideStatus initiallyRotating={false} />);

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('Slide 1 of 3');

      await act(async () => {
        fireEvent.click(screen.getByLabelText(/next/i));
      });
      expect(status).toHaveTextContent('Slide 2 of 3');
    });

    test('honours a supplied slideStatus label', () => {
      render(
        <Carousel
          slides={slides}
          showSlideStatus
          initiallyRotating={false}
          labels={{ slideStatus: (current, total) => `${current}/${total}` }}
        />,
      );

      expect(screen.getByRole('status')).toHaveTextContent('1/3');
    });
  });
});
