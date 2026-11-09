/**
 * Reference data for business profiles and offers.
 * Stored values are the stable `id`s; labels can change freely.
 */

export const CURRENCIES = [
  { id: 'SGD', label: 'SGD — Singapore dollar' },
  { id: 'MYR', label: 'MYR — Malaysian ringgit' },
  { id: 'USD', label: 'USD — US dollar' },
  { id: 'AUD', label: 'AUD — Australian dollar' },
  { id: 'EUR', label: 'EUR — Euro' },
  { id: 'GBP', label: 'GBP — British pound' },
  { id: 'HKD', label: 'HKD — Hong Kong dollar' },
  { id: 'IDR', label: 'IDR — Indonesian rupiah' },
  { id: 'THB', label: 'THB — Thai baht' },
  { id: 'PHP', label: 'PHP — Philippine peso' },
];

export const DEFAULT_CURRENCY = 'SGD';

export const INDUSTRIES = [
  { id: 'travel', label: 'Travel & tourism' },
  { id: 'events', label: 'Events & weddings' },
  { id: 'photography', label: 'Photography & creative' },
  { id: 'wellness', label: 'Health & wellness' },
  { id: 'beauty', label: 'Beauty & personal care' },
  { id: 'fitness', label: 'Fitness & sport' },
  { id: 'professional', label: 'Professional services' },
  { id: 'agency', label: 'Marketing & agencies' },
  { id: 'education', label: 'Education & training' },
  { id: 'retail', label: 'Retail & e-commerce' },
  { id: 'food', label: 'Food & beverage' },
  { id: 'property', label: 'Property & real estate' },
  { id: 'finance', label: 'Insurance & finance' },
  { id: 'technology', label: 'Software & technology' },
  { id: 'matchmaking', label: 'Dating & matchmaking' },
  { id: 'other', label: 'Other' },
];

export const PRICING_UNITS = [
  { id: 'unit', label: 'Per unit', short: 'unit' },
  { id: 'session', label: 'Per session', short: 'session' },
  { id: 'hour', label: 'Per hour', short: 'hour' },
  { id: 'customer', label: 'Per customer', short: 'customer' },
  { id: 'booking', label: 'Per booking', short: 'booking' },
  { id: 'family', label: 'Per family', short: 'family' },
  { id: 'project', label: 'Per project', short: 'project' },
  { id: 'monthly', label: 'Monthly', short: 'month' },
  { id: 'annually', label: 'Annually', short: 'year' },
  { id: 'custom', label: 'Custom', short: null },
];

/**
 * Offer types available for each business model.
 * `unit` is the pricing unit suggested when the type is chosen.
 */
export const OFFER_TYPES = {
  service: [
    { id: 'service-package', label: 'Service package', hint: 'e.g. photography package', unit: 'project' },
    { id: 'session', label: 'Single session', hint: 'e.g. massage session', unit: 'session' },
    { id: 'consulting', label: 'Consulting service', hint: 'e.g. strategy consultation', unit: 'hour' },
    { id: 'other-service', label: 'Other service', unit: 'unit' },
  ],
  product: [
    { id: 'physical', label: 'Physical product', unit: 'unit' },
    { id: 'digital', label: 'Digital product', unit: 'unit' },
    { id: 'other-product', label: 'Other product', unit: 'unit' },
  ],
  package: [
    { id: 'travel', label: 'Travel package', unit: 'family' },
    { id: 'event', label: 'Event package', unit: 'project' },
    { id: 'wedding', label: 'Wedding package', unit: 'project' },
    { id: 'other-package', label: 'Other package or project', unit: 'project' },
  ],
  subscription: [
    { id: 'monthly-membership', label: 'Monthly membership', unit: 'monthly' },
    { id: 'annual-subscription', label: 'Annual subscription', unit: 'annually' },
    { id: 'other-subscription', label: 'Other subscription', unit: 'monthly' },
  ],
  'lead-generation': [
    { id: 'qualified-lead', label: 'Qualified lead', unit: 'customer' },
    { id: 'consultation-booking', label: 'Consultation booking', unit: 'booking' },
    { id: 'customer-acquisition', label: 'Customer acquisition', unit: 'customer' },
    { id: 'other-lead', label: 'Other lead offer', unit: 'customer' },
  ],
};

/** Offer types removed in cleanup, mapped to their model's catch-all so saved offers keep a valid type. */
export const LEGACY_OFFER_TYPES = {
  retainer: 'other-service',
  bundle: 'other-product',
  experience: 'other-package',
  software: 'other-subscription',
};

const byId = (list, id) => list.find((item) => item.id === id) ?? null;

export const getCurrency = (id) => byId(CURRENCIES, id);
export const getIndustry = (id) => byId(INDUSTRIES, id);
export const getPricingUnit = (id) => byId(PRICING_UNITS, id);
export const getOfferTypes = (modelId) => OFFER_TYPES[modelId] ?? [];
export const getOfferType = (typeId) =>
  Object.values(OFFER_TYPES).flat().find((t) => t.id === typeId) ?? null;

/** "family", "session", or the user's custom wording. */
export const unitShortLabel = (offer) =>
  offer.pricingUnit === 'custom'
    ? offer.customUnit || 'unit'
    : getPricingUnit(offer.pricingUnit)?.short ?? 'unit';
