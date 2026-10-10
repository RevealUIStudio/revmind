import { Router, RouterProvider } from '@revealui/router';
import { type RenderResult, render } from '@testing-library/react';
import { App } from '@/App';

let activeRouter: Router | undefined;

/**
 * Each test gets its own router. The published client router installs document
 * listeners once per page, so the previous instance has to be disposed or
 * later clicks navigate a router that is no longer mounted.
 */
export function renderApp(path = '/'): RenderResult {
  activeRouter?.dispose();
  activeRouter = undefined;
  window.history.pushState({}, '', path);
  const router = new Router();
  globalThis.__revealui_router_initialized = false;
  router.initClient();
  activeRouter = router;
  return render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>,
  );
}
