/** Business types. Each one only changes the wording and the example numbers. */
export const CURRENCIES = ['SGD', 'MYR', 'USD', 'AUD'];

export const PRESETS = {
  service: {
    name: 'Service business',
    example: 'Photography package',
    labels: { price: 'Price per booking', units: 'Bookings per month', cost: 'Direct cost per booking' },
    values: { price: 800, units: 10, cost: 180, overheads: 2500 },
    tip: 'Track the hours behind each booking. If a job takes longer than planned, your margin drops even when the price stays the same.',
  },
  product: {
    name: 'Product business',
    example: 'Handmade candles',
    labels: { price: 'Price per unit', units: 'Units sold per month', cost: 'Cost per unit' },
    values: { price: 28, units: 120, cost: 11, overheads: 1800 },
    tip: 'Include packaging, shipping and payment fees in the cost per unit. These are the costs most often missed.',
  },
  package: {
    name: 'Package / project',
    example: 'Weekend family getaway',
    labels: { price: 'Price per package', units: 'Packages sold per month', cost: 'Cost per package' },
    values: { price: 1280, units: 12, cost: 760, overheads: 2000 },
    tip: 'Include accommodation, transport and meals in the cost per package. Cancellations and late changes often shift these figures.',
  },
  subscription: {
    name: 'Subscription business',
    example: 'Monthly membership',
    labels: { price: 'Fee per subscriber per month', units: 'Active subscribers', cost: 'Cost per subscriber per month' },
    values: { price: 99, units: 80, cost: 14, overheads: 1500 },
    tip: 'Recurring revenue depends on keeping customers. Track how many you lose each month, not just how many you sign up.',
  },
  'lead-generation': {
    name: 'Lead generation',
    example: 'Insurance leads',
    labels: { price: 'Revenue per customer won', units: 'Customers won per month', cost: 'Cost per customer won' },
    values: { price: 45, units: 200, cost: 30, overheads: 1200 },
    tip: 'Track cost per lead and cost per sale separately. A cheap lead that never converts is still a cost.',
  },
};

export const DEFAULT_TYPE = 'service';
export const DEFAULT_TARGET_MARGIN = '50';

export const exampleFor = (typeId) => {
  const v = PRESETS[typeId].values;
  return { price: String(v.price), units: String(v.units), cost: String(v.cost), overheads: String(v.overheads) };
};
