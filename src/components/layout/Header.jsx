import { navigate, usePath } from '../../app/router.jsx';
import { useAppState } from '../../state/AppStateContext.jsx';
import Icon from '../ui/Icon.jsx';
import './Header.css';

const scrollToProfiles = () => {
  const go = () => document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' });
  if (window.location.hash.replace(/^#/, '') && window.location.hash !== '#/') {
    navigate('/');
    requestAnimationFrame(() => requestAnimationFrame(go));
  } else {
    go();
  }
};

export default function Header() {
  const path = usePath();
  const { activeProfile } = useAppState();
  const inSetup = path === '/' || path.startsWith('/setup');

  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#/" aria-label="MarginIQ home">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M5 18V7l4 6 4-6v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M17 18v-6M20.5 18V9" fill="none" stroke="var(--teal-300)" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </span>
          <span className="brand__text">
            <span className="brand__name">MARGINIQ</span>
            <span className="brand__tagline">Know your numbers. Make smarter decisions.</span>
          </span>
        </a>

        <nav className="header__nav" aria-label="Primary">
          <a className="header__link" href="#/" aria-current={inSetup ? 'page' : undefined}>
            Setup
          </a>
          <button type="button" className="header__link" onClick={scrollToProfiles}>
            Profiles
          </button>
        </nav>

        <div className="header__profile" aria-live="polite">
          {activeProfile ? (
            <>
              <Icon name="building" size={16} />
              <span className="header__profile-name" title={activeProfile.name}>
                {activeProfile.name}
              </span>
            </>
          ) : (
            <span className="header__profile-empty">No profile selected</span>
          )}
        </div>
      </div>
    </header>
  );
}
