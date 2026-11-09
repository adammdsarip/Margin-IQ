import { useCallback, useState } from 'react';

/**
 * Minimal form state: values, per-field change handlers and validation
 * that only shows errors after the first submit attempt.
 */
export default function useFormState(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted ? validate(values) : {};

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setField(name, e.target.value),
  });

  /** Returns true when valid. */
  const trySubmit = () => {
    setSubmitted(true);
    const result = validate(values);
    const valid = Object.keys(result).length === 0;
    if (!valid) {
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"]')?.focus();
      });
    }
    return valid;
  };

  return { values, setValues, setField, bind, errors, trySubmit };
}
