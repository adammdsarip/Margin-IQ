import { BUSINESS_MODELS } from '../../data/businessModels.js';
import { CURRENCIES, DEFAULT_CURRENCY, INDUSTRIES } from '../../data/businessSetup.js';
import { isBlank, normalizeWebsite, displayWebsite } from '../../utils/validation.js';
import useFormState from '../../hooks/useFormState.js';
import Field from '../../components/form/Field.jsx';
import FormSection from '../../components/form/FormSection.jsx';
import { Select, TextArea, TextInput } from '../../components/form/Controls.jsx';
import FormActionBar from '../../components/form/FormActionBar.jsx';
import '../../components/form/Form.css';

const MODEL_OPTIONS = BUSINESS_MODELS.map((m) => ({ id: m.id, label: m.name }));

const validate = (v) => {
  const errors = {};
  if (isBlank(v.name)) errors.name = 'Enter a business name.';
  if (!v.businessModelId) errors.businessModelId = 'Select a business model.';
  if (!v.industry) errors.industry = 'Select the closest industry, or choose Other.';
  if (!v.currency) errors.currency = 'Select a currency.';
  if (normalizeWebsite(v.website) === null) errors.website = 'Enter a web address like example.com.';
  return errors;
};

export default function BusinessProfileForm({ header, profile, defaultModelId, offerCount = 0, onSave, onCancel }) {
  const isNew = !profile;
  const { values, bind, errors, trySubmit } = useFormState(
    {
      name: profile?.name ?? '',
      businessModelId: profile?.businessModelId ?? defaultModelId ?? '',
      description: profile?.description ?? '',
      industry: profile?.industry ?? '',
      currency: profile?.currency ?? DEFAULT_CURRENCY,
      website: displayWebsite(profile?.website),
      location: profile?.location ?? '',
    },
    validate
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trySubmit()) return;
    onSave({
      id: profile?.id,
      name: values.name.trim(),
      businessModelId: values.businessModelId,
      description: values.description.trim(),
      industry: values.industry,
      currency: values.currency,
      website: normalizeWebsite(values.website),
      location: values.location.trim(),
    });
  };

  return (
    <form className="page" onSubmit={handleSubmit} noValidate>
      <div className="container page__content">
        {header}
        <div className="form-card">
        <FormSection
          title="Business"
          description="The brand or business you're evaluating. Each profile keeps its own offers and numbers."
        >
          <Field label="Business name" error={errors.name}>
            <TextInput {...bind('name')} maxLength={80} autoComplete="organization" placeholder="e.g. Studio Lumen Photography" />
          </Field>
          <Field
            label="Business model"
            error={errors.businessModelId}
            hint={
              isNew
                ? 'Carried over from step 1. It decides which offer types you can choose.'
                : 'Changing the model changes the offer types available for new offers.'
            }
          >
            <Select {...bind('businessModelId')} options={MODEL_OPTIONS} placeholder="Select a business model" />
          </Field>
          <Field label="Business description" optional hint="One or two sentences on what you sell and who buys it.">
            <TextArea {...bind('description')} maxLength={400} placeholder="e.g. Family portrait and newborn photography in Singapore." />
          </Field>
        </FormSection>

        <FormSection title="Market" description="Where and in which industry you operate. Used to frame benchmarks in later stages.">
          <Field label="Industry / business category" error={errors.industry}>
            <Select {...bind('industry')} options={INDUSTRIES} placeholder="Select an industry" />
          </Field>
          <div className="field-row">
            <Field label="Business location" optional hint="City or region you mainly serve.">
              <TextInput {...bind('location')} maxLength={80} autoComplete="address-level2" placeholder="e.g. Singapore" />
            </Field>
            <Field label="Business website" optional error={errors.website}>
              <TextInput {...bind('website')} type="url" inputMode="url" maxLength={200} autoComplete="url" placeholder="example.com" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Currency" description="All prices and results for this business are shown in this currency.">
          <Field
            label="Currency"
            error={errors.currency}
            hint={offerCount > 0 ? 'Existing offer prices are kept as entered and are not converted.' : undefined}
          >
            <Select {...bind('currency')} options={CURRENCIES} />
          </Field>
        </FormSection>
        </div>
      </div>

      <FormActionBar
        onCancel={onCancel}
        submitLabel={isNew ? 'Create business' : 'Save changes'}
        summary={isNew ? 'New business profile' : `Editing ${profile.name}`}
      />
    </form>
  );
}
