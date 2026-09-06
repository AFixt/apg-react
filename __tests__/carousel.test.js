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

  describe('rotation across a changing slide count (#240)', () => {
    /*
     * The rotation effect depends on `slides.length` as well as on whether it
     * is rotating at all. Depending only on the latter would hold one interval
     * across a change in length: `advance` would keep the `slides.length` it
     * closed over, and on a shorter array it steps `activeIndex` past the end,
     * where every slide is `hidden` and the carousel renders blank.
     */
    const five = [
      ...slides,
      { id: 'slide4', label: 'Slide 4', content: <div>Content 4</div> },
      { id: 'slide5', label: 'Slide 5', content: <div>Content 5</div> },
    ];

    const visibleSlides = (container) =>
      Array.from(container.querySelectorAll('[aria-roledescription="slide"]')).filter(
        (el) => !el.hasAttribute('hidden'),
      );

    test('keeps exactly one slide visible when the count grows mid-rotation', async () => {
      const { container, rerender } = render(<Carousel slides={slides} showSlideStatus />);

      rerender(<Carousel slides={five} showSlideStatus />);

      for (let tick = 0; tick < 4; tick += 1) {
        await act(async () => {
          jest.advanceTimersByTime(3000);
        });
        expect(visibleSlides(container)).toHaveLength(1);
      }
      expect(screen.getByRole('status')).toHaveTextContent('Slide 5 of 5');
    });

    test('keeps exactly one slide visible when the count shrinks mid-rotation', async () => {
      const { container, rerender } = render(<Carousel slides={five} showSlideStatus />);

      await act(async () => {
        jest.advanceTimersByTime(6000);
      });
      rerender(<Carousel slides={slides} showSlideStatus />);

      for (let tick = 0; tick < 3; tick += 1) {
        await act(async () => {
          jest.advanceTimersByTime(3000);
        });
        expect(visibleSlides(container)).toHaveLength(1);
      }
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

    describe('live-region politeness follows the rotation state (#233)', () => {
      /*
       * The decision this pins: a slide change is either something the user
       * asked for or something the timer did, and only the first should be
       * announced. Permanently polite interrupts a screen-reader user every few
       * seconds on an auto-rotating carousel; permanently off silences the
       * status exactly when the user is the one navigating.
       */
      test('is off while auto-rotation is running', () => {
        render(<Carousel slides={slides} showSlideStatus />);

        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
      });

      test('is polite when the carousel is not rotating', () => {
        render(<Carousel slides={slides} showSlideStatus initiallyRotating={false} />);

        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      });

      test('a timer-driven advance leaves it off, so nothing is announced', async () => {
        render(<Carousel slides={slides} showSlideStatus />);
        const status = screen.getByRole('status');
        expect(status).toHaveTextContent('Slide 1 of 3');

        await act(async () => {
          jest.advanceTimersByTime(3000);
        });

        expect(status).toHaveTextContent('Slide 2 of 3');
        expect(status).toHaveAttribute('aria-live', 'off');
      });

      test('turns polite in the same update that a user-initiated change lands', async () => {
        render(<Carousel slides={slides} showSlideStatus />);
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'off');

        await act(async () => {
          fireEvent.click(screen.getByLabelText(/next/i));
        });

        // Both in one commit: the region is already polite in the DOM by the
        // time the new text is there to be announced.
        expect(status).toHaveTextContent('Slide 2 of 3');
        expect(status).toHaveAttribute('aria-live', 'polite');
      });

      test('pausing rotation makes it polite without changing the slide', () => {
        render(<Carousel slides={slides} showSlideStatus />);
        const status = screen.getByRole('status');

        act(() => {
          fireEvent.click(screen.getByLabelText(/pause rotation/i));
        });

        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toHaveTextContent('Slide 1 of 3');
      });

      test('resuming rotation returns it to off', () => {
        render(<Carousel slides={slides} showSlideStatus initiallyRotating={false} />);
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'polite');

        act(() => {
          fireEvent.click(screen.getByLabelText(/start rotation/i));
        });

        expect(status).toHaveAttribute('aria-live', 'off');
      });

      test('focus entering the carousel makes it polite before the user navigates', async () => {
        render(<Carousel slides={slides} showSlideStatus />);
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'off');

        await act(async () => {
          screen.getByLabelText(/next/i).focus();
        });

        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toHaveTextContent('Slide 1 of 3');
      });

      test('a pointer resting on the carousel makes it polite', () => {
        /*
         * Hover tears the interval down, so no timer-driven change can happen
         * while the pointer is held -- and a click made without moving that
         * pointer is still the user driving. Both make `polite` the right
         * state, so the hover term in `isAutoRotating` is load-bearing here
         * and not just in the effect.
         */
        const { container } = render(<Carousel slides={slides} showSlideStatus />);
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'off');

        act(() => {
          fireEvent.mouseEnter(container.querySelector('.carousel'));
        });

        expect(status).toHaveAttribute('aria-live', 'polite');
        expect(status).toHaveTextContent('Slide 1 of 3');
      });

      test('a single-slide carousel is polite, since no timer can run', () => {
        render(<Carousel slides={[slides[0]]} showSlideStatus />);

        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      });
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
