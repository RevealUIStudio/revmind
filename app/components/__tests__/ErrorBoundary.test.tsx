import { LinkBehaviorProvider } from '@revealui/presentation';
import { Link, Router, RouterProvider } from '@revealui/router';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary, renderErrorCopy } from '@/components/ErrorBoundary';

describe('renderErrorCopy', () => {
  it('hides the thrown message outside development', () => {
    expect(renderErrorCopy(new Error('secret path /tmp/customer'), false)).toBe(
      'An unexpected error occurred. Please try again.',
    );
    expect(renderErrorCopy(new Error('secret path /tmp/customer'), true)).toBe(
      'secret path /tmp/customer',
    );
  });
});

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recovers when the reset control is used after the failure clears', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let crash = true;
    function Probe() {
      if (crash) throw new Error('boom');
      return <p>Recovered view</p>;
    }
    const router = new Router();

    render(
      <RouterProvider router={router}>
        <LinkBehaviorProvider component={Link} hrefProp="to">
          <ErrorBoundary resetKey="start">
            <Probe />
          </ErrorBoundary>
        </LinkBehaviorProvider>
      </RouterProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('boom');

    crash = false;
    fireEvent.click(screen.getByRole('link', { name: 'Return home' }));
    expect(screen.getByText('Recovered view')).toBeInTheDocument();
  });

  it('clears the fallback when resetKey changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let crash = true;
    function Probe() {
      if (crash) throw new Error('boom');
      return <p>Recovered view</p>;
    }
    const { rerender } = render(
      <ErrorBoundary resetKey="a">
        <Probe />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    crash = false;
    rerender(
      <ErrorBoundary resetKey="b">
        <Probe />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Recovered view')).toBeInTheDocument();
  });
});
