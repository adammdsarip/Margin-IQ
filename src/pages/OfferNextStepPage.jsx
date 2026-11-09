import { useEffect } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import useRouteRecords from '../hooks/useRouteRecords.js';
import { getOfferType, getSalesPeriod, unitShortLabel } from '../data/businessSetup.js';
import { formatMoney, formatNumber } from '../utils/format.js';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import BackLink from '../components/ui/BackLink.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/form/Field.jsx';
import { Select } from '../components/form/Controls.jsx';
import '../components/form/Form.css';
import './pages.css';

/**
 * Entry point for the next calculator stage for one offer.
 * Placeholder until Stage 3 (costs & margins) is built.
 */
export default function OfferNextStepPage() {
  const { profile, offer, ready } = useRouteRecords();
  const { getOffers, selectOffer } = useAppState();

  useEffect(() => {
    if (offer) selectOffer(offer.id);
  }, [offer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;

  const offers = getOffers(profile.id);
  const base = `/business/${profile.id}`;
  const type = getOfferType(offer.type);

  return (
    <div className="page">
      <div className="container page__content">
        <StepIndicator current="costs" />

        <div className="page-head page-head--split">
          <div className="page-head__main">
            <BackLink onClick={() => navigate(base)}>{profile.name}</BackLink>
            <p className="eyebrow">Costs & margins</p>
            <h1 className="page-head__title">{offer.name}</h1>
          </div>
          {offers.length > 1 && (
            <div className="page-head__actions offer-switch">
              <Field label="Switch offer">
                <Select
                  value={offer.id}
                  onChange={(e) => navigate(`${base}/offers/${e.target.value}`)}
                  options={offers.map((o) => ({ id: o.id, label: o.name }))}
                />
              </Field>
            </div>
          )}
        </div>

        <dl className="detail-grid">
          <div className="detail-grid__item">
            <dt>Offer type</dt>
            <dd>{type?.label ?? '—'}</dd>
          </div>
          <div className="detail-grid__item">
            <dt>Price</dt>
            <dd className="num">
              {formatMoney(offer.price, profile.currency)} / {unitShortLabel(offer)}
            </dd>
          </div>
          <div className="detail-grid__item">
            <dt>Expected sales</dt>
            <dd className="num">
              {formatNumber(offer.expectedSales)} {getSalesPeriod(offer.salesPeriod)?.label}
            </dd>
          </div>
          <div className="detail-grid__item">
            <dt>Target customer</dt>
            <dd>{offer.targetCustomer || '—'}</dd>
          </div>
        </dl>

        <div className="placeholder" role="status">
          <p className="eyebrow">Coming in Stage 3</p>
          <p className="placeholder__title">Costs & margins for this offer</p>
          <p className="placeholder__text">
            You'll enter the direct costs for "{offer.name}" here and see its margin and break-even
            point. Each offer keeps its own assumptions.
          </p>
          <div className="placeholder__actions">
            <Button variant="secondary" iconLeft="edit" onClick={() => navigate(`${base}/offers/${offer.id}/edit`)}>
              Edit offer
            </Button>
            <Button variant="secondary" iconLeft="arrow-left" onClick={() => navigate(base)}>
              Back to business
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
