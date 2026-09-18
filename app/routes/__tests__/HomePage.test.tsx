import { Router, RouterProvider } from '@revealui/router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';
import { DIAGRAM_HONESTY, PRODUCT_NAME } from '@/lib/honesty';

function renderApp(path = '/') {
  window.history.pushState({}, '', path);
  const router = new Router();
  router.initClient();
  return render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>,
  );
}

describe('HomePage', () => {
  it('names the product RevMind and keeps the honesty line', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: PRODUCT_NAME })).toBeInTheDocument();
    expect(screen.getByText(DIAGRAM_HONESTY)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /RevMind architecture from your knowledge graph/ }),
    ).toBeInTheDocument();
  });
});
