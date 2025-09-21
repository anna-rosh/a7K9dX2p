import { addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

/**
 * Initialize all RxDB plugins needed for the application
 */
export const initializeRxDBPlugins = (): void => {
  if (
    typeof window !== 'undefined' &&
    window.location?.hostname === 'localhost'
  ) {
    addRxPlugin(RxDBDevModePlugin);
  }

  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBUpdatePlugin);
};

/**
 * Get configured storage with validation in development
 */
export const getConfiguredStorage = () => {
  const baseStorage = getRxStorageDexie();

  if (
    typeof window !== 'undefined' &&
    window.location?.hostname === 'localhost'
  ) {
    // Necessary in Dev, otherwise error
    return wrappedValidateAjvStorage({ storage: baseStorage });
  }

  return baseStorage;
};
