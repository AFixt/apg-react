import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import { mount } from './mount';

const controls = ['Bold', 'Italic', 'Underline', 'Strikethrough'] as const;

type ControlName = (typeof controls)[number];

/**
 * Toolbar demo: a text-formatting toolbar with four toggle buttons.
 * `Toolbar` only provides roving-tabindex navigation, so the demo owns each
 * button's pressed state, matching how a real consumer would wire up
 * `aria-pressed` toggle controls.
 */
function ToolbarDemo(): React.ReactElement {
  const [pressed, setPressed] = useState<Record<ControlName, boolean>>({
    Bold: false,
    Italic: false,
    Underline: false,
    Strikethrough: false,
  });

  return (
    <main className="demo-page">
      <h1>Toolbar</h1>
      <Toolbar label="Formatting">
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

mount(<ToolbarDemo />);
