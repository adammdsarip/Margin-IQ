import { useEffect, useSyncExternalStore } from 'react';

/**
 * Minimal hash router. Hash routing keeps the PWA deployable to any static
 * host without server rewrites. Swap for a full router when modules need
 * nested routes or params.
 */
const getPath = () => {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
};

const subscribe = (callback) => {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
};

export const usePath = () => useSyncExternalStore(subscribe, getPath, () => '/');

export const navigate = (path) => {
  if (getPath() !== path) window.location.hash = path;
};

export function Router({ routes, fallback = '/' }) {
  const path = usePath();
  const route = routes.find((r) => r.path === path);

  useEffect(() => {
    if (!route) navigate(fallback);
  }, [route, fallback]);

  useEffect(() => {
    if (route) {
      document.title = route.title ? `${route.title} · MarginIQ` : 'MarginIQ';
      window.scrollTo(0, 0);
    }
  }, [route]);

  if (!route) return null;
  const Page = route.component;
  return <Page />;
}
