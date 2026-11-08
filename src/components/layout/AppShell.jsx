import Header from './Header.jsx';
import './AppShell.css';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="app-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="app-footer">
        <div className="container app-footer__inner">
          <span>© {new Date().getFullYear()} MarginIQ</span>
          <span>Data is stored on this device.</span>
        </div>
      </footer>
    </div>
  );
}
