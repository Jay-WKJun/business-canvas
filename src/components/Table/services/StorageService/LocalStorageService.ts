import type { StorageService } from "./type";

export class LocalStorageService<T extends object>
  implements StorageService<T>
{
  get(key: string): T {
    const value = localStorage.getItem(key);
    if (!value) {
      throw new Error(`Key "${key}" not found in local storage.`);
    }
    return JSON.parse(value) as T;
  }

  set(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
