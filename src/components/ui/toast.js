/**
 * Tiny global toast store. Call `showToast('Offer saved')` from anywhere;
 * <Toast /> in the app shell renders it. Survives page navigation.
 */
let current = null;
let timer = null;
const listeners = new Set();

const emit = () => listeners.forEach((fn) => fn());

export const showToast = (message) => {
  current = { message, id: Date.now() };
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, 3500);
  emit();
};

export const subscribeToast = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getToast = () => current;
