import { useState } from 'react';
import {
  CLASSIFICATIONS,
  COST_LEVELS,
  COST_STATUSES,
  FALLBACK_CATEGORY_KEY,
  FREQUENCIES,
  getCostSuggestions,
} from '../../data/costSetup.js';
import { isBlank, parseAmount } from '../../utils/validation.js';
import { formatMoney } from '../../utils/format.js';
import useFormState from '../../hooks/useFormState.js';
import Field from '../../components/form/Field.jsx';
import Segmented from '../../components/form/Segmented.jsx';
import { AffixInput, Select, TextArea, TextInput } from '../../components/form/Controls.jsx';
import Button from '../../components/ui/Button.jsx';
import { cleanCustomFrequency, roundMoney } from './costMath.js';
import '../../components/form/Form.css';

const NEW_CATEGORY = '__new';

/** Keeps classification and frequency consistent: "one-time" means both. */
const DEFAULT_FREQUENCY = { fixed: 'monthly', variable: 'per-unit', 'one-time': 'one-time' };

const validate = (v) => {
  const errors = {};
  if (isBlank(v.name)) errors.name = 'Enter a cost name.';
  if (v.level === 'offer' && !v.offerId) errors.offerId = 'Choose the offer this cost belongs to.';
  if (!v.categoryId || v.categoryId === NEW_CATEGORY) errors.categoryId = 'Select a category.';
  if (v.frequency === 'custom' && !cleanCustomFrequency(v.customFrequency)) errors.customFrequency = 'Describe the frequency, e.g. event day.';
  const q = parseAmount(v.quantity);
  if (q === null || q <= 0) errors.quantity = 'Enter a quantity above 0.';
  if (parseAmount(v.unitCost) === null) errors.unitCost = 'Enter a unit cost, e.g. 380 or 1,200.50.';
  if (v.useCustomTotal && parseAmount(v.totalOverride) === null) errors.totalOverride = 'Enter the total amount.';
  return errors;
};

const numToInput = (n) => (typeof n === 'number' ? String(n) : '');

export default function CostForm({ profile, offers, categories, cost, defaults, onSave, onCancel, onCreateCategory }) {
  const isNew = !cost;
  const categoryByKey = (key) =>
    categories.find((c) => c.key === key) ?? categories.find((c) => c.key === FALLBACK_CATEGORY_KEY) ?? categories[0];

  const { values, setField, setValues, bind, errors, trySubmit } = useFormState(
    {
      name: cost?.name ?? '',
      level: cost ? (cost.offerId ? 'offer' : 'business') : defaults.level,
      offerId: cost?.offerId ?? defaults.offerId ?? '',
      categoryId: cost?.categoryId ?? '',
      classification: cost?.classification ?? (defaults.level === 'offer' ? 'variable' : 'fixed'),
      frequency: cost?.frequency ?? (defaults.level === 'offer' ? 'per-unit' : 'monthly'),
      customFrequency: cost?.customFrequency ?? '',
      quantity: numToInput(cost?.quantity ?? 1),
      unitCost: numToInput(cost?.unitCost),
      useCustomTotal: typeof cost?.totalOverride === 'number',
      totalOverride: numToInput(cost?.totalOverride),
      status: cost?.status ?? 'estimated',
      notes: cost?.notes ?? '',
    },
    validate
  );
  const [newCategory, setNewCategory] = useState('');
  const [showNotes, setShowNotes] = useState(Boolean(cost?.notes));

  const suggestions = isNew ? getCostSuggestions(values.level, profile.businessModelId) : [];
  const quantity = parseAmount(values.quantity);
  const unitCost = parseAmount(values.unitCost);
  const calculated = quantity !== null && unitCost !== null ? roundMoney(quantity * unitCost) : null;
  const override = parseAmount(values.totalOverride);
  const total = values.useCustomTotal ? override : calculated;
  const money = (n) => formatMoney(n, profile.currency);

  const applySuggestion = (sug) =>
    setValues((v) => ({
      ...v,
      name: sug.name,
      categoryId: categoryByKey(sug.category)?.id ?? '',
      classification: sug.classification,
      frequency: sug.frequency,
    }));

  const setClassification = (id) =>
    setValues((v) => ({
      ...v,
      classification: id,
      frequency:
        id === 'one-time' ? 'one-time' : v.frequency === 'one-time' ? DEFAULT_FREQUENCY[id] : v.frequency,
    }));

  const setFrequency = (e) => {
    const id = e.target.value;
    setValues((v) => ({
      ...v,
      frequency: id,
      classification:
        id === 'one-time' ? 'one-time' : v.classification === 'one-time' ? 'fixed' : v.classification,
    }));
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    const id = onCreateCategory(name);
    setField('categoryId', id);
    setNewCategory('');
  };

  const toggleCustomTotal = (e) => {
    const on = e.target.checked;
    setValues((v) => ({
      ...v,
      useCustomTotal: on,
      totalOverride: on && !v.totalOverride && calculated !== null ? String(calculated) : v.totalOverride,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trySubmit()) return;
    onSave({
      id: cost?.id,
      profileId: profile.id,
      offerId: values.level === 'offer' ? values.offerId : null,
      name: values.name.trim(),
      categoryId: values.categoryId,
      classification: values.classification,
      frequency: values.frequency,
      customFrequency: values.frequency === 'custom' ? cleanCustomFrequency(values.customFrequency) : '',
      quantity,
      unitCost,
      totalOverride: values.useCustomTotal ? override : null,
      status: values.status,
      notes: values.notes.trim(),
    });
  };

  const categoryOptions = [
    ...categories.map((c) => ({ id: c.id, label: c.name })),
    { id: NEW_CATEGORY, label: '+ Add a new category…' },
  ];

  return (
    <form className="cost-form" onSubmit={handleSubmit} noValidate>
      {suggestions.length > 0 && (
        <div className="cost-form__suggestions">
          <p className="cost-form__group-title">Suggestions</p>
          <div className="chips">
            {suggestions.map((sug) => (
              <button
                key={sug.name}
                type="button"
                className={`chip${values.name === sug.name ? ' is-selected' : ''}`}
                onClick={() => applySuggestion(sug)}
              >
                {sug.name}
              </button>
            ))}
          </div>
          <p className="field__hint">Pick one to prefill the form, or type your own below.</p>
        </div>
      )}

      <div className="cost-form__group">
        <p className="cost-form__group-title">Cost</p>
        <Field label="Cost name" error={errors.name}>
          <TextInput {...bind('name')} maxLength={80} placeholder="e.g. Resort accommodation" />
        </Field>

        <Segmented
          label="Applies to"
          options={COST_LEVELS.map((l) => ({
            ...l,
            label: l.id === 'business' ? 'Whole business' : 'One offer',
          }))}
          value={values.level}
          onChange={(level) => setField('level', level)}
          hint={
            values.level === 'business'
              ? 'Shared costs like rent or software, not tied to a single offer.'
              : 'Costs that only exist because you sell this offer.'
          }
        />

        {values.level === 'offer' && (
          <Field label="Offer" error={errors.offerId}>
            {offers.length > 0 ? (
              <Select
                {...bind('offerId')}
                options={offers.map((o) => ({ id: o.id, label: o.name }))}
                placeholder="Select an offer"
              />
            ) : (
              <p className="field__static">This business has no offers yet.</p>
            )}
          </Field>
        )}

        <Field label="Category" error={errors.categoryId}>
          <Select {...bind('categoryId')} options={categoryOptions} placeholder="Select a category" />
        </Field>
        {values.categoryId === NEW_CATEGORY && (
          <div className="inline-add">
            <Field label="New category name">
              <TextInput
                value={newCategory}
                maxLength={40}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                placeholder="e.g. Permits & licences"
                autoFocus
              />
            </Field>
            <Button variant="secondary" onClick={addCategory} disabled={!newCategory.trim()}>
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="cost-form__group">
        <p className="cost-form__group-title">Type and frequency</p>
        <Segmented
          label="Classification"
          options={CLASSIFICATIONS}
          value={values.classification}
          onChange={setClassification}
          hint={CLASSIFICATIONS.find((c) => c.id === values.classification)?.hint}
        />
        <div className="field-row">
          <Field label="Frequency">
            <Select {...bind('frequency')} onChange={setFrequency} options={FREQUENCIES} />
          </Field>
          {values.frequency === 'custom' && (
            <Field label="Custom frequency" error={errors.customFrequency}>
              <AffixInput {...bind('customFrequency')} prefix="per" maxLength={30} placeholder="event day" />
            </Field>
          )}
        </div>
      </div>

      <div className="cost-form__group">
        <p className="cost-form__group-title">Amount</p>
        <div className="field-row">
          <Field label="Quantity" error={errors.quantity}>
            <TextInput {...bind('quantity')} inputMode="decimal" autoComplete="off" />
          </Field>
          <Field label="Unit cost" error={errors.unitCost}>
            <AffixInput {...bind('unitCost')} prefix={profile.currency} inputMode="decimal" autoComplete="off" placeholder="0.00" />
          </Field>
        </div>

        <div className="total-box" aria-live="polite">
          <div className="total-box__row">
            <span className="total-box__label">Total cost</span>
            <span className="total-box__value">{total !== null ? money(total) : '—'}</span>
          </div>
          <p className="total-box__method">
            {calculated !== null
              ? `Quantity × Unit cost = ${values.quantity} × ${money(unitCost)} = ${money(calculated)}`
              : 'Quantity × Unit cost'}
            {values.useCustomTotal && calculated !== null && override !== null && override !== calculated && (
              <span className="total-box__flag"> · Using a custom total</span>
            )}
          </p>
          <label className="checkbox">
            <input type="checkbox" checked={values.useCustomTotal} onChange={toggleCustomTotal} />
            Enter a custom total instead
          </label>
          {values.useCustomTotal && (
            <Field label="Custom total" error={errors.totalOverride} hint="Use this for quotes, discounts or amounts that aren't a simple multiplication.">
              <AffixInput {...bind('totalOverride')} prefix={profile.currency} inputMode="decimal" autoComplete="off" />
            </Field>
          )}
        </div>
      </div>

      <div className="cost-form__group">
        <p className="cost-form__group-title">Details</p>
        <Segmented
          label="Is this amount estimated or actual?"
          options={COST_STATUSES}
          value={values.status}
          onChange={(status) => setField('status', status)}
          size="sm"
        />
        {showNotes ? (
          <Field label="Notes" optional>
            <TextArea {...bind('notes')} rows={2} maxLength={300} placeholder="e.g. Quote from supplier, valid until March" />
          </Field>
        ) : (
          <button type="button" className="text-link cost-form__notes-link" onClick={() => setShowNotes(true)}>
            Add a note
          </button>
        )}
      </div>

      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" iconLeft="check">{isNew ? 'Add cost' : 'Save changes'}</Button>
      </div>
    </form>
  );
}
