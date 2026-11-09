/**
 * Plain-language suggestions based on the calculated results.
 * Returns [{ tone: 'good' | 'warn' | 'bad' | 'tip', text }].
 * `money(amount, decimals)` formats in the chosen currency.
 */
const LOW_HEADROOM = 0.7; // break-even above 70% of expected sales leaves little room
const HIGH_OVERHEADS = 0.3; // overheads above 30% of revenue

export function buildSuggestions(m, input, tip, money) {
  const { price, units, costPerSale, targetMargin } = input;
  if (price <= 0 || units <= 0) return [];
  const out = [];

  if (m.contributionPerSale <= 0) {
    out.push({
      tone: 'bad',
      text: `Each sale loses ${money(-m.contributionPerSale, 2)} before overheads. Raise the price above ${money(costPerSale, 2)} or reduce the cost per sale.`,
    });
  } else if (m.netProfit < 0) {
    out.push({
      tone: 'bad',
      text: `You are losing ${money(-m.netProfit)} a month. You need ${m.breakEvenSales} sales a month to break even and you expect ${units}.`,
    });
    out.push({
      tone: 'warn',
      text: `At ${units} sales a month, a price of ${money(m.priceToBreakEven, 2)} per sale would break even.`,
    });
  } else if (m.breakEvenSales / units > LOW_HEADROOM) {
    out.push({
      tone: 'warn',
      text: `You make a profit, but break-even is ${m.breakEvenSales} sales, close to your ${units} expected. A small drop in sales would remove most of it.`,
    });
  } else {
    out.push({
      tone: 'good',
      text: `Profitable with room to spare. You could drop to ${m.breakEvenSales} sales a month and still break even.`,
    });
  }

  if (m.grossMargin !== null && m.priceForTargetMargin !== null && m.grossMargin < targetMargin) {
    out.push({
      tone: 'warn',
      text: `Gross margin is ${(m.grossMargin * 100).toFixed(1)}%, below your ${(targetMargin * 100).toFixed(0)}% target. At your current costs, a price of ${money(m.priceForTargetMargin, 2)} would reach it.`,
    });
  }

  if (m.overheadShare !== null && m.overheadShare > HIGH_OVERHEADS) {
    out.push({
      tone: 'warn',
      text: `Overheads take ${(m.overheadShare * 100).toFixed(0)}% of revenue. Review your largest fixed cost first, such as rent, software or insurance.`,
    });
  }

  if (tip) out.push({ tone: 'tip', text: tip });
  return out;
}
