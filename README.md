# MarginIQ

Know your numbers. Make smarter decisions.

A one-page margin calculator. Pick a business type, enter your price, sales, cost per sale
and monthly overheads, and see revenue, gross and net profit, margins, profit per sale,
markup and break-even sales.

## Run

```bash
npm install
npm run dev            # local dev server
npm run build          # production build in dist/
npm run build:preview  # single-file marginiq-preview.html for sharing
```

## Structure

```
src/
  App.jsx                  page shell
  calculator/
    calc.js                pure calculations and formatting
    presets.js             business types: wording and example numbers
    Calculator.jsx         inputs
    Results.jsx            results
```

Your last inputs are remembered in the browser (`marginiq:calculator:v1`). Nothing is sent anywhere.

The earlier multi-step version (business model, profiles, offers, cost structure) is in the
git history before the commit "Simplify to a one-page calculator".
