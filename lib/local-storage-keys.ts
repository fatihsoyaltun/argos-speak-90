export const ACTIVE_DAY_STORAGE_KEY = "argos-active-day";

export const APP_LOCAL_STORAGE_KEYS = [ACTIVE_DAY_STORAGE_KEY] as const;

export function clearAppLocalStorage(storage: Storage) {
  APP_LOCAL_STORAGE_KEYS.forEach((key) => {
    storage.removeItem(key);
  });
}
