import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { readStorage, writeStorage } from './storage.js';
import { createSeedProfiles } from '../data/seedProfiles.js';
import { getBusinessModel } from '../data/businessModels.js';
import { createId } from '../utils/format.js';

const STORAGE_NAME = 'app-state';

const loadInitialState = () => {
  const stored = readStorage(STORAGE_NAME, null);
  if (stored && Array.isArray(stored.profiles)) {
    return {
      selectedModelId: getBusinessModel(stored.selectedModelId) ? stored.selectedModelId : null,
      activeProfileId: stored.profiles.some((p) => p.id === stored.activeProfileId)
        ? stored.activeProfileId
        : null,
      profiles: stored.profiles,
    };
  }
  return { selectedModelId: null, activeProfileId: null, profiles: createSeedProfiles() };
};

function reducer(state, action) {
  switch (action.type) {
    case 'selectModel':
      return { ...state, selectedModelId: action.modelId };

    case 'selectProfile': {
      if (state.activeProfileId === action.profileId) {
        return { ...state, activeProfileId: null };
      }
      const profile = state.profiles.find((p) => p.id === action.profileId);
      if (!profile) return state;
      return { ...state, activeProfileId: profile.id, selectedModelId: profile.businessModelId };
    }

    case 'clearProfile':
      return { ...state, activeProfileId: null };

    case 'createProfile': {
      const profile = {
        id: createId(),
        name: action.name,
        businessModelId: action.businessModelId,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        profiles: [profile, ...state.profiles],
        activeProfileId: profile.id,
        selectedModelId: profile.businessModelId,
      };
    }

    case 'commitSelection': {
      // Persist the chosen model onto the active profile when the user continues.
      if (!state.activeProfileId) return state;
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === state.activeProfileId
            ? { ...p, businessModelId: state.selectedModelId, updatedAt: new Date().toISOString() }
            : p
        ),
      };
    }

    default:
      return state;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    writeStorage(STORAGE_NAME, state);
  }, [state]);

  const selectModel = useCallback((modelId) => dispatch({ type: 'selectModel', modelId }), []);
  const selectProfile = useCallback((profileId) => dispatch({ type: 'selectProfile', profileId }), []);
  const clearProfile = useCallback(() => dispatch({ type: 'clearProfile' }), []);
  const createProfile = useCallback(
    ({ name, businessModelId }) => dispatch({ type: 'createProfile', name, businessModelId }),
    []
  );
  const commitSelection = useCallback(() => dispatch({ type: 'commitSelection' }), []);

  const value = useMemo(() => {
    const profiles = [...state.profiles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return {
      ...state,
      profiles,
      selectedModel: getBusinessModel(state.selectedModelId),
      activeProfile: state.profiles.find((p) => p.id === state.activeProfileId) ?? null,
      selectModel,
      selectProfile,
      clearProfile,
      createProfile,
      commitSelection,
    };
  }, [state, selectModel, selectProfile, clearProfile, createProfile, commitSelection]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
