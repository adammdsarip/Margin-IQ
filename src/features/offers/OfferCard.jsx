import { getOfferType, unitShortLabel } from '../../data/businessSetup.js';
import { formatMoney, formatNumber } from '../../utils/format.js';
import Button from '../../components/ui/Button.jsx';

export default function OfferCard({ offer, currency, current, onOpen, onEdit, onDuplicate, onDelete }) {
  const type = getOfferType(offer.type);
  const titleId = `offer-${offer.id}-title`;

  return (
    <article className={`offer-card${current ? ' is-current' : ''}`} aria-labelledby={titleId}>
      <div className="offer-card__main">
        <div className="offer-card__info">
          <p className="offer-card__type">
            {type?.label ?? 'Offer'}
            {current && <span className="tag">Current</span>}
          </p>
          <h3 id={titleId} className="offer-card__name">{offer.name}</h3>
          {offer.description && <p className="offer-card__desc">{offer.description}</p>}
          {offer.targetCustomer && (
            <p className="offer-card__target">
              <span>Target customer:</span> {offer.targetCustomer}
            </p>
          )}
        </div>

        <dl className="offer-card__figures">
          <div>
            <dt>Price</dt>
            <dd>
              {formatMoney(offer.price, currency)}
              <span className="offer-card__unit"> / {unitShortLabel(offer)}</span>
            </dd>
          </div>
          <div>
            <dt>Expected sales</dt>
            <dd>
              {formatNumber(offer.expectedSales)}
              <span className="offer-card__unit"> per month</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="offer-card__footer">
        <div className="offer-card__tools">
          <Button variant="ghost" size="sm" iconLeft="edit" onClick={onEdit} aria-label={`Edit ${offer.name}`}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" iconLeft="copy" onClick={onDuplicate} aria-label={`Duplicate ${offer.name}`}>
            Duplicate
          </Button>
          <Button variant="ghost" size="sm" iconLeft="trash" onClick={onDelete} aria-label={`Delete ${offer.name}`} className="btn--ghost-danger">
            Delete
          </Button>
        </div>
        <Button size="sm" iconRight="arrow-right" onClick={onOpen} className="offer-card__next">
          Continue to costs
        </Button>
      </div>
    </article>
  );
}
