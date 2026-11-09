const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

/**
 * Example data shown the first time the app is opened.
 * Seed ids are fixed so a later migration can recognise them.
 */
export const createSeedProfiles = () => [
  {
    id: 'seed-pure-intent',
    name: 'PURE INTENT – Desaru Family Getaway',
    businessModelId: 'package',
    description: 'Curated weekend getaways for families travelling from Singapore to Desaru.',
    industry: 'travel',
    currency: 'SGD',
    website: '',
    location: 'Desaru, Johor',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(1),
  },
  {
    id: 'seed-photography',
    name: 'Photography Business',
    businessModelId: 'service',
    description: '',
    industry: '',
    currency: 'SGD',
    website: '',
    location: '',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    id: 'seed-wellness',
    name: 'Wellness Therapy',
    businessModelId: 'service',
    description: '',
    industry: '',
    currency: 'SGD',
    website: '',
    location: '',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
];

export const createSeedOffers = () => [
  {
    id: 'seed-offer-3d2n',
    profileId: 'seed-pure-intent',
    name: '3D2N Family Getaway',
    description: 'Two nights at a family resort with transfers and one guided activity.',
    type: 'travel',
    price: 1280,
    pricingUnit: 'family',
    customUnit: '',
    expectedSales: 12,
    targetCustomer: 'Singapore families with children aged 4–12',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: 'seed-offer-daytrip',
    profileId: 'seed-pure-intent',
    name: 'Desaru Day Trip',
    description: 'Return coach transfer, lunch and beach activities.',
    type: 'travel',
    price: 168,
    pricingUnit: 'customer',
    customUnit: '',
    expectedSales: 40,
    targetCustomer: 'Couples and small groups looking for a short break',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(3),
  },
];

/**
 * Example costs for the PURE INTENT example business.
 * `category` is a default category key, resolved to the business's own
 * category id when the seed is applied.
 */
export const createSeedCosts = () => [
  {
    id: 'seed-cost-booking-software',
    profileId: 'seed-pure-intent',
    offerId: null,
    name: 'Booking & website software',
    category: 'operating',
    classification: 'fixed',
    frequency: 'monthly',
    quantity: 1,
    unitCost: 89,
    status: 'actual',
  },
  {
    id: 'seed-cost-insurance',
    profileId: 'seed-pure-intent',
    offerId: null,
    name: 'Travel agency insurance',
    category: 'operating',
    classification: 'fixed',
    frequency: 'annually',
    quantity: 1,
    unitCost: 1200,
    status: 'estimated',
  },
  {
    id: 'seed-cost-resort',
    profileId: 'seed-pure-intent',
    offerId: 'seed-offer-3d2n',
    name: 'Resort accommodation',
    category: 'direct',
    classification: 'variable',
    frequency: 'per-booking',
    quantity: 2,
    unitCost: 380,
    status: 'actual',
    notes: '2 nights, family room',
  },
  {
    id: 'seed-cost-coach',
    profileId: 'seed-pure-intent',
    offerId: 'seed-offer-3d2n',
    name: 'Return transfer',
    category: 'direct',
    classification: 'variable',
    frequency: 'per-booking',
    quantity: 1,
    unitCost: 160,
    status: 'estimated',
  },
  {
    id: 'seed-cost-lunch',
    profileId: 'seed-pure-intent',
    offerId: 'seed-offer-daytrip',
    name: 'Lunch',
    category: 'direct',
    classification: 'variable',
    frequency: 'per-customer',
    quantity: 1,
    unitCost: 22,
    status: 'estimated',
  },
];
