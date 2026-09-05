import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import { mount } from './mount';

const controls = ['Bold', 'Italic', 'Underline', 'Strikethrough'] as const;

type ControlName = (typeof controls)[number];

/**
 * Toolbar demo, disabled-control state.
 *
 * Same four toggle buttons as `toolbar.html`, but "Strikethrough" carries
 * `aria-disabled="true"`. `Toolbar` skips an `aria-disabled` item when roving
 * focus moves, so Right Arrow from Underline wraps to Bold, `End` lands on
 * Underline, and activating Strikethrough is a no-op.
 *
 * This cannot be a second state of `toolbar.html`. `toolbar-keyboard-nav`
 * presses `End` and expects focus on Strikethrough, which a skipped
 * Strikethrough breaks; and a fifth, disabled control after it is no better,
 * because the six runner repos assert the page's roving tabindex as a
 * four-element array (`['0', '-1', '-1', '-1']`) and read the toolbar's
 * buttons by position (`:nth-child(4)`), so any extra button breaks them.
 * See `demos/README.md`.
 *
 * Addressed by `apg-qa` as `toolbar_disabled_url`.
 */
function ToolbarDisabledDemo(): React.ReactElement {
  const [pressed, setPressed] = useState<Record<ControlName, boolean>>({
    Bold: false,
    Italic: false,
    Underline: false,
    Strikethrough: false,
  });

  return (
    <main className="demo-page">
      <h1>Toolbar — disabled control</h1>
      <Toolbar label="Formatting">
        {controls.map((name) => {
          const isDisabled = name === 'Strikethrough';
          return (
            <button
              key={name}
              type="button"
              aria-pressed={pressed[name]}
              aria-disabled={isDisabled || undefined}
              onClick={() => {
                if (isDisabled) return;
                setPressed((current) => ({ ...current, [name]: !current[name] }));
              }}
            >
              {name}
            </button>
          );
        })}
      </Toolbar>
    </main>
  );
}

mount(<ToolbarDisabledDemo />);
