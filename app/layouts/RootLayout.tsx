import { useLocation } from '@revealui/router';
import { type ReactNode, useEffect, useRef } from 'react';
import { NavBar } from '@/components/NavBar';
import { RouteHead } from '@/components/RouteHead';

export function RootLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isInitialRender = useRef(true);

  // pathname is the navigation trigger, not a value the body reads.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the navigation trigger
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    mainRef.current?.focus();
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <RouteHead />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline focus:outline-2 focus:outline-ring"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
    </div>
  );
}
