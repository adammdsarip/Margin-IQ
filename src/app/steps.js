/**
 * Setup flow definition. Drives the progress indicator; later modules add
 * their own `path` as they are implemented.
 */
export const SETUP_STEPS = [
  { id: 'model', label: 'Business model', path: '/' },
  { id: 'details', label: 'Business details', path: '/setup/details' },
  { id: 'costs', label: 'Costs & pricing' },
  { id: 'marketing', label: 'Marketing' },
];
