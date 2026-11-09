import { useState } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import useRouteRecords from '../hooks/useRouteRecords.js';
import { getBusinessModel } from '../data/businessModels.js';
import { getIndustry } from '../data/businessSetup.js';
import { formatDate } from '../utils/format.js';
import { displayWebsite } from '../utils/validation.js';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import BackLink from '../components/ui/BackLink.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { showToast } from '../components/ui/toast.js';
import OfferCard from '../features/offers/OfferCard.jsx';
import DeleteOfferDialog from '../features/offers/DeleteOfferDialog.jsx';
import '../features/offers/Offers.css';
import './pages.css';

export default function BusinessOverviewPage() {
  const { profile, ready } = useRouteRecords();
  const { getOffers, activeOfferId, duplicateOffer, deleteOffer, selectOffer } = useAppState();
  const [pendingDelete, setPendingDelete] = useState(null);

  if (!ready) return null;

  const offers = getOffers(profile.id);
  const model = getBusinessModel(profile.businessModelId);
  const industry = getIndustry(profile.industry);
  const incomplete = !profile.industry;
  const base = `/business/${profile.id}`;
  const newOffer = () => navigate(`${base}/offers/new`);

  const details = [
    { label: 'Business model', value: model?.name ?? 'Not set', icon: model?.icon },
    { label: 'Offers', value: String(offers.length) },
    { label: 'Currency', value: profile.currency },
    { label: 'Industry', value: industry?.label ?? 'Not set' },
    { label: 'Location', value: profile.location || '—' },
    {
      label: 'Website',
      value: profile.website ? (
        <a href={profile.website} target="_blank" rel="noreferrer noopener" className="text-link">
          {displayWebsite(profile.website)}
        </a>
      ) : (
        '—'
      ),
    },
    { label: 'Created', value: formatDate(profile.createdAt) },
    { label: 'Last updated', value: formatDate(profile.updatedAt) },
  ];

  return (
    <div className="page">
      <div className="container page__content">
        <StepIndicator current="offers" />

        <div className="page-head page-head--split">
          <div className="page-head__main">
            <BackLink onClick={() => navigate('/')}>All businesses</BackLink>
            <p className="eyebrow">Business overview</p>
            <h1 className="page-head__title">{profile.name}</h1>
            {profile.description && <p className="page-head__text">{profile.description}</p>}
          </div>
          <div className="page-head__actions">
            <Button variant="secondary" iconLeft="edit" onClick={() => navigate(`${base}/edit`)}>
              Edit business
            </Button>
          </div>
        </div>

        {incomplete && (
          <div className="callout" role="note">
            <Icon name="info" size={18} />
            <p>
              This profile is missing its industry and other details.{' '}
              <button type="button" className="text-link" onClick={() => navigate(`${base}/edit`)}>
                Complete the profile
              </button>
            </p>
          </div>
        )}

        <dl className="detail-grid">
          {details.map((d) => (
            <div key={d.label} className="detail-grid__item">
              <dt>{d.label}</dt>
              <dd>
                {d.icon && <Icon name={d.icon} size={16} />}
                {d.value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="section" aria-labelledby="offers-title">
          <SectionHeading
            id="offers-title"
            title="Offers"
            description="Each offer keeps its own price, sales estimate and, later, its own costs."
            action={
              offers.length > 0 && (
                <Button variant="secondary" size="sm" iconLeft="plus" onClick={newOffer}>
                  New offer
                </Button>
              )
            }
          />

          {offers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon"><Icon name="offer" size={20} /></span>
              <p className="empty-state__title">No offers yet</p>
              <p className="empty-state__text">
                Add the first {model ? model.name.toLowerCase().replace(' business', '') : ''} offer you want
                to evaluate. You can add as many as you like and compare them later.
              </p>
              <Button iconLeft="plus" onClick={newOffer}>Create New Offer</Button>
            </div>
          ) : (
            <ul className="offer-list">
              {offers.map((offer) => (
                <li key={offer.id}>
                  <OfferCard
                    offer={offer}
                    currency={profile.currency}
                    current={offer.id === activeOfferId}
                    onOpen={() => {
                      selectOffer(offer.id);
                      navigate(`${base}/offers/${offer.id}`);
                    }}
                    onEdit={() => navigate(`${base}/offers/${offer.id}/edit`)}
                    onDuplicate={() => {
                      duplicateOffer(offer.id);
                      showToast(`Duplicated "${offer.name}"`);
                    }}
                    onDelete={() => setPendingDelete(offer)}
                  />
                </li>
              ))}
              <li>
                <button type="button" className="offer-create" onClick={newOffer}>
                  <Icon name="plus" size={18} />
                  Create New Offer
                </button>
              </li>
            </ul>
          )}
        </section>
      </div>

      <DeleteOfferDialog
        offer={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteOffer(pendingDelete.id);
          showToast(`Deleted "${pendingDelete.name}"`);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
