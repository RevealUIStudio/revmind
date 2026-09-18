import { LinkBehaviorProvider } from '@revealui/presentation';
import { Routes, useRouter } from '@revealui/router';
import { useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './routes/HomePage';
import { NotFoundPage } from './routes/NotFoundPage';

export function App() {
  const router = useRouter();
  const registered = useRef(false);

  if (!registered.current && router.getRoutes().length === 0) {
    router.registerRoutes([
      {
        path: '/',
        component: HomePage,
        meta: {
          title: 'RevMind | architecture from your knowledge graph',
          description:
            'RevMind — architecture from your knowledge graph. A RevealFleet product. Not a public Architecture SKU.',
        },
      },
      {
        path: '*',
        component: NotFoundPage,
        meta: {
          title: 'Not found | RevMind',
          description: 'That page is not in RevMind.',
          robots: 'noindex,follow',
        },
      },
    ]);
    registered.current = true;
  }

  return (
    <ErrorBoundary>
      <LinkBehaviorProvider>
        <RootLayout>
          <Routes />
        </RootLayout>
      </LinkBehaviorProvider>
    </ErrorBoundary>
  );
}
