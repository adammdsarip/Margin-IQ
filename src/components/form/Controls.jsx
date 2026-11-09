import { forwardRef } from 'react';

export const TextInput = forwardRef(function TextInput({ className = '', ...props }, ref) {
  return <input ref={ref} type="text" className={`field__input ${className}`.trim()} {...props} />;
});

export function TextArea({ className = '', rows = 3, ...props }) {
  return <textarea rows={rows} className={`field__input field__textarea ${className}`.trim()} {...props} />;
}

export function Select({ options, placeholder, className = '', ...props }) {
  return (
    <div className="field__select-wrap">
      <select className={`field__input field__select ${className}`.trim()} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Numeric input with a fixed prefix (currency) or suffix. */
export function AffixInput({ prefix, suffix, className = '', id, ...props }) {
  return (
    <div className="field__affix">
      {prefix && <span className="field__affix-text" aria-hidden="true">{prefix}</span>}
      <input id={id} className={`field__input ${className}`.trim()} {...props} />
      {suffix && <span className="field__affix-text" aria-hidden="true">{suffix}</span>}
    </div>
  );
}
