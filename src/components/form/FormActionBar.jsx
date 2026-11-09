import Button from '../ui/Button.jsx';
import '../ui/ActionBar.css';
import './Form.css';

/** Sticky save/cancel bar for full-page forms. Matches the Stage 1 selection bar. */
export default function FormActionBar({ summary, submitLabel = 'Save', onCancel }) {
  return (
    <div className="selection-bar form-action-bar">
      <div className="container selection-bar__inner">
        <div className="selection-bar__summary">
          <span className="selection-bar__label">Unsaved form</span>
          <span className="selection-bar__value">
            <span className="selection-bar__strong">{summary}</span>
          </span>
        </div>
        <div className="form-action-bar__buttons">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" iconLeft="check">{submitLabel}</Button>
        </div>
      </div>
    </div>
  );
}
