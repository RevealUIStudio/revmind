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
    upsertMeta('description', typeof meta?.description === 'string' ? meta.description : '');
    upsertMeta('robots', typeof meta?.robots === 'string' ? meta.robots : 'index,follow');
  }, [router, pathname]);

  return null;
}

function upsertMeta(name: string, content: string): void {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
