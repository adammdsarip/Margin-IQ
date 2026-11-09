/** Pure calculations. No React, no formatting. */

/** "1,280.50" → 1280.5. Blank or invalid input counts as 0. */
export const toNumber = (text) => {
  const n = Number(String(text ?? '').replace(/[,\s]/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export function calculate({ price, units, costPerSale, overheads, targetMargin = 0.5 }) {
  const revenue = price * units;
  const variableCosts = costPerSale * units;
  const grossProfit = revenue - variableCosts;
  const netProfit = grossProfit - overheads;
  const profitPerSaleBeforeOverheads = price - costPerSale;

  return {
    revenue,
    variableCosts,
    grossProfit,
    overheads,
    netProfit,
    grossMargin: revenue > 0 ? grossProfit / revenue : null,
    netMargin: revenue > 0 ? netProfit / revenue : null,
    profitPerSale: units > 0 ? netProfit / units : null,
    markup: costPerSale > 0 ? profitPerSaleBeforeOverheads / costPerSale : null,
    // Sales needed each month for gross profit to cover overheads.
    breakEvenSales: profitPerSaleBeforeOverheads > 0 ? Math.ceil(overheads / profitPerSaleBeforeOverheads) : null,
    losesMoneyPerSale: profitPerSaleBeforeOverheads <= 0 && price > 0,
    // Price that reaches the target gross margin at the current cost per sale.
    priceForTargetMargin: targetMargin >= 0 && targetMargin < 1 ? costPerSale / (1 - targetMargin) : null,
    // Price at which net profit is zero at the current sales volume.
    priceToBreakEven: units > 0 ? costPerSale + overheads / units : null,
    overheadShare: revenue > 0 ? overheads / revenue : null,
    contributionPerSale: profitPerSaleBeforeOverheads,
  };
}

export const formatMoney = (amount, currency, decimals = 0) => {
  try {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
      .format(amount)
      .replace(/ /g, ' ');
  } catch {
    return `${currency} ${amount.toFixed(decimals)}`;
  }
};

export const formatPercent = (ratio) => (ratio === null ? '—' : `${(ratio * 100).toFixed(1)}%`);
