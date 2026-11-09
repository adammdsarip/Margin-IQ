import { useState } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import BusinessModelSelector from '../features/business-model/BusinessModelSelector.jsx';
import SelectionBar from '../features/business-model/SelectionBar.jsx';
import ProfileList from '../features/profiles/ProfileList.jsx';
import CreateProfileForm from '../features/profiles/CreateProfileForm.jsx';
import './pages.css';

export default function BusinessModelPage() {
  const {
    selectedModelId,
    selectedModel,
    selectModel,
    profiles,
    activeProfile,
    activeProfileId,
    selectProfile,
    clearProfile,
    createProfile,
    commitSelection,
  } = useAppState();
  const [creating, setCreating] = useState(false);

  const handleContinue = () => {
    if (!selectedModel) return;
    commitSelection();
    navigate(activeProfile ? `/business/${activeProfile.id}` : '/business/new');
  };

  return (
    <div className="page">
      <div className="container page__content">
        <StepIndicator current="model" />

        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome__intro">
            <h1 id="welcome-title" className="welcome__title">Welcome to MarginIQ</h1>
            <p id="model-question" className="welcome__subtitle">
              What type of business would you like to calculate?
            </p>
            <p className="welcome__text">
              Select your business model to customise your profitability and marketing calculations.
            </p>
          </div>
          <BusinessModelSelector
            value={selectedModelId}
            onChange={selectModel}
            labelledBy="model-question"
          />
        </section>

        <section id="profiles" className="section" aria-labelledby="profiles-title">
          <SectionHeading
            id="profiles-title"
            title="Your Business Profiles"
            description="Pick up where you left off, or create a profile for another business."
            action={
              <Button variant="secondary" size="sm" iconLeft="plus" onClick={() => setCreating(true)}>
                New profile
              </Button>
            }
          />
          <ProfileList
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelect={selectProfile}
            onCreate={() => setCreating(true)}
          />
        </section>
      </div>

      <SelectionBar
        model={selectedModel}
        profile={activeProfile}
        onContinue={handleContinue}
        onClearProfile={clearProfile}
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create business profile"
        description="Profiles keep each business's numbers separate."
      >
        <CreateProfileForm
          defaultModelId={selectedModelId}
          onCancel={() => setCreating(false)}
          onSubmit={(profile) => {
            createProfile(profile);
            setCreating(false);
          }}
        />
      </Modal>
    </div>
  );
}
