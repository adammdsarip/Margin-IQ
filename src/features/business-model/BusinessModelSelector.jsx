import { BUSINESS_MODELS } from '../../data/businessModels.js';
import BusinessModelCard from './BusinessModelCard.jsx';
import './BusinessModel.css';

export default function BusinessModelSelector({ value, onChange, labelledBy }) {
  return (
    <div className="model-grid" role="radiogroup" aria-labelledby={labelledBy} aria-required="true">
      {BUSINESS_MODELS.map((model) => (
        <BusinessModelCard
          key={model.id}
          model={model}
          name="business-model"
          checked={value === model.id}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
