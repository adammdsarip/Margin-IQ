/**
 * Pure cost calculations. No profit, margin or break-even logic here;
 * those belong to later stages.
 */
import { FREQUENCIES, getFrequency } from '../../data/costSetup.js';

export const roundMoney = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Quantity × Unit Cost. */
export const calculatedTotal = (cost) =>
  typeof cost.quantity === 'number' && typeof cost.unitCost === 'number'
    ? roundMoney(cost.quantity * cost.unitCost)
    : 0;

/** The total actually used: the custom amount if one was entered, otherwise the calculation. */
export const costTotal = (cost) =>
  typeof cost.totalOverride === 'number' ? roundMoney(cost.totalOverride) : calculatedTotal(cost);

/** "per fair" → "fair": the word "per" is added when displayed. */
export const cleanCustomFrequency = (text) => String(text ?? '').trim().replace(/^per\s+/i, '');

/** Identifies a frequency bucket. Custom frequencies are grouped by their own label. */
export const frequencyKey = (cost) =>
  cost.frequency === 'custom'
    ? `custom:${(cleanCustomFrequency(cost.customFrequency) || 'custom').toLowerCase()}`
    : cost.frequency;

/** "month", "booking", or the user's custom wording. */
export const frequencyShort = (cost) =>
  cost.frequency === 'custom' ? cleanCustomFrequency(cost.customFrequency) || 'custom' : getFrequency(cost.frequency)?.short ?? '';

/** "/ month", "per booking", "one-time". */
export const frequencySuffix = (cost) => {
  const f = getFrequency(cost.frequency);
  if (!f) return '';
  if (f.kind === 'once') return 'one-time';
  if (f.kind === 'period') return `/ ${f.short}`;
  return `per ${frequencyShort(cost)}`;
};

const ORDER = FREQUENCIES.map((f) => f.id);

/**
 * Sums totals into separate frequency buckets.
 * Returns [{ key, label, suffixCost, amount, count }] in a stable order.
 */
export const sumByFrequency = (costs) => {
  const buckets = new Map();
  costs.forEach((c) => {
    const key = frequencyKey(c);
    const bucket = buckets.get(key) ?? { key, sample: c, amount: 0, count: 0 };
    bucket.amount = roundMoney(bucket.amount + costTotal(c));
    bucket.count += 1;
    buckets.set(key, bucket);
  });
  return [...buckets.values()].sort((a, b) => {
    const ai = ORDER.indexOf(a.sample.frequency);
    const bi = ORDER.indexOf(b.sample.frequency);
    return ai - bi || a.key.localeCompare(b.key);
  });
};

/** Summary rows required by the Stage 3 brief, each split by frequency. */
export const SUMMARY_ROWS = [
  { id: 'business', label: 'Business-level costs', test: (c) => !c.offerId },
  { id: 'offer', label: 'Offer-level costs', test: (c) => Boolean(c.offerId) },
  { id: 'fixed', label: 'Fixed costs', test: (c) => c.classification === 'fixed' },
  { id: 'variable', label: 'Variable costs', test: (c) => c.classification === 'variable' },
  { id: 'one-time', label: 'One-time costs', test: (c) => c.classification === 'one-time' },
  { id: 'estimated', label: 'Estimated costs', test: (c) => c.status !== 'actual' },
  { id: 'actual', label: 'Actual costs', test: (c) => c.status === 'actual' },
];

/**
 * Builds the consolidated summary: one column per frequency in use,
 * one row per summary group. Amounts are never added across columns.
 */
export const buildSummary = (costs) => {
  const columns = sumByFrequency(costs).map((b) => ({ key: b.key, sample: b.sample }));
  const rows = SUMMARY_ROWS.map((row) => {
    const matching = costs.filter(row.test);
    const sums = new Map(sumByFrequency(matching).map((b) => [b.key, b]));
    return {
      id: row.id,
      label: row.label,
      count: matching.length,
      cells: columns.map((col) => sums.get(col.key)?.amount ?? null),
    };
  });
  return { columns, rows };
};
