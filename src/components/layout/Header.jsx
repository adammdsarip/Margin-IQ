import { getCurrentPath, navigate, usePath } from '../../app/router.jsx';
import { useAppState } from '../../state/AppStateContext.jsx';
import Icon from '../ui/Icon.jsx';
import './Header.css';

const scrollToProfiles = () => {
  const go = () => document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' });
  if (getCurrentPath() !== '/') {
    navigate('/');
    requestAnimationFrame(() => requestAnimationFrame(go));
  } else {
    go();
  }
};

const goTo = (event) => {
  const href = event.currentTarget.getAttribute('href');
  if (!href?.startsWith('#/')) return;
  event.preventDefault();
  navigate(href.slice(1));
};

export default function Header() {
  const path = usePath();
  const { activeProfile } = useAppState();
  const inSetup = path === '/';
  const inBusiness = path.startsWith('/business/') && path !== '/business/new';
  const businessHref = activeProfile ? `#/business/${activeProfile.id}` : null;

  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#/" onClick={goTo} aria-label="MarginIQ home">
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
          <a className="header__link" href="#/" onClick={goTo} aria-current={inSetup ? 'page' : undefined}>
            Setup
          </a>
          {businessHref && (
            <a className="header__link" href={businessHref} onClick={goTo} aria-current={inBusiness ? 'page' : undefined}>
              Business
            </a>
          )}
          <button type="button" className="header__link" onClick={scrollToProfiles}>
            Profiles
          </button>
        </nav>

        <div className="header__profile" aria-live="polite">
          {activeProfile ? (
            <a className="header__profile-link" href={businessHref} onClick={goTo} title={activeProfile.name}>
              <Icon name="building" size={16} />
              <span className="header__profile-name">{activeProfile.name}</span>
            </a>
          ) : (
            <span className="header__profile-empty">No profile selected</span>
          )}
        </div>
      </div>
    </header>
  );
}
