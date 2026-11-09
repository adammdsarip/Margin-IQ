import { calculate, formatMoney, formatPercent, toNumber } from './calc.js';
import { buildSuggestions } from './suggestions.js';
import { PRESETS } from './presets.js';

export default function Results({ values, currency }) {
  const input = {
    price: toNumber(values.price),
    units: toNumber(values.units),
    costPerSale: toNumber(values.cost),
    overheads: toNumber(values.overheads),
    targetMargin: Math.min(toNumber(values.target), 99.9) / 100,
  };
  const m = calculate(input);
  const money = (n, dp) => formatMoney(n, currency, dp);
  const suggestions = buildSuggestions(m, input, PRESETS[values.type]?.tip, money);
  const hasInput = m.revenue > 0;
  const tone = m.netProfit > 0 ? 'is-profit' : m.netProfit < 0 ? 'is-loss' : '';

  return (
    <section className="card results" aria-labelledby="results-title" aria-live="polite">
      <h2 id="results-title" className="card__title">Results per month</h2>

      <div className="hero">
        <span className="hero__label">Net profit</span>
        <span className={`hero__value ${tone}`}>{money(m.netProfit)}</span>
        <span className="hero__sub">
          {hasInput ? `${formatPercent(m.netMargin)} net margin` : 'Enter your numbers to see your profit'}
        </span>
      </div>

      <table className="breakdown">
        <tbody>
          <tr>
            <th scope="row">Revenue</th>
            <td>{money(m.revenue)}</td>
          </tr>
          <tr>
            <th scope="row" className="minus">Cost of sales</th>
            <td className="minus">− {money(m.variableCosts)}</td>
          </tr>
          <tr className="subtotal">
            <th scope="row">
              Gross profit
              <span className="breakdown__note">{formatPercent(m.grossMargin)} gross margin</span>
            </th>
            <td>{money(m.grossProfit)}</td>
          </tr>
          <tr>
            <th scope="row" className="minus">Monthly overheads</th>
            <td className="minus">− {money(m.overheads)}</td>
          </tr>
          <tr className="subtotal">
            <th scope="row">
              Net profit
              <span className="breakdown__note">{formatPercent(m.netMargin)} net margin</span>
            </th>
            <td className={tone}>{money(m.netProfit)}</td>
          </tr>
        </tbody>
      </table>

      <dl className="facts">
        <div>
          <dt>Profit per sale</dt>
          <dd>{m.profitPerSale === null ? '—' : money(m.profitPerSale, 2)}</dd>
        </div>
        <div>
          <dt>Markup on cost</dt>
          <dd>{m.markup === null ? '—' : `${(m.markup * 100).toFixed(0)}%`}</dd>
        </div>
        <div>
          <dt>Break-even</dt>
          <dd>
            {m.breakEvenSales === null
              ? m.losesMoneyPerSale
                ? 'Not reachable'
                : '—'
              : `${m.breakEvenSales} sales`}
          </dd>
        </div>
      </dl>
      <h3 className="suggestions__title">Suggestions</h3>
      {suggestions.length === 0 ? (
        <p className="suggestions__empty">Enter a price and your expected sales to get suggestions.</p>
      ) : (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={s.text} className={`suggestion suggestion--${s.tone}`}>{s.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
