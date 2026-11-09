import Button from '../../components/ui/Button.jsx';
import '../../components/ui/ActionBar.css';

/** Sticky action bar summarising the current choice and gating Continue. */
export default function SelectionBar({ model, profile, onContinue, onClearProfile }) {
  return (
    <div className="selection-bar" role="region" aria-label="Selection summary">
      <div className="container selection-bar__inner">
        <div className="selection-bar__summary" aria-live="polite">
          <span className="selection-bar__label">
            {profile ? 'Profile' : 'Business model'}
          </span>
          {profile ? (
            <span className="selection-bar__value">
              <span className="selection-bar__strong" title={profile.name}>{profile.name}</span>
              <span className="selection-bar__meta">
                {model ? model.name : 'No model selected'}
                {' · '}
                <button type="button" className="text-link" onClick={onClearProfile}>
                  Clear profile
                </button>
              </span>
            </span>
          ) : (
            <span className="selection-bar__value">
              <span className={model ? 'selection-bar__strong' : 'selection-bar__placeholder'}>
                {model ? model.name : 'Select a business model to continue'}
              </span>
            </span>
          )}
        </div>
        <Button
          onClick={onContinue}
          disabled={!model}
          iconRight="arrow-right"
          className="selection-bar__action"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
