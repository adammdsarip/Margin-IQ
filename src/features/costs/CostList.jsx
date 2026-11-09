import { getClassification } from '../../data/costSetup.js';
import { formatMoney } from '../../utils/format.js';
import Icon from '../../components/ui/Icon.jsx';
import { calculatedTotal, costTotal, frequencySuffix, sumByFrequency } from './costMath.js';

function IconButton({ icon, label, onClick, danger }) {
  return (
    <button type="button" className={`icon-btn${danger ? ' icon-btn--danger' : ''}`} onClick={onClick} aria-label={label} title={label.split(' "')[0]}>
      <Icon name={icon} size={17} />
    </button>
  );
}

function CostRow({ cost, currency, categoryName, offerName, onEdit, onDuplicate, onDelete }) {
  const money = (n) => formatMoney(n, currency);
  const custom = typeof cost.totalOverride === 'number';
  const classification = getClassification(cost.classification);

  return (
    <li className="cost-row">
      <div className="cost-row__main">
        <p className="cost-row__name">{cost.name}</p>
        <p className="cost-row__meta">
          {categoryName}
          {offerName && <> · {offerName}</>}
        </p>
        {cost.notes && <p className="cost-row__notes">{cost.notes}</p>}
      </div>
      <div className="cost-row__tags">
        <span className={`pill pill--${cost.classification}`}>{classification?.label}</span>
        <span className={`pill pill--status${cost.status === 'actual' ? ' pill--actual' : ''}`}>
          {cost.status === 'actual' ? 'Actual' : 'Estimated'}
        </span>
      </div>
      <div className="cost-row__amount">
        <p className="cost-row__total">
          {money(costTotal(cost))} <span className="cost-row__freq">{frequencySuffix(cost)}</span>
        </p>
        <p className="cost-row__calc">
          {custom ? `Custom total · calculated ${money(calculatedTotal(cost))}` : `${cost.quantity} × ${money(cost.unitCost)}`}
        </p>
      </div>
      <div className="cost-row__actions">
        <IconButton icon="edit" label={`Edit "${cost.name}"`} onClick={onEdit} />
        <IconButton icon="copy" label={`Duplicate "${cost.name}"`} onClick={onDuplicate} />
        <IconButton icon="trash" label={`Delete "${cost.name}"`} onClick={onDelete} danger />
      </div>
    </li>
  );
}

/** Subtotal line: one amount per frequency, never added together. */
export function FrequencyTotals({ costs, currency }) {
  const buckets = sumByFrequency(costs);
  if (buckets.length === 0) return null;
  return (
    <ul className="freq-totals">
      {buckets.map((b) => (
        <li key={b.key}>
          <span className="freq-totals__amount">{formatMoney(b.amount, currency)}</span>{' '}
          <span className="freq-totals__freq">{frequencySuffix(b.sample)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CostList({ costs, currency, categories, offers, showOffer, onEdit, onDuplicate, onDelete }) {
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised';
  const offerName = (id) => offers.find((o) => o.id === id)?.name;
  return (
    <ul className="cost-list">
      {costs.map((cost) => (
        <CostRow
          key={cost.id}
          cost={cost}
          currency={currency}
          categoryName={categoryName(cost.categoryId)}
          offerName={showOffer ? offerName(cost.offerId) : null}
          onEdit={() => onEdit(cost)}
          onDuplicate={() => onDuplicate(cost)}
          onDelete={() => onDelete(cost)}
        />
      ))}
    </ul>
  );
}
