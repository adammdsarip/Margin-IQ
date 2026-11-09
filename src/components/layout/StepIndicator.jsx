import { SETUP_STEPS } from '../../app/steps.js';
import './StepIndicator.css';

export default function StepIndicator({ current }) {
  const index = SETUP_STEPS.findIndex((s) => s.id === current);
  return (
    <ol
      className="steps"
      aria-label="Setup progress"
      style={{ gridTemplateColumns: `repeat(${SETUP_STEPS.length}, minmax(0, 1fr))` }}
    >
      {SETUP_STEPS.map((step, i) => {
        const state = i < index ? 'done' : i === index ? 'current' : 'upcoming';
        return (
          <li key={step.id} className={`steps__item steps__item--${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="steps__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="steps__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
