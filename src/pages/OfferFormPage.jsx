import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import useRouteRecords from '../hooks/useRouteRecords.js';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import BackLink from '../components/ui/BackLink.jsx';
import { showToast } from '../components/ui/toast.js';
import OfferForm from '../features/offers/OfferForm.jsx';
import './pages.css';

/** Create (/business/:profileId/offers/new) or edit (…/offers/:offerId/edit) an offer. */
export default function OfferFormPage() {
  const { profile, offer, ready } = useRouteRecords();
  const { saveOffer } = useAppState();

  if (!ready) return null;
  const isNew = !offer;
  const back = () => navigate(`/business/${profile.id}`);

  return (
    <OfferForm
      offer={offer}
      profile={profile}
      onCancel={back}
      onSave={(values) => {
        saveOffer(values);
        showToast(isNew ? `Created "${values.name}"` : `Saved "${values.name}"`);
        back();
      }}
      header={
        <>
          <StepIndicator current="offers" />
          <div className="page-head">
            <BackLink onClick={back}>{profile.name}</BackLink>
            <h1 className="page-head__title">{isNew ? 'New offer' : 'Edit offer'}</h1>
            <p className="page-head__text">
              {isNew
                ? 'Describe one thing you sell. Its numbers are kept separate from your other offers.'
                : `Changes apply only to "${offer.name}".`}
            </p>
          </div>
        </>
      }
    />
  );
}
