import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import { mount } from './mount';

const controls = ['Bold', 'Italic', 'Underline', 'Strikethrough'] as const;

type ControlName = (typeof controls)[number];

/**
 * Toolbar demo, vertical state.
 *
 * `Toolbar` binds one axis per orientation, so the vertical variant needs its
 * own page: the default toolbar must stay horizontal for
 * `toolbar-keyboard-nav`'s Left/Right roving, and Up/Down only move focus once
 * `orientation="vertical"` is set.
 *
 * No component change was needed -- `Toolbar` already takes `orientation` and
 * already binds Up/Down for it.
 *
 * Addressed by `apg-qa` as `toolbar_vertical_url`.
 */
function ToolbarVerticalDemo(): React.ReactElement {
  const [pressed, setPressed] = useState<Record<ControlName, boolean>>({
    Bold: false,
    Italic: false,
    Underline: false,
    Strikethrough: false,
  });

  return (
    <main className="demo-page">
      <h1>Toolbar — vertical</h1>
      <Toolbar label="Formatting" orientation="vertical">
        {controls.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={pressed[name]}
            onClick={() => setPressed((current) => ({ ...current, [name]: !current[name] }))}
          >
            {name}
          </button>
        ))}
      </Toolbar>
    </main>
  );
}

mount(<ToolbarVerticalDemo />);
