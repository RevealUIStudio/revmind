import { useLocation, useRouter } from '@revealui/router';
import { useEffect } from 'react';

/**
 * Applies the active route's metadata to the document head on client-side
 * navigation. Renders nothing.
 */
export function RouteHead() {
  const router = useRouter();
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = router.match(pathname)?.route.meta;
    if (meta?.title) {
      document.title = meta.title;
    }
    if (meta?.description) {
      const tag = document.querySelector('meta[name="description"]');
      tag?.setAttribute('content', meta.description);
    }
    const robots = typeof meta?.robots === 'string' ? meta.robots : 'index,follow';
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', robots);
  }, [router, pathname]);

  return null;
}
