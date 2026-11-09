import { useId } from 'react';

/** Single-choice segmented control built on native radios. */
export default function Segmented({ label, options, value, onChange, name, hint, size }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <fieldset className="field segmented-field" aria-describedby={hintId}>
      <legend className="field__label">{label}</legend>
      <div className={`segmented${size === 'sm' ? ' segmented--sm' : ''}`}>
        {options.map((o) => (
          <label key={o.id} className={`segmented__option${value === o.id ? ' is-selected' : ''}`}>
            <input
              className="visually-hidden"
              type="radio"
              name={name ?? id}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
            />
            {o.label}
          </label>
        ))}
      </div>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
    </fieldset>
  );
}
