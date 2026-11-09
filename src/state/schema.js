/**
 * Persisted data shape. Profiles and offers are kept as flat collections
 * (offers reference their profile by `profileId`) so they map directly to
 * backend tables or Firestore collections later.
 *
 * {
 *   schemaVersion: 3,
 *   selectedModelId, activeProfileId, activeOfferId,
 *   profiles: Profile[],
 *   offers: Offer[],          // offer.profileId → profile
 *   costCategories: Category[], // category.profileId → profile
 *   costs: Cost[],            // cost.profileId → profile; cost.offerId → offer, or null for business-level
 * }
 */
import { getBusinessModel } from '../data/businessModels.js';
import { DEFAULT_CURRENCY, LEGACY_OFFER_TYPES } from '../data/businessSetup.js';
import { createSeedCosts, createSeedOffers, createSeedProfiles } from '../data/seedProfiles.js';
import { DEFAULT_COST_CATEGORIES, FALLBACK_CATEGORY_KEY } from '../data/costSetup.js';
import { createId } from '../utils/format.js';

export const SCHEMA_VERSION = 3;

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

/** The six default categories for one business, with fresh unique ids. */
export const createDefaultCategories = (profileId) =>
  DEFAULT_COST_CATEGORIES.map((c) => ({
    id: createId('cat'),
    profileId,
    key: c.key,
    name: c.name,
    locked: c.key === FALLBACK_CATEGORY_KEY,
  }));

const normalizeCategory = (c) => ({
  id: c.id,
  profileId: c.profileId,
  key: str(c.key) || null,
  name: str(c.name) || 'Untitled category',
  locked: Boolean(c.locked),
});

export const normalizeCost = (c) => ({
  id: c.id,
  profileId: c.profileId,
  offerId: str(c.offerId) || null,
  name: str(c.name),
  categoryId: str(c.categoryId),
  classification: str(c.classification) || 'fixed',
  frequency: str(c.frequency) || 'monthly',
  customFrequency: str(c.customFrequency),
  quantity: num(c.quantity) ?? 1,
  unitCost: num(c.unitCost) ?? 0,
  totalOverride: num(c.totalOverride),
  status: c.status === 'actual' ? 'actual' : 'estimated',
  notes: str(c.notes),
  createdAt: str(c.createdAt) || new Date().toISOString(),
  updatedAt: str(c.updatedAt) || new Date().toISOString(),
});

/** Seed costs reference category keys; resolve them to the business's category ids. */
const resolveSeedCosts = (categories, profileIds, offerIds) =>
  createSeedCosts()
    .filter((c) => profileIds.has(c.profileId) && (!c.offerId || offerIds.has(c.offerId)))
    .map(({ category, ...c }) => {
      const own = categories.filter((cat) => cat.profileId === c.profileId);
      const match = own.find((cat) => cat.key === category) ?? own.find((cat) => cat.locked);
      return normalizeCost({ ...c, categoryId: match?.id });
    });

export const createInitialState = () => {
  const profiles = createSeedProfiles();
  const offers = createSeedOffers();
  const costCategories = profiles.flatMap((p) => createDefaultCategories(p.id));
  return {
    schemaVersion: SCHEMA_VERSION,
    selectedModelId: null,
    activeProfileId: null,
    activeOfferId: null,
    profiles,
    offers,
    costCategories,
    costs: resolveSeedCosts(
      costCategories,
      new Set(profiles.map((p) => p.id)),
      new Set(offers.map((o) => o.id))
    ),
  };
};

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

  // v3: cost categories (every business gets the defaults) and costs.
  const costCategories = Array.isArray(stored.costCategories)
    ? stored.costCategories.filter((c) => c && c.id && profileIds.has(c.profileId)).map(normalizeCategory)
    : [];
  profiles.forEach((p) => {
    if (!costCategories.some((c) => c.profileId === p.id)) costCategories.push(...createDefaultCategories(p.id));
  });

  const offerById = new Map(offers.map((o) => [o.id, o]));
  let costs;
  if (Array.isArray(stored.costs)) {
    costs = stored.costs
      .filter((c) => c && c.id && profileIds.has(c.profileId))
      // an offer-level cost must point at an offer of the same business
      .filter((c) => !c.offerId || offerById.get(c.offerId)?.profileId === c.profileId)
      .map(normalizeCost);
  } else {
    costs = resolveSeedCosts(costCategories, profileIds, new Set(offerById.keys()));
  }
  // Any cost whose category no longer exists falls back to that business's locked category.
  costs = costs.map((c) => {
    if (costCategories.some((cat) => cat.id === c.categoryId && cat.profileId === c.profileId)) return c;
    const fallback = costCategories.find((cat) => cat.profileId === c.profileId && cat.locked);
    return { ...c, categoryId: fallback?.id ?? '' };
  });

  const activeProfileId = profileIds.has(stored.activeProfileId) ? stored.activeProfileId : null;
  const activeOffer = offers.find((o) => o.id === stored.activeOfferId);

  return {
    schemaVersion: SCHEMA_VERSION,
    selectedModelId: getBusinessModel(stored.selectedModelId) ? stored.selectedModelId : null,
    activeProfileId,
    activeOfferId: activeOffer && activeOffer.profileId === activeProfileId ? activeOffer.id : null,
    profiles,
    offers,
    costCategories,
    costs,
  };
}
