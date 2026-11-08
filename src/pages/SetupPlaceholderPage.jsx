import { useEffect } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { navigate } from '../app/router.jsx';
import StepIndicator from '../components/layout/StepIndicator.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import './pages.css';

/**
 * Placeholder for step 2. The business-details module will replace this.
 */
export default function SetupPlaceholderPage() {
  const { selectedModel, activeProfile } = useAppState();

  useEffect(() => {
    if (!selectedModel) navigate('/');
  }, [selectedModel]);

  if (!selectedModel) return null;

  return (
    <div className="page">
      <div className="container page__content">
        <StepIndicator current="details" />

        <div>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            <Icon name="arrow-left" size={16} />
            Business model
          </button>
          <h1 className="welcome__title">Business details</h1>
          <p className="welcome__text">
            Next, you'll enter the details MarginIQ needs for a {selectedModel.name.toLowerCase()}.
          </p>
        </div>

        <dl className="summary">
          <div className="summary__item">
            <dt>Business model</dt>
            <dd>
              <Icon name={selectedModel.icon} size={18} />
              {selectedModel.name}
            </dd>
          </div>
          <div className="summary__item">
            <dt>Profile</dt>
            <dd>{activeProfile ? activeProfile.name : 'Unsaved session'}</dd>
          </div>
        </dl>

        <div className="placeholder" role="status">
          <p className="eyebrow">Coming next</p>
          <p className="placeholder__title">Business details module</p>
          <p className="placeholder__text">
            This step is a placeholder. Revenue, cost and marketing inputs tailored to your
            business model will be added in the next module.
          </p>
          <Button variant="secondary" iconLeft="arrow-left" onClick={() => navigate('/')}>
            Back to business model
          </Button>
        </div>
      </div>
    </div>
  );
}
