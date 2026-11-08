import { AppStateProvider } from './state/AppStateContext.jsx';
import { Router } from './app/router.jsx';
import { ROUTES } from './app/routes.js';
import AppShell from './components/layout/AppShell.jsx';

export default function App() {
  return (
    <AppStateProvider>
      <AppShell>
        <Router routes={ROUTES} />
      </AppShell>
    </AppStateProvider>
  );
}
