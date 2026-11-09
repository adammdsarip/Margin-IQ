import { useEffect, useState } from 'react';
import { CURRENCIES, DEFAULT_TYPE, PRESETS, exampleFor } from './presets.js';
import Results from './Results.jsx';
import './calculator.css';

const STORAGE_KEY = 'marginiq:calculator:v1';

const initial = () => {
  const fallback = { type: DEFAULT_TYPE, currency: 'SGD', ...exampleFor(DEFAULT_TYPE) };
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && PRESETS[saved.type] && CURRENCIES.includes(saved.currency)) return { ...fallback, ...saved };
  } catch {
    // Storage unavailable or unreadable: start from the example.
  }
  return fallback;
};

function MoneyField({ id, label, hint, value, currency, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="affix">
        <span aria-hidden="true">{currency}</span>
        <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={onChange} />
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export default function Calculator() {
  const [state, setState] = useState(initial);
  const preset = PRESETS[state.type];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Not saving is fine.
    }
  }, [state]);

  const set = (key) => (event) => setState((s) => ({ ...s, [key]: event.target.value }));
  const loadExample = (type = state.type) => setState((s) => ({ ...s, type, ...exampleFor(type) }));
  const clear = () => {
    setState((s) => ({ ...s, price: '', units: '', cost: '', overheads: '' }));
    requestAnimationFrame(() => document.getElementById('price')?.focus());
  };

  return (
    <div className="calc">
      <div className="calc__intro">
        <h1>Margin calculator</h1>
        <p>Enter your price, sales and costs to see your margin, profit and break-even point. All figures are per month.</p>
      </div>

      <div className="calc__grid">
        <section className="card" aria-labelledby="inputs-title">
          <h2 id="inputs-title" className="card__title">Your numbers</h2>

          <div className="field-row">
            <div className="field">
              <label htmlFor="type">Business type</label>
              <select id="type" value={state.type} onChange={(e) => loadExample(e.target.value)}>
                {Object.entries(PRESETS).map(([id, p]) => (
                  <option key={id} value={id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="currency">Currency</label>
              <select id="currency" value={state.currency} onChange={set('currency')}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <p className="hint hint--example">Showing an example: {preset.example}. Replace the numbers with your own.</p>

          <MoneyField id="price" label={preset.labels.price} value={state.price} currency={state.currency} onChange={set('price')} />

          <div className="field">
            <label htmlFor="units">{preset.labels.units}</label>
            <input id="units" type="text" inputMode="numeric" autoComplete="off" value={state.units} onChange={set('units')} />
          </div>

          <MoneyField
            id="cost"
            label={preset.labels.cost}
            hint="Costs that rise with each sale, such as materials, freelancers, transport or payment fees."
            value={state.cost}
            currency={state.currency}
            onChange={set('cost')}
          />

          <MoneyField
            id="overheads"
            label="Monthly overheads"
            hint="Costs you pay whether or not you make a sale, such as rent, software, insurance and admin."
            value={state.overheads}
            currency={state.currency}
            onChange={set('overheads')}
          />

          <div className="actions">
            <button type="button" className="btn" onClick={() => loadExample()}>Load example</button>
            <button type="button" className="btn btn--secondary" onClick={clear}>Clear</button>
          </div>
        </section>

        <Results values={state} currency={state.currency} />
      </div>
    </div>
  );
}
