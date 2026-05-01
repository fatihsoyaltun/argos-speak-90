export const ACTIVE_DAY_STORAGE_KEY = "argos-active-day";
export const CLOUD_SYNC_LAST_SYNC_STORAGE_KEY = "argos-cloud-sync-last-sync";
export const PRACTICE_PROGRESS_STORAGE_KEY = "argos-practice-progress";

export const APP_LOCAL_STORAGE_KEYS = [
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
] as const;

export function clearAppLocalStorage(storage: Storage) {
  APP_LOCAL_STORAGE_KEYS.forEach((key) => {
    storage.removeItem(key);
  });
}
