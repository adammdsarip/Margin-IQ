/**
 * Reference data for the cost structure module (Stage 3).
 * Stored values are the stable ids; labels can change.
 */

/** Default categories created for every business. `key` lets suggestions find them. */
export const DEFAULT_COST_CATEGORIES = [
  { key: 'direct', name: 'Direct Costs' },
  { key: 'labour', name: 'Labour Costs' },
  { key: 'operating', name: 'Operating Expenses' },
  { key: 'sales', name: 'Sales & Distribution' },
  { key: 'marketing', name: 'Marketing Expenses' },
  { key: 'other', name: 'Other Expenses' }, // fallback; cannot be deleted
];

export const FALLBACK_CATEGORY_KEY = 'other';

export const COST_LEVELS = [
  { id: 'business', label: 'Business' },
  { id: 'offer', label: 'Offer' },
];

export const CLASSIFICATIONS = [
  { id: 'fixed', label: 'Fixed', hint: 'Stays the same regardless of sales, e.g. rent.' },
  { id: 'variable', label: 'Variable', hint: 'Rises with each sale or booking, e.g. materials.' },
  { id: 'one-time', label: 'One-time', hint: 'Paid once, e.g. equipment purchase or setup fee.' },
];

/**
 * `kind` separates time periods (a cost per month) from rates (a cost per
 * booking). Summaries never add different frequencies together.
 */
export const FREQUENCIES = [
  { id: 'one-time', label: 'One-time', short: 'one-time', kind: 'once' },
  { id: 'daily', label: 'Daily', short: 'day', kind: 'period' },
  { id: 'weekly', label: 'Weekly', short: 'week', kind: 'period' },
  { id: 'monthly', label: 'Monthly', short: 'month', kind: 'period' },
  { id: 'annually', label: 'Annually', short: 'year', kind: 'period' },
  { id: 'per-unit', label: 'Per unit', short: 'unit', kind: 'rate' },
  { id: 'per-customer', label: 'Per customer', short: 'customer', kind: 'rate' },
  { id: 'per-booking', label: 'Per booking', short: 'booking', kind: 'rate' },
  { id: 'per-project', label: 'Per project', short: 'project', kind: 'rate' },
  { id: 'custom', label: 'Custom', short: null, kind: 'custom' },
];

export const COST_STATUSES = [
  { id: 'estimated', label: 'Estimated' },
  { id: 'actual', label: 'Actual' },
];

const byId = (list, id) => list.find((item) => item.id === id) ?? null;
export const getClassification = (id) => byId(CLASSIFICATIONS, id);
export const getFrequency = (id) => byId(FREQUENCIES, id);
export const getCostStatus = (id) => byId(COST_STATUSES, id);

/**
 * Suggested costs. Business-level suggestions apply to every model;
 * offer-level ones depend on the business model. Suggestions only prefill
 * the form; the user can change everything.
 */
const s = (name, category, classification, frequency) => ({ name, category, classification, frequency });

export const BUSINESS_COST_SUGGESTIONS = [
  s('Rent', 'operating', 'fixed', 'monthly'),
  s('Utilities', 'operating', 'fixed', 'monthly'),
  s('Software subscriptions', 'operating', 'fixed', 'monthly'),
  s('Administrative expenses', 'operating', 'fixed', 'monthly'),
  s('Insurance', 'operating', 'fixed', 'annually'),
  s('General operating expenses', 'other', 'fixed', 'monthly'),
];

export const OFFER_COST_SUGGESTIONS = {
  service: [
    s('Freelancers', 'labour', 'variable', 'per-booking'),
    s('Labour', 'labour', 'variable', 'per-booking'),
    s('Materials', 'direct', 'variable', 'per-booking'),
    s('Equipment rental', 'direct', 'variable', 'per-booking'),
    s('Transport', 'direct', 'variable', 'per-booking'),
  ],
  product: [
    s('Product purchase cost', 'direct', 'variable', 'per-unit'),
    s('Packaging', 'direct', 'variable', 'per-unit'),
    s('Shipping', 'sales', 'variable', 'per-unit'),
    s('Storage', 'operating', 'fixed', 'monthly'),
    s('Payment fees', 'sales', 'variable', 'per-unit'),
  ],
  package: [
    s('Accommodation', 'direct', 'variable', 'per-booking'),
    s('Transport', 'direct', 'variable', 'per-booking'),
    s('Meals', 'direct', 'variable', 'per-customer'),
    s('Activities', 'direct', 'variable', 'per-customer'),
    s('Venue', 'direct', 'variable', 'per-project'),
    s('Event staff', 'labour', 'variable', 'per-project'),
  ],
  subscription: [
    s('Hosting', 'direct', 'fixed', 'monthly'),
    s('Software', 'direct', 'fixed', 'monthly'),
    s('Customer support', 'labour', 'fixed', 'monthly'),
    s('Payment processing', 'sales', 'variable', 'per-customer'),
  ],
  'lead-generation': [
    s('Advertising', 'marketing', 'variable', 'monthly'),
    s('Sales commissions', 'sales', 'variable', 'per-customer'),
    s('Lead acquisition', 'marketing', 'variable', 'per-customer'),
    s('Consultation expenses', 'direct', 'variable', 'per-booking'),
  ],
};

export const getCostSuggestions = (level, modelId) =>
  level === 'business' ? BUSINESS_COST_SUGGESTIONS : OFFER_COST_SUGGESTIONS[modelId] ?? [];
