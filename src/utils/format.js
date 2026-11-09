const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
};

const moneyFormatters = new Map();

/** "SGD 1,280.00". Falls back to a plain number if the currency is unknown. */
export const formatMoney = (amount, currency = 'SGD') => {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '—';
  if (!moneyFormatters.has(currency)) {
    try {
      moneyFormatters.set(
        currency,
        new Intl.NumberFormat('en-SG', {
          style: 'currency',
          currency,
          currencyDisplay: 'code',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } catch {
      moneyFormatters.set(currency, null);
    }
  }
  const formatter = moneyFormatters.get(currency);
  const text = formatter
    ? formatter.format(amount)
    : `${currency} ${amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`;
  return text.replace(/ /g, ' ');
};

export const formatNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-SG') : '—';

/** Unique id, optionally prefixed by entity type (e.g. "biz_…", "off_…"). */
export const createId = (prefix) => {
  const raw =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${raw}` : raw;
};
