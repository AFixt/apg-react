import React from 'react';
import WindowSplitter from '../../components/WindowSplitter/WindowSplitter';
import { mount } from './mount';

/**
 * Window Splitter demo: two side-by-side panes with a moveable separator.
 *
 * The separator is the widget: it is the tab stop, it carries the value, and
 * every resize is reachable from the keyboard. Left/Right move it, Home and End
 * jump to the extremes, and Enter collapses the primary pane or restores it to
 * the size it had before.
 *
 * Addressed by `apg-qa` as `window_splitter_url`, which was a 404 until this
 * page existed.
 */
function WindowSplitterDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Window Splitter</h1>
      <WindowSplitter
        label="Resize panes"
        min={10}
        max={90}
        primary={
          <>
            <h2>Navigation</h2>
            <p>The primary pane. Its width is what the separator reports.</p>
          </>
        }
        secondary={
          <>
            <h2>Content</h2>
            <p>The secondary pane takes whatever room is left.</p>
          </>
        }
      />
    </main>
  );
}

mount(<WindowSplitterDemo />);
