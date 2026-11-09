/**
 * Persisted data shape. Profiles and offers are kept as flat collections
 * (offers reference their profile by `profileId`) so they map directly to
 * backend tables or Firestore collections later.
 *
 * {
 *   schemaVersion: 2,
 *   selectedModelId, activeProfileId, activeOfferId,
 *   profiles: Profile[],
 *   offers: Offer[],
 * }
 */
import { getBusinessModel } from '../data/businessModels.js';
import { DEFAULT_CURRENCY, LEGACY_OFFER_TYPES } from '../data/businessSetup.js';
import { createSeedOffers, createSeedProfiles } from '../data/seedProfiles.js';

export const SCHEMA_VERSION = 2;

const str = (value) => (typeof value === 'string' ? value : '');
const num = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

export const normalizeProfile = (p) => ({
  id: p.id,
  name: str(p.name),
  businessModelId: str(p.businessModelId),
  description: str(p.description),
  industry: str(p.industry),
  currency: str(p.currency) || DEFAULT_CURRENCY,
  website: str(p.website),
  location: str(p.location),
  createdAt: str(p.createdAt) || str(p.updatedAt) || new Date().toISOString(),
  updatedAt: str(p.updatedAt) || new Date().toISOString(),
});

export const normalizeOffer = (o) => ({
  id: o.id,
  profileId: o.profileId,
  name: str(o.name),
  description: str(o.description),
  type: LEGACY_OFFER_TYPES[o.type] ?? str(o.type),
  price: num(o.price),
  pricingUnit: str(o.pricingUnit) || 'unit',
  customUnit: str(o.customUnit),
  expectedSales: num(o.expectedSales),
  targetCustomer: str(o.targetCustomer),
  createdAt: str(o.createdAt) || new Date().toISOString(),
  updatedAt: str(o.updatedAt) || new Date().toISOString(),
});

export const createInitialState = () => ({
  schemaVersion: SCHEMA_VERSION,
  selectedModelId: null,
  activeProfileId: null,
  activeOfferId: null,
  profiles: createSeedProfiles(),
  offers: createSeedOffers(),
});

/** Accepts any earlier stored shape and returns a valid current state. */
export function migrate(stored) {
  if (!stored || !Array.isArray(stored.profiles)) return createInitialState();

  const profiles = stored.profiles.filter((p) => p && p.id).map(normalizeProfile);
  const profileIds = new Set(profiles.map((p) => p.id));

  let offers;
  if (Array.isArray(stored.offers)) {
    offers = stored.offers.filter((o) => o && o.id && profileIds.has(o.profileId)).map(normalizeOffer);
  } else {
    // v1 had no offers: add the example offers only if their example profile still exists.
    offers = createSeedOffers().filter((o) => profileIds.has(o.profileId));
  }

  // v1 seed profiles had no details; fill them in only where the user has not.
  if (!stored.schemaVersion) {
    const seeds = new Map(createSeedProfiles().map((s) => [s.id, s]));
    profiles.forEach((p, i) => {
      const seed = seeds.get(p.id);
      if (seed && !p.industry && !p.description) {
        profiles[i] = { ...seed, name: p.name, businessModelId: p.businessModelId, updatedAt: p.updatedAt };
      }
    });
  }

  const activeProfileId = profileIds.has(stored.activeProfileId) ? stored.activeProfileId : null;
  const activeOffer = offers.find((o) => o.id === stored.activeOfferId);

  return {
    schemaVersion: SCHEMA_VERSION,
    selectedModelId: getBusinessModel(stored.selectedModelId) ? stored.selectedModelId : null,
    activeProfileId,
    activeOfferId: activeOffer && activeOffer.profileId === activeProfileId ? activeOffer.id : null,
    profiles,
    offers,
  };
}
