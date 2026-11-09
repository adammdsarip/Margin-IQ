import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import useRouteRecords from '../hooks/useRouteRecords.js';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import BackLink from '../components/ui/BackLink.jsx';
import { showToast } from '../components/ui/toast.js';
import BusinessProfileForm from '../features/business/BusinessProfileForm.jsx';
import './pages.css';

/** Create (/business/new) or edit (/business/:profileId/edit) a business profile. */
export default function BusinessFormPage() {
  const { profile, ready } = useRouteRecords();
  const { selectedModelId, saveProfile, getOffers } = useAppState();

  if (!ready) return null;
  const isNew = !profile;

  const back = () => navigate(isNew ? '/' : `/business/${profile.id}`);

  return (
    <BusinessProfileForm
      profile={profile}
      defaultModelId={selectedModelId}
      offerCount={profile ? getOffers(profile.id).length : 0}
      onCancel={back}
      onSave={(values) => {
        const id = saveProfile(values);
        showToast(isNew ? 'Business profile created' : 'Business profile saved');
        navigate(`/business/${id}`);
      }}
      header={
        <>
          <StepIndicator current="business" />
          <div className="page-head">
            <BackLink onClick={back}>{isNew ? 'Business model' : profile.name}</BackLink>
            <h1 className="page-head__title">{isNew ? 'Set up your business' : 'Edit business'}</h1>
            <p className="page-head__text">
              {isNew
                ? 'Tell us about the business. You can add its offers on the next screen.'
                : 'Update the details for this business. Its offers stay as they are.'}
            </p>
          </div>
        </>
      }
    />
  );
}
