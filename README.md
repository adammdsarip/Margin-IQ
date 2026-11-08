# MarginIQ

Know your numbers. Make smarter decisions.

MarginIQ is a marketing profitability and business decision calculator, built as a React PWA.
This release ships **Module 1: Business Model Selection**.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  app/            router (hash-based), route registry, setup step definitions
  state/          app state context + versioned localStorage wrapper
  data/           business model catalogue, seed profiles
  components/
    layout/       AppShell, Header, StepIndicator
    ui/           Button, Icon, Modal, SectionHeading
  features/
    business-model/  model cards, selector, sticky selection bar
    profiles/        profile list, create-profile form
  pages/          route screens
  styles/         design tokens + base styles
```

### Adding a module

1. Build the screen in `src/pages/` (shared pieces go in `src/features/<module>/`).
2. Register it in `src/app/routes.js`.
3. Give its step a `path` in `src/app/steps.js` so the progress bar picks it up.

The selected model's `id` (`service`, `product`, `package`, `subscription`, `lead-generation`)
is available from `useAppState()` and is the key later calculator modules should branch on.

## Persistence

State (selected model, active profile, profiles) is kept under the localStorage key
`marginiq:v1:app-state`. Three example profiles are seeded on first launch.
