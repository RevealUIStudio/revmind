import { Router, RouterProvider } from '@revealui/router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';

function renderApp(path: string) {
  window.history.pushState({}, '', path);
  const router = new Router();
  router.initClient();
  return render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>,
  );
}

describe('NotFoundPage', () => {
  it('renders a 404 heading for unknown paths', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
  });
});
