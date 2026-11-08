import { getBusinessModel } from '../../data/businessModels.js';
import { formatDate } from '../../utils/format.js';
import Icon from '../../components/ui/Icon.jsx';
import './Profiles.css';

export default function ProfileList({ profiles, activeProfileId, onSelect, onCreate }) {
  return (
    <div className="profiles">
      <div className="profiles__head" aria-hidden="true">
        <span>Business</span>
        <span>Business model</span>
        <span>Last updated</span>
        <span />
      </div>

      <ul className="profiles__list">
        {profiles.map((profile) => {
          const model = getBusinessModel(profile.businessModelId);
          const active = profile.id === activeProfileId;
          return (
            <li key={profile.id}>
              <button
                type="button"
                className={`profile-row${active ? ' is-active' : ''}`}
                onClick={() => onSelect(profile.id)}
                aria-pressed={active}
              >
                <span className="profile-row__name">
                  <span className="profile-row__icon">
                    <Icon name={model?.icon ?? 'building'} size={18} />
                  </span>
                  <span className="profile-row__title">{profile.name}</span>
                  {active && <span className="tag">Active</span>}
                </span>
                <span className="profile-row__model">
                  <span className="profile-row__cell-label">Model</span>
                  {model ? model.name : 'Not set'}
                </span>
                <span className="profile-row__date">
                  <span className="profile-row__cell-label">Updated</span>
                  <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
                </span>
                <span className="profile-row__chevron" aria-hidden="true">
                  <Icon name={active ? 'check' : 'chevron-right'} size={18} />
                </span>
              </button>
            </li>
          );
        })}

        <li>
          <button type="button" className="profile-create" onClick={onCreate}>
            <span className="profile-create__icon">
              <Icon name="plus" size={18} />
            </span>
            Create New Business Profile
          </button>
        </li>
      </ul>
    </div>
  );
}
