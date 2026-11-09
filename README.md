# MarginIQ

Know your numbers. Make smarter decisions.

MarginIQ is a marketing profitability and business decision calculator, built as a React PWA.
Shipped so far:

- **Stage 1 — Business model selection**: pick a model, pick or create a business profile.
- **Stage 2 — Business setup & offers**: full business profiles, and multiple offers per
  business (create, edit, duplicate, delete, switch).
- **Stage 3 — Cost structure**: business-level and offer-level costs with categories,
  classification (fixed / variable / one-time), frequency, quantity × unit cost (or a custom
  total), estimated vs actual, search and filters, and a summary that keeps each frequency separate.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run build:preview  # single-file marginiq-preview.html for sharing
```

## Screens

| Route | Screen |
| --- | --- |
| `#/` | Business model selection and profile list (Stage 1) |
| `#/business/new` | New business profile |
| `#/business/:profileId` | Business overview and offers |
| `#/business/:profileId/edit` | Edit business profile |
| `#/business/:profileId/offers/new` | New offer |
| `#/business/:profileId/offers/:offerId/edit` | Edit offer |
| `#/business/:profileId/costs` | Cost structure: summary + business-level costs |
| `#/business/:profileId/offers/:offerId` | Cost structure: costs for one offer |

## Structure

```
src/
  app/            router (hash-based, with :params), route registry, setup steps
  state/          app state context, schema + migration, repository (persistence boundary)
  data/           business models, offer types, pricing units, currencies, seed data
  hooks/          form state, route-param record lookup
  components/
    layout/       AppShell, Header, StepIndicator
    form/         Field, inputs, settings-style sections, sticky save bar
    ui/           Button, Icon, Modal, Toast, BackLink, SectionHeading
  features/
    business-model/  model cards, selector, sticky selection bar
    profiles/        profile list, quick create-profile form
    business/        business profile form
    offers/          offer form, offer card, delete confirmation
    costs/           cost form, list, filters, summary, category manager, costMath.js
  pages/          route screens
  styles/         design tokens + base styles
```

### Adding a module

1. Build the screen in `src/pages/` (shared pieces go in `src/features/<module>/`).
2. Register it in `src/app/routes.js`.
3. Give its step a `path` in `src/app/steps.js` so the progress bar picks it up.

The selected model's `id` (`service`, `product`, `package`, `subscription`, `lead-generation`)
is available from `useAppState()` and is the key later calculator modules should branch on.

## Data and persistence

Everything is saved in the browser under the localStorage key `marginiq:v1:app-state`:

```js
{
  schemaVersion: 3,
  selectedModelId, activeProfileId, activeOfferId,
  profiles: [{ id, name, businessModelId, description, industry, currency,
               website, location, createdAt, updatedAt }],
  offers:   [{ id, profileId, name, description, type, price, pricingUnit,
               customUnit, expectedSales (per month), targetCustomer,
               createdAt, updatedAt }],
  costCategories: [{ id, profileId, key, name, locked }],
  costs: [{ id, profileId, offerId /* null = business-level */, name, categoryId,
            classification, frequency, customFrequency, quantity, unitCost,
            totalOverride /* null = use quantity × unitCost */, status, notes,
            createdAt, updatedAt }],
}
```

Costs have no currency of their own; they always use their business's currency.
Every business gets six default cost categories; "Other Expenses" is the fallback that
costs move to when a category is deleted. Deleting an offer deletes its costs;
duplicating an offer copies them.

### Cost totals

`src/features/costs/costMath.js` holds the only cost calculations:
total = quantity × unit cost unless a custom total is set. Summaries are bucketed by
frequency (monthly, annually, per booking…) and never added across buckets.

- Profiles and offers are flat collections linked by `profileId`, so they map directly to
  backend tables or Firestore collections.
- Ids are UUIDs prefixed by type (`biz_…`, `off_…`, `cat_…`, `cost_…`).
- `src/state/schema.js` migrates older saved data (Stage 1 and Stage 2 formats)
  without losing it.
- To move to Firebase or an API, replace `loadState` / `saveState` in
  `src/state/repository.js`.

Example businesses (with example offers and costs for PURE INTENT) are added on first launch.
Existing users are not given example costs for their own businesses.
