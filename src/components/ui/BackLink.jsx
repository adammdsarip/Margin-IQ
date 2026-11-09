import Icon from './Icon.jsx';

export default function BackLink({ onClick, children }) {
  return (
    <button type="button" className="back-link" onClick={onClick}>
      <Icon name="arrow-left" size={16} />
      <span className="back-link__text">{children}</span>
    </button>
  );
}
