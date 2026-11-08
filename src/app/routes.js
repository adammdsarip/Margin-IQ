import BusinessModelPage from '../pages/BusinessModelPage.jsx';
import SetupPlaceholderPage from '../pages/SetupPlaceholderPage.jsx';

/**
 * Route registry. New calculator modules register their screens here.
 */

export const ROUTES = [
  { path: '/', title: 'Business model', component: BusinessModelPage },
  { path: '/setup/details', title: 'Business details', component: SetupPlaceholderPage },
];
