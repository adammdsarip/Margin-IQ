import { useId, useState } from 'react';
import { BUSINESS_MODELS } from '../../data/businessModels.js';
import Button from '../../components/ui/Button.jsx';

export default function CreateProfileForm({ defaultModelId, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [modelId, setModelId] = useState(defaultModelId ?? '');
  const [touched, setTouched] = useState(false);
  const nameId = useId();
  const modelFieldId = useId();
  const errorId = useId();

  const trimmed = name.trim();
  const nameError = touched && !trimmed ? 'Enter a business name.' : null;
  const modelError = touched && !modelId ? 'Select a business model.' : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!trimmed || !modelId) return;
    onSubmit({ name: trimmed, businessModelId: modelId });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={nameId}>Business name</label>
        <input
          id={nameId}
          className="field__input"
          type="text"
          value={name}
          maxLength={80}
          autoComplete="organization"
          placeholder="e.g. Studio Lumen Photography"
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? `${errorId}-name` : undefined}
          autoFocus
        />
        {nameError && <p id={`${errorId}-name`} className="field__error">{nameError}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={modelFieldId}>Business model</label>
        <div className="field__select-wrap">
          <select
            id={modelFieldId}
            className="field__input field__select"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            aria-invalid={Boolean(modelError)}
            aria-describedby={modelError ? `${errorId}-model` : undefined}
          >
            <option value="" disabled>Select a business model</option>
            {BUSINESS_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        {modelError && <p id={`${errorId}-model`} className="field__error">{modelError}</p>}
      </div>

      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create profile</Button>
      </div>
    </form>
  );
}
