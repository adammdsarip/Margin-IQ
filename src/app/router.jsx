import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

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

export const getCurrentPath = () => getPath();

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

/** Matches "/business/:profileId" style patterns. Returns params or null. */
const matchPath = (pattern, path) => {
  const a = pattern.split('/').filter(Boolean);
  const b = path.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
};

const ParamsContext = createContext({});

export const useParams = () => useContext(ParamsContext);

export function Router({ routes, fallback = '/' }) {
  const path = usePath();
  let route = null;
  let params = null;
  for (const r of routes) {
    params = matchPath(r.path, path);
    if (params) {
      route = r;
      break;
    }
  }

  useEffect(() => {
    if (!route) navigate(fallback);
  }, [route, fallback]);

  useEffect(() => {
    if (route) {
      document.title = route.title ? `${route.title} · MarginIQ` : 'MarginIQ';
      window.scrollTo(0, 0);
    }
  }, [route, path]);

  if (!route) return null;
  const Page = route.component;
  return (
    <ParamsContext.Provider value={params}>
      <Page key={path} />
    </ParamsContext.Provider>
  );
}
