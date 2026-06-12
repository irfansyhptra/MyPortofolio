import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WebGLCanvas } from './WebGLCanvas';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="r3f-canvas">
      {children}
    </div>
  ),
}));

describe('WebGLCanvas', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders an accessible React Three Fiber canvas wrapper when WebGL is supported', () => {
    render(
      <WebGLCanvas webglSupported ariaLabel="Interactive project model">
        <span>Scene content</span>
      </WebGLCanvas>
    );

    expect(screen.getByRole('img', { name: 'Interactive project model' })).toBeInTheDocument();
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
    expect(screen.getByText('Scene content')).toBeInTheDocument();
  });

  it('shows a loading indicator only after initialization exceeds 2000ms', () => {
    vi.useFakeTimers();

    render(
      <WebGLCanvas webglSupported ariaLabel="Interactive project model">
        <span>Scene content</span>
      </WebGLCanvas>
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2001);
    });

    expect(screen.getByRole('status')).toHaveTextContent('Loading 3D scene');
  });

  it('displays static fallback content when WebGL is unavailable', () => {
    render(
      <WebGLCanvas
        webglSupported={false}
        ariaLabel="Interactive project model"
        fallbackSrc="/assets/projects/portfolio.svg"
        fallbackAlt="Static preview of the interactive project model"
      >
        <span>Scene content</span>
      </WebGLCanvas>
    );

    expect(
      screen.getByRole('img', { name: 'Static preview of the interactive project model' })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Static preview of the interactive project model')
    ).toHaveAttribute('src', '/assets/projects/portfolio.svg');
    expect(screen.queryByText('Scene content')).not.toBeInTheDocument();
  });

  it('falls back and logs an error after initialization exceeds 5000ms', () => {
    vi.useFakeTimers();
    const onFallback = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <WebGLCanvas
        webglSupported
        ariaLabel="Interactive project model"
        fallbackAlt="Static fallback for the project model"
        onFallback={onFallback}
      >
        <span>Scene content</span>
      </WebGLCanvas>
    );

    act(() => {
      vi.advanceTimersByTime(5001);
    });

    expect(screen.getByTestId('webgl-fallback')).toHaveTextContent(
      'Static fallback for the project model'
    );
    expect(onFallback).toHaveBeenCalledWith('timeout');
    expect(consoleError).toHaveBeenCalledWith('WebGL initialization timed out');
  });
});
