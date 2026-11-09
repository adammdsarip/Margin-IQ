import BusinessModelPage from '../pages/BusinessModelPage.jsx';
import BusinessFormPage from '../pages/BusinessFormPage.jsx';
import BusinessOverviewPage from '../pages/BusinessOverviewPage.jsx';
import OfferFormPage from '../pages/OfferFormPage.jsx';
import CostsPage from '../pages/CostsPage.jsx';

/**
 * Route registry. New calculator modules register their screens here.
 * Order matters: static segments ("new") are listed before ":param" ones.
 */
export const ROUTES = [
  // Stage 1
  { path: '/', title: 'Business model', component: BusinessModelPage },
  // Stage 2: business setup & offers
  { path: '/business/new', title: 'New business', component: BusinessFormPage },
  { path: '/business/:profileId', title: 'Business overview', component: BusinessOverviewPage },
  { path: '/business/:profileId/edit', title: 'Edit business', component: BusinessFormPage },
  { path: '/business/:profileId/offers/new', title: 'New offer', component: OfferFormPage },
  { path: '/business/:profileId/offers/:offerId/edit', title: 'Edit offer', component: OfferFormPage },
  // Stage 3: cost structure
  { path: '/business/:profileId/costs', title: 'Cost structure', component: CostsPage },
  { path: '/business/:profileId/offers/:offerId', title: 'Offer costs', component: CostsPage },
];
