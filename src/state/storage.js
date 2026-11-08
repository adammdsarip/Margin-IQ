/**
 * Thin, failure-tolerant wrapper around localStorage.
 * Keys are namespaced and versioned so the schema can evolve as modules are added.
 */
const NAMESPACE = 'marginiq';
const VERSION = 'v1';

const key = (name) => `${NAMESPACE}:${VERSION}:${name}`;

export const readStorage = (name, fallback) => {
  try {
    const raw = window.localStorage.getItem(key(name));
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeStorage = (name, value) => {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota). The app keeps working in memory.
  }
};
