import { useState } from 'react';
import {
  PRICING_UNITS,
  SALES_PERIODS,
  getOfferType,
  getOfferTypes,
  getPricingUnit,
} from '../../data/businessSetup.js';
import { isBlank, parseAmount, parseWholeNumber } from '../../utils/validation.js';
import useFormState from '../../hooks/useFormState.js';
import Field from '../../components/form/Field.jsx';
import FormSection from '../../components/form/FormSection.jsx';
import { AffixInput, Select, TextArea, TextInput } from '../../components/form/Controls.jsx';
import FormActionBar from '../../components/form/FormActionBar.jsx';
import '../../components/form/Form.css';

const validate = (v) => {
  const errors = {};
  if (isBlank(v.name)) errors.name = 'Enter an offer name.';
  if (!v.type) errors.type = 'Select an offer type.';
  if (parseAmount(v.price) === null) errors.price = 'Enter a price, e.g. 1280 or 1,280.50.';
  if (!v.pricingUnit) errors.pricingUnit = 'Select how you charge.';
  if (v.pricingUnit === 'custom' && isBlank(v.customUnit)) errors.customUnit = 'Describe the unit, e.g. per room night.';
  if (parseWholeNumber(v.expectedSales) === null) errors.expectedSales = 'Enter a whole number, e.g. 12. Use 0 if unsure.';
  return errors;
};

const formatAmountInput = (n) => (typeof n === 'number' ? String(n) : '');

export default function OfferForm({ header, offer, profile, onSave, onCancel }) {
  const isNew = !offer;
  const typeOptions = getOfferTypes(profile.businessModelId);
  // Keep a saved type visible even if the business model has since changed.
  const savedType = offer?.type && getOfferType(offer.type);
  const options =
    savedType && !typeOptions.some((t) => t.id === savedType.id) ? [...typeOptions, savedType] : typeOptions;

  const [unitTouched, setUnitTouched] = useState(!isNew);
  const { values, setField, bind, errors, trySubmit } = useFormState(
    {
      name: offer?.name ?? '',
      description: offer?.description ?? '',
      type: offer?.type ?? '',
      price: formatAmountInput(offer?.price),
      pricingUnit: offer?.pricingUnit ?? '',
      customUnit: offer?.customUnit ?? '',
      expectedSales: formatAmountInput(offer?.expectedSales),
      salesPeriod: offer?.salesPeriod ?? 'month',
      targetCustomer: offer?.targetCustomer ?? '',
    },
    validate
  );

  const selectedType = getOfferType(values.type);
  const unit = getPricingUnit(values.pricingUnit);
  const unitWord = values.pricingUnit === 'custom' ? values.customUnit.trim() || 'unit' : unit?.short;

  const handleTypeChange = (e) => {
    const typeId = e.target.value;
    setField('type', typeId);
    const suggested = getOfferType(typeId)?.unit;
    if (!unitTouched && suggested) setField('pricingUnit', suggested);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trySubmit()) return;
    onSave({
      id: offer?.id,
      profileId: profile.id,
      name: values.name.trim(),
      description: values.description.trim(),
      type: values.type,
      price: parseAmount(values.price),
      pricingUnit: values.pricingUnit,
      customUnit: values.pricingUnit === 'custom' ? values.customUnit.trim() : '',
      expectedSales: parseWholeNumber(values.expectedSales),
      salesPeriod: values.salesPeriod,
      targetCustomer: values.targetCustomer.trim(),
    });
  };

  return (
    <form className="page" onSubmit={handleSubmit} noValidate>
      <div className="container page__content">
        {header}
        <div className="form-card">
          <FormSection
            title="Offer"
            description="A single product, service, package or subscription you want to evaluate."
          >
            <Field label="Offer name" error={errors.name}>
              <TextInput {...bind('name')} maxLength={80} placeholder="e.g. 3D2N Family Getaway" />
            </Field>
            <Field
              label="Offer type"
              error={errors.type}
              hint={selectedType?.hint ? `${selectedType.hint[0].toUpperCase()}${selectedType.hint.slice(1)}.` : 'Options match your business model.'}
            >
              <Select
                {...bind('type')}
                onChange={handleTypeChange}
                options={options}
                placeholder="Select an offer type"
              />
            </Field>
            <Field label="Offer description" optional hint="What the customer gets. Helps you tell similar offers apart.">
              <TextArea {...bind('description')} maxLength={400} />
            </Field>
          </FormSection>

          <FormSection
            title="Pricing"
            description="What the customer pays and how you charge for it. Enter the price before discounts."
          >
            <div className="field-row">
              <Field label="Selling price" error={errors.price}>
                <AffixInput
                  {...bind('price')}
                  prefix={profile.currency}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                />
              </Field>
              <Field
                label="Pricing unit"
                error={errors.pricingUnit}
                hint={!unitTouched && selectedType ? 'Suggested for this offer type.' : undefined}
              >
                <Select
                  {...bind('pricingUnit')}
                  onChange={(e) => {
                    setUnitTouched(true);
                    setField('pricingUnit', e.target.value);
                  }}
                  options={PRICING_UNITS}
                  placeholder="Select a unit"
                />
              </Field>
            </div>
            {values.pricingUnit === 'custom' && (
              <Field label="Custom unit" error={errors.customUnit} hint="Shown after the price, e.g. SGD 220.00 / room night.">
                <TextInput {...bind('customUnit')} maxLength={30} placeholder="e.g. room night" />
              </Field>
            )}
          </FormSection>

          <FormSection
            title="Demand"
            description="Your realistic sales estimate. Later stages use it for revenue, break-even and marketing targets."
          >
            <div className="field-row">
              <Field
                label="Expected sales / bookings"
                error={errors.expectedSales}
                hint={unitWord ? `Number of ${unitWord === 'month' || unitWord === 'year' ? 'subscribers' : `${unitWord}s`} sold.` : undefined}
              >
                <AffixInput {...bind('expectedSales')} inputMode="numeric" autoComplete="off" placeholder="0" />
              </Field>
              <Field label="Period">
                <Select {...bind('salesPeriod')} options={SALES_PERIODS} />
              </Field>
            </div>
            <Field label="Target customer" optional hint="Who this offer is for. Keep it specific.">
              <TextInput {...bind('targetCustomer')} maxLength={120} placeholder="e.g. Families with young children in Singapore" />
            </Field>
          </FormSection>
        </div>
      </div>

      <FormActionBar
        onCancel={onCancel}
        submitLabel={isNew ? 'Create offer' : 'Save changes'}
        summary={`${isNew ? 'New offer' : offer.name} · ${profile.name}`}
      />
    </form>
  );
}
