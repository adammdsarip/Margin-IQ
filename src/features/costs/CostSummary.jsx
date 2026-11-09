import { getFrequency } from '../../data/costSetup.js';
import { formatMoney } from '../../utils/format.js';
import { buildSummary, cleanCustomFrequency } from './costMath.js';

const columnLabel = (sample) =>
  sample.frequency === 'custom' ? `Per ${cleanCustomFrequency(sample.customFrequency) || 'custom'}` : getFrequency(sample.frequency)?.label;

/**
 * Consolidated totals for one business. One column per frequency in use;
 * amounts in different columns are never added together.
 */
export default function CostSummary({ costs, currency }) {
  const { columns, rows } = buildSummary(costs);

  return (
    <section className="cost-summary" aria-labelledby="cost-summary-title">
      <div className="cost-summary__head">
        <h2 id="cost-summary-title" className="section-heading__title">Cost summary</h2>
        <p className="section-heading__description">
          All costs for this business in {currency}. Each column is a separate frequency, so monthly,
          yearly and per-booking costs are never added together.
        </p>
      </div>

      {costs.length === 0 ? (
        <p className="cost-summary__empty">No costs recorded yet. Totals appear here as you add costs.</p>
      ) : (
        <div className="table-scroll">
          <table className="summary-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Group</span>
                </th>
                {columns.map((c) => (
                  <th key={c.key} scope="col">{columnLabel(c.sample)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={row.id === 'fixed' || row.id === 'estimated' ? 'is-group-start' : undefined}>
                  <th scope="row">
                    {row.label}
                    <span className="summary-table__count">{row.count}</span>
                  </th>
                  {row.cells.map((amount, i) => (
                    <td key={columns[i].key}>{amount === null ? <span className="muted">—</span> : formatMoney(amount, currency)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
