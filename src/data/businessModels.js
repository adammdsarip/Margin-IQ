/**
 * Business model catalogue.
 * `id` is the stable key persisted in storage and used by future calculator
 * modules to decide which inputs and formulas apply.
 */
export const BUSINESS_MODELS = [
  {
    id: 'service',
    name: 'Service Business',
    description: 'For businesses selling services or expertise.',
    examples: 'Photography, massage, consulting, agencies and professional services.',
    icon: 'service',
  },
  {
    id: 'product',
    name: 'Product Business',
    description: 'For businesses selling physical products.',
    examples: 'Retail, e-commerce and product sales.',
    icon: 'product',
  },
  {
    id: 'package',
    name: 'Package / Project',
    description: 'For businesses selling packages or projects.',
    examples: 'Travel packages, weddings, events and organised experiences.',
    icon: 'package',
  },
  {
    id: 'subscription',
    name: 'Subscription Business',
    description: 'For businesses collecting recurring payments.',
    examples: 'Memberships, SaaS and monthly services.',
    icon: 'subscription',
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'For businesses generating and converting leads.',
    examples: 'Matchmaking, property and insurance.',
    icon: 'leads',
  },
];

export const getBusinessModel = (id) => BUSINESS_MODELS.find((model) => model.id === id) ?? null;
