import { useEffect, useState } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import useRouteRecords from '../hooks/useRouteRecords.js';
import { unitShortLabel } from '../data/businessSetup.js';
import { formatMoney, formatNumber } from '../utils/format.js';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import BackLink from '../components/ui/BackLink.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { showToast } from '../components/ui/toast.js';
import CostSummary from '../features/costs/CostSummary.jsx';
import CostList, { FrequencyTotals } from '../features/costs/CostList.jsx';
import CostFilters, { EMPTY_FILTERS, applyFilters } from '../features/costs/CostFilters.jsx';
import CostForm from '../features/costs/CostForm.jsx';
import CategoryManager from '../features/costs/CategoryManager.jsx';
import '../features/costs/Costs.css';
import './pages.css';

/**
 * Cost structure for one business.
 *   /business/:profileId/costs                → business-level costs
 *   /business/:profileId/offers/:offerId      → costs for one offer
 * The summary at the top always covers the whole business.
 */
export default function CostsPage() {
  const { profile, offer, ready } = useRouteRecords();
  const {
    getOffers,
    getCosts,
    getCostCategories,
    selectOffer,
    saveCost,
    duplicateCost,
    deleteCost,
    saveCategory,
    deleteCategory,
  } = useAppState();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editing, setEditing] = useState(null); // null | 'new' | cost
  const [pendingDelete, setPendingDelete] = useState(null);
  const [managingCategories, setManagingCategories] = useState(false);

  useEffect(() => {
    if (offer) selectOffer(offer.id);
  }, [offer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;

  const base = `/business/${profile.id}`;
  const offers = getOffers(profile.id);
  const allCosts = getCosts(profile.id);
  const categories = getCostCategories(profile.id);
  const scopeCosts = allCosts.filter((c) => (offer ? c.offerId === offer.id : !c.offerId));
  const visible = applyFilters(scopeCosts, filters);
  const filtered = visible.length !== scopeCosts.length;
  const scopeName = offer ? offer.name : 'Business-level costs';

  const tabs = [
    { id: 'business', label: 'Business-level', path: `${base}/costs`, count: allCosts.filter((c) => !c.offerId).length, current: !offer },
    ...offers.map((o) => ({
      id: o.id,
      label: o.name,
      path: `${base}/offers/${o.id}`,
      count: allCosts.filter((c) => c.offerId === o.id).length,
      current: offer?.id === o.id,
    })),
  ];

  const handleSave = (values) => {
    saveCost(values);
    const where = values.offerId ? offers.find((o) => o.id === values.offerId)?.name : 'business-level costs';
    const movedOut = Boolean(values.offerId) !== Boolean(offer) || (offer && values.offerId !== offer.id);
    showToast(
      editing === 'new'
        ? `Added "${values.name}"${movedOut ? ` to ${where}` : ''}`
        : `Saved "${values.name}"${movedOut ? `, moved to ${where}` : ''}`
    );
    setEditing(null);
  };

  return (
    <div className="page">
      <div className="container page__content">
        <StepIndicator current="costs" />

        <div className="page-head page-head--split">
          <div className="page-head__main">
            <BackLink onClick={() => navigate(base)}>{profile.name}</BackLink>
            <p className="eyebrow">{profile.name}</p>
            <h1 className="page-head__title">Cost structure</h1>
            <p className="page-head__text">
              Record what it costs to run the business and deliver each offer. Amounts are in {profile.currency}.
            </p>
          </div>
          <div className="page-head__actions">
            <Button variant="secondary" onClick={() => setManagingCategories(true)}>Categories</Button>
            <Button iconLeft="plus" onClick={() => setEditing('new')}>Add cost</Button>
          </div>
        </div>

        <CostSummary costs={allCosts} currency={profile.currency} />

        <section className="cost-panel" aria-labelledby="cost-scope-title">
          <nav className="scope-tabs" aria-label="Cost level">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`scope-tabs__tab${t.current ? ' is-current' : ''}`}
                aria-current={t.current ? 'page' : undefined}
                onClick={() => navigate(t.path)}
              >
                <span className="scope-tabs__label">{t.label}</span>
                <span className="scope-tabs__count">{t.count}</span>
              </button>
            ))}
          </nav>

          <div className="cost-panel__body">
            <div className="cost-panel__head">
              <div>
                <h2 id="cost-scope-title" className="section-heading__title">{scopeName}</h2>
                {offer ? (
                  <p className="section-heading__description">
                    Sells at {formatMoney(offer.price, profile.currency)} / {unitShortLabel(offer)} · expected{' '}
                    {formatNumber(offer.expectedSales)} per month ·{' '}
                    <button type="button" className="text-link" onClick={() => navigate(`${base}/offers/${offer.id}/edit`)}>
                      Edit offer
                    </button>
                  </p>
                ) : (
                  <p className="section-heading__description">Shared costs that aren't tied to one offer.</p>
                )}
              </div>
            </div>

            {scopeCosts.length > 0 && (
              <>
                <CostFilters filters={filters} onChange={setFilters} categories={categories} />
                {filtered && (
                  <p className="cost-panel__result">
                    Showing {visible.length} of {scopeCosts.length} costs ·{' '}
                    <button type="button" className="text-link" onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</button>
                  </p>
                )}
              </>
            )}

            {scopeCosts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon"><Icon name="offer" size={20} /></span>
                <p className="empty-state__title">No {offer ? 'costs for this offer' : 'business-level costs'} yet</p>
                <p className="empty-state__text">
                  {offer
                    ? 'Add what you spend each time you deliver this offer, like materials, transport or freelancers.'
                    : 'Add shared costs such as rent, utilities, software or insurance.'}
                </p>
                <Button iconLeft="plus" onClick={() => setEditing('new')}>Add cost</Button>
              </div>
            ) : visible.length === 0 ? (
              <p className="cost-panel__none">No costs match your filters.</p>
            ) : (
              <>
                <CostList
                  costs={visible}
                  currency={profile.currency}
                  categories={categories}
                  offers={offers}
                  onEdit={(c) => setEditing(c)}
                  onDuplicate={(c) => {
                    duplicateCost(c.id);
                    showToast(`Duplicated "${c.name}"`);
                  }}
                  onDelete={(c) => setPendingDelete(c)}
                />
                <div className="cost-panel__totals">
                  <span className="cost-panel__totals-label">{filtered ? 'Total of shown costs' : `Total for ${offer ? 'this offer' : 'business-level costs'}`}</span>
                  <FrequencyTotals costs={visible} currency={profile.currency} />
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing === 'new' ? 'Add cost' : 'Edit cost'}
        description={editing === 'new' ? `Adding to ${offer ? `"${offer.name}"` : 'business-level costs'}. You can change this below.` : undefined}
      >
        {editing !== null && (
          <CostForm
            profile={profile}
            offers={offers}
            categories={categories}
            cost={editing === 'new' ? null : editing}
            defaults={{ level: offer ? 'offer' : 'business', offerId: offer?.id }}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
            onCreateCategory={(name) => saveCategory({ profileId: profile.id, name })}
          />
        )}
      </Modal>

      <Modal
        open={managingCategories}
        onClose={() => setManagingCategories(false)}
        title="Cost categories"
        description={`Categories for ${profile.name}. Rename any of them or add your own.`}
      >
        {managingCategories && (
          <CategoryManager
            categories={categories}
            costs={allCosts}
            onSave={saveCategory}
            onDelete={deleteCategory}
            onDone={() => setManagingCategories(false)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this cost?"
        description={pendingDelete ? `"${pendingDelete.name}" will be removed. This can't be undone.` : ''}
        cancelLabel="Keep cost"
        confirmLabel="Delete cost"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteCost(pendingDelete.id);
          showToast(`Deleted "${pendingDelete.name}"`);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
