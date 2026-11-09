export const isBlank = (v) => !String(v ?? '').trim();

/** Parses "1,280.50" → 1280.5. Returns null if not a valid number. */
export const parseAmount = (v) => {
  const cleaned = String(v ?? '').replace(/[,\s]/g, '');
  if (!cleaned) return null;
  if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export const parseWholeNumber = (v) => {
  const cleaned = String(v ?? '').replace(/[,\s]/g, '');
  return /^\d+$/.test(cleaned) ? Number(cleaned) : null;
};

/** Accepts "example.com" or a full URL; returns a normalised https URL or null. */
export const normalizeWebsite = (v) => {
  const raw = String(v ?? '').trim();
  if (!raw) return '';
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes('.') || /\s/.test(raw)) return null;
    return url.href.replace(/\/$/, '');
  } catch {
    return null;
  }
};

export const displayWebsite = (url) => String(url ?? '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
