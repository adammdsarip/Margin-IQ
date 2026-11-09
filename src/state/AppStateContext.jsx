import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadState, saveState } from './repository.js';
import { getBusinessModel } from '../data/businessModels.js';
import { createId } from '../utils/format.js';
import { createDefaultCategories } from './schema.js';

const now = () => new Date().toISOString();

const touchProfile = (profiles, profileId) =>
  profiles.map((p) => (p.id === profileId ? { ...p, updatedAt: now() } : p));

function reducer(state, action) {
  switch (action.type) {
    /* ---------- Stage 1: model + profile selection ---------- */
    case 'selectModel':
      return { ...state, selectedModelId: action.modelId };

    case 'selectProfile': {
      if (state.activeProfileId === action.profileId) {
        return { ...state, activeProfileId: null, activeOfferId: null };
      }
      const profile = state.profiles.find((p) => p.id === action.profileId);
      if (!profile) return state;
      return {
        ...state,
        activeProfileId: profile.id,
        activeOfferId: null,
        selectedModelId: profile.businessModelId,
      };
    }

    case 'clearProfile':
      return { ...state, activeProfileId: null, activeOfferId: null };

    case 'commitSelection': {
      if (!state.activeProfileId) return state;
      const profile = state.profiles.find((p) => p.id === state.activeProfileId);
      if (!profile || profile.businessModelId === state.selectedModelId) return state;
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === profile.id ? { ...p, businessModelId: state.selectedModelId, updatedAt: now() } : p
        ),
      };
    }

    /* ---------- Business profiles ---------- */
    case 'saveProfile': {
      const { id, ...fields } = action.profile;
      const existing = id && state.profiles.find((p) => p.id === id);
      const profile = existing
        ? { ...existing, ...fields, updatedAt: now() }
        : { ...fields, id: action.newId, createdAt: now(), updatedAt: now() };
      return {
        ...state,
        profiles: existing
          ? state.profiles.map((p) => (p.id === profile.id ? profile : p))
          : [profile, ...state.profiles],
        costCategories: existing
          ? state.costCategories
          : [...state.costCategories, ...createDefaultCategories(profile.id)],
        activeProfileId: profile.id,
        activeOfferId: existing && state.activeProfileId === profile.id ? state.activeOfferId : null,
        selectedModelId: profile.businessModelId,
      };
    }

    /* ---------- Offers ---------- */
    case 'saveOffer': {
      const { id, ...fields } = action.offer;
      const existing = id && state.offers.find((o) => o.id === id);
      const offer = existing
        ? { ...existing, ...fields, profileId: existing.profileId, updatedAt: now() }
        : { ...fields, id: action.newId, createdAt: now(), updatedAt: now() };
      return {
        ...state,
        offers: existing
          ? state.offers.map((o) => (o.id === offer.id ? offer : o))
          : [...state.offers, offer],
        profiles: touchProfile(state.profiles, offer.profileId),
        activeProfileId: offer.profileId,
        activeOfferId: offer.id,
      };
    }

    case 'duplicateOffer': {
      const source = state.offers.find((o) => o.id === action.offerId);
      if (!source) return state;
      const copy = {
        ...source,
        id: action.newId,
        name: `${source.name} (copy)`,
        createdAt: now(),
        updatedAt: now(),
      };
      const index = state.offers.indexOf(source);
      const offers = [...state.offers];
      offers.splice(index + 1, 0, copy);
      // The copy gets its own copies of the offer's costs.
      const copiedCosts = state.costs
        .filter((c) => c.offerId === source.id)
        .map((c) => ({ ...c, id: createId('cost'), offerId: copy.id, createdAt: now(), updatedAt: now() }));
      return {
        ...state,
        offers,
        costs: [...state.costs, ...copiedCosts],
        profiles: touchProfile(state.profiles, source.profileId),
      };
    }

    case 'deleteOffer': {
      const target = state.offers.find((o) => o.id === action.offerId);
      if (!target) return state;
      return {
        ...state,
        offers: state.offers.filter((o) => o.id !== action.offerId),
        costs: state.costs.filter((c) => c.offerId !== action.offerId),
        profiles: touchProfile(state.profiles, target.profileId),
        activeOfferId: state.activeOfferId === action.offerId ? null : state.activeOfferId,
      };
    }

    case 'selectOffer': {
      const offer = state.offers.find((o) => o.id === action.offerId);
      if (!offer) return state;
      const profile = state.profiles.find((p) => p.id === offer.profileId);
      return {
        ...state,
        activeProfileId: offer.profileId,
        activeOfferId: offer.id,
        selectedModelId: profile?.businessModelId ?? state.selectedModelId,
      };
    }

    /* ---------- Costs (Stage 3) ---------- */
    case 'saveCost': {
      const { id, ...fields } = action.cost;
      const existing = id && state.costs.find((c) => c.id === id);
      const cost = existing
        ? { ...existing, ...fields, profileId: existing.profileId, updatedAt: now() }
        : { ...fields, id: action.newId, createdAt: now(), updatedAt: now() };
      return {
        ...state,
        costs: existing ? state.costs.map((c) => (c.id === cost.id ? cost : c)) : [...state.costs, cost],
        profiles: touchProfile(state.profiles, cost.profileId),
      };
    }

    case 'duplicateCost': {
      const source = state.costs.find((c) => c.id === action.costId);
      if (!source) return state;
      const copy = { ...source, id: action.newId, name: `${source.name} (copy)`, createdAt: now(), updatedAt: now() };
      const costs = [...state.costs];
      costs.splice(costs.indexOf(source) + 1, 0, copy);
      return { ...state, costs, profiles: touchProfile(state.profiles, source.profileId) };
    }

    case 'deleteCost': {
      const target = state.costs.find((c) => c.id === action.costId);
      if (!target) return state;
      return {
        ...state,
        costs: state.costs.filter((c) => c.id !== action.costId),
        profiles: touchProfile(state.profiles, target.profileId),
      };
    }

    case 'saveCategory': {
      const { id, profileId, name } = action.category;
      const existing = id && state.costCategories.find((c) => c.id === id);
      return {
        ...state,
        costCategories: existing
          ? state.costCategories.map((c) => (c.id === id ? { ...c, name } : c))
          : [...state.costCategories, { id: action.newId, profileId, key: null, name, locked: false }],
      };
    }

    case 'deleteCategory': {
      const target = state.costCategories.find((c) => c.id === action.categoryId);
      if (!target || target.locked) return state;
      const fallback = state.costCategories.find((c) => c.profileId === target.profileId && c.locked);
      return {
        ...state,
        costCategories: state.costCategories.filter((c) => c.id !== target.id),
        // Costs in the deleted category move to the business's fallback category.
        costs: state.costs.map((c) => (c.categoryId === target.id ? { ...c, categoryId: fallback?.id ?? '' } : c)),
      };
    }

    default:
      return state;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      selectModel: (modelId) => dispatch({ type: 'selectModel', modelId }),
      selectProfile: (profileId) => dispatch({ type: 'selectProfile', profileId }),
      clearProfile: () => dispatch({ type: 'clearProfile' }),
      commitSelection: () => dispatch({ type: 'commitSelection' }),
      /** Creates or updates a profile. Returns its id. */
      saveProfile: (profile) => {
        const newId = profile.id || createId('biz');
        dispatch({ type: 'saveProfile', profile, newId });
        return newId;
      },
      /** Stage 1 quick-create: name and model only. */
      createProfile: ({ name, businessModelId }) => {
        const newId = createId('biz');
        dispatch({
          type: 'saveProfile',
          newId,
          profile: {
            name,
            businessModelId,
            description: '',
            industry: '',
            currency: 'SGD',
            website: '',
            location: '',
          },
        });
        return newId;
      },
      /** Creates or updates an offer. Returns its id. */
      saveOffer: (offer) => {
        const newId = offer.id || createId('off');
        dispatch({ type: 'saveOffer', offer, newId });
        return newId;
      },
      duplicateOffer: (offerId) => {
        const newId = createId('off');
        dispatch({ type: 'duplicateOffer', offerId, newId });
        return newId;
      },
      deleteOffer: (offerId) => dispatch({ type: 'deleteOffer', offerId }),
      /** Creates or updates a cost. Returns its id. */
      saveCost: (cost) => {
        const newId = cost.id || createId('cost');
        dispatch({ type: 'saveCost', cost, newId });
        return newId;
      },
      duplicateCost: (costId) => {
        const newId = createId('cost');
        dispatch({ type: 'duplicateCost', costId, newId });
        return newId;
      },
      deleteCost: (costId) => dispatch({ type: 'deleteCost', costId }),
      /** Creates or renames a category. Returns its id. */
      saveCategory: (category) => {
        const newId = category.id || createId('cat');
        dispatch({ type: 'saveCategory', category, newId });
        return newId;
      },
      deleteCategory: (categoryId) => dispatch({ type: 'deleteCategory', categoryId }),
      selectOffer: (offerId) => dispatch({ type: 'selectOffer', offerId }),
    }),
    []
  );

  const value = useMemo(() => {
    const profiles = [...state.profiles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const offersByProfile = new Map();
    state.offers.forEach((o) => {
      if (!offersByProfile.has(o.profileId)) offersByProfile.set(o.profileId, []);
      offersByProfile.get(o.profileId).push(o);
    });

    return {
      selectedModelId: state.selectedModelId,
      activeProfileId: state.activeProfileId,
      activeOfferId: state.activeOfferId,
      profiles,
      selectedModel: getBusinessModel(state.selectedModelId),
      activeProfile: state.profiles.find((p) => p.id === state.activeProfileId) ?? null,
      getProfile: (id) => state.profiles.find((p) => p.id === id) ?? null,
      getOffers: (profileId) => offersByProfile.get(profileId) ?? [],
      getOffer: (id) => state.offers.find((o) => o.id === id) ?? null,
      getCosts: (profileId) => state.costs.filter((c) => c.profileId === profileId),
      getCostCategories: (profileId) => state.costCategories.filter((c) => c.profileId === profileId),
      ...actions,
    };
  }, [state, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
