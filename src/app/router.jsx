import { useEffect, useSyncExternalStore } from 'react';

/**
 * Minimal hash router. Hash routing keeps the PWA deployable to any static
 * host without server rewrites. Swap for a full router when modules need
 * nested routes or params.
 */
// Path is mirrored in memory so navigation still works where the URL hash is
// not writable (for example inside a sandboxed preview frame).
let memoryPath = null;
const listeners = new Set();

const hashPath = () => {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
};

const getPath = () => memoryPath ?? hashPath();

const subscribe = (callback) => {
  const onHash = () => {
    memoryPath = null;
    callback();
  };
  window.addEventListener('hashchange', onHash);
  listeners.add(callback);
  return () => {
    window.removeEventListener('hashchange', onHash);
    listeners.delete(callback);
  };
};

export const usePath = () => useSyncExternalStore(subscribe, getPath, () => '/');

export const navigate = (path) => {
  if (getPath() === path) return;
  memoryPath = path;
  try {
    window.history.replaceState(null, '', `#${path}`);
  } catch {
    // URL not writable; in-memory path still drives the UI.
  }
  listeners.forEach((fn) => fn());
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
