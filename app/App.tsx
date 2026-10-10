import { LinkBehaviorProvider } from '@revealui/presentation';
import { Link, Routes, useLocation, useRouter } from '@revealui/router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RootLayout } from './layouts/RootLayout';
import { PAGE_DESCRIPTION } from './lib/honesty';
import { HomePage } from './routes/HomePage';
import { NotFoundPage } from './routes/NotFoundPage';

export function App() {
  const router = useRouter();
  const { pathname } = useLocation();

  if (!router.getRoutes().some((route) => route.path === '/')) {
    router.registerRoutes([
      {
        path: '/',
        component: HomePage,
        meta: {
          title: 'RevMind | architecture from your knowledge graph',
          description: PAGE_DESCRIPTION,
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
  }

  return (
    <LinkBehaviorProvider component={Link} hrefProp="to">
      <ErrorBoundary resetKey={pathname}>
        <RootLayout>
          <Routes />
        </RootLayout>
      </ErrorBoundary>
    </LinkBehaviorProvider>
  );
}
