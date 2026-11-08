const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

/** Example profiles shown the first time the app is opened. */
export const createSeedProfiles = () => [
  {
    id: 'seed-pure-intent',
    name: 'PURE INTENT – Desaru Family Getaway',
    businessModelId: 'package',
    updatedAt: daysAgo(1),
  },
  {
    id: 'seed-photography',
    name: 'Photography Business',
    businessModelId: 'service',
    updatedAt: daysAgo(6),
  },
  {
    id: 'seed-wellness',
    name: 'Wellness Therapy',
    businessModelId: 'service',
    updatedAt: daysAgo(14),
  },
];
