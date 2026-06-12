import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InteractiveModelController } from './InteractiveModelController';

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-controls">{children}</div>
  ),
}));

describe('InteractiveModelController', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders persistent visual indicators and keyboard control surface', () => {
    render(
      <InteractiveModelController ariaLabel="Interactive portfolio model">
        <mesh data-testid="model-mesh" />
      </InteractiveModelController>
    );

    expect(screen.getByTestId('interactive-model-indicators')).toBeInTheDocument();
    expect(screen.getByTestId('interactive-model-keyboard-controls')).toHaveAttribute(
      'aria-label',
      'Interactive portfolio model'
    );
  });

  it('supports keyboard rotation and scale controls while focused', () => {
    const onTransformChange = vi.fn();

    render(
      <InteractiveModelController
        ariaLabel="Interactive portfolio model"
        onTransformChange={onTransformChange}
      >
        <mesh />
      </InteractiveModelController>
    );

    const controls = screen.getByTestId('interactive-model-keyboard-controls');
    fireEvent.focus(controls);
    fireEvent.keyDown(controls, { key: 'ArrowRight' });
    fireEvent.keyDown(controls, { key: '+' });

    expect(onTransformChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rotationY: expect.any(Number),
      })
    );
    expect(onTransformChange).toHaveBeenCalledWith(
      expect.objectContaining({
        scale: 1.1,
      })
    );
  });

  it('traps Tab while active and exits controls with Escape', () => {
    render(
      <InteractiveModelController ariaLabel="Interactive portfolio model">
        <mesh />
      </InteractiveModelController>
    );

    const controls = screen.getByTestId('interactive-model-keyboard-controls');
    fireEvent.focus(controls);

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    controls.dispatchEvent(tabEvent);

    expect(tabEvent.defaultPrevented).toBe(true);

    fireEvent.keyDown(controls, { key: 'Escape' });

    const secondTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    controls.dispatchEvent(secondTabEvent);

    expect(secondTabEvent.defaultPrevented).toBe(false);
  });
});
