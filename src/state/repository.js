/**
 * Persistence boundary. Everything that reads or writes saved data goes
 * through here, so swapping localStorage for Firebase or an API only
 * touches this file.
 */
import { readStorage, writeStorage } from './storage.js';
import { migrate } from './schema.js';

const STORAGE_NAME = 'app-state';

export const loadState = () => migrate(readStorage(STORAGE_NAME, null));

export const saveState = (state) => writeStorage(STORAGE_NAME, state);
