import Icon from '../../components/ui/Icon.jsx';

/**
 * A single selectable business model. Uses a native radio input so single
 * selection, arrow-key navigation and screen-reader semantics come for free.
 */
export default function BusinessModelCard({ model, name, checked, onSelect }) {
  const descId = `model-${model.id}-desc`;
  return (
    <label className={`model-card${checked ? ' is-selected' : ''}`}>
      <input
        className="visually-hidden"
        type="radio"
        name={name}
        value={model.id}
        checked={checked}
        onChange={() => onSelect(model.id)}
        aria-describedby={descId}
      />
      <span className="model-card__top">
        <span className="model-card__icon">
          <Icon name={model.icon} size={22} />
        </span>
        <span className="model-card__radio" aria-hidden="true">
          {checked && <Icon name="check" size={14} />}
        </span>
      </span>
      <span className="model-card__body">
        <span className="model-card__title">{model.name}</span>
        <span id={descId} className="model-card__desc">
          {model.description}
          <span className="model-card__examples">
            <span className="model-card__examples-label">Examples</span>
            {model.examples}
          </span>
        </span>
      </span>
    </label>
  );
}
