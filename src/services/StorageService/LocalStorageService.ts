import { AbstractStorageService } from "./AbstractStorageService";

export class LocalStorageService<
  T extends object
> extends AbstractStorageService<T> {
  get(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsedData = JSON.parse(data) as T;
    if (!this.validator(parsedData)) return null;

    return parsedData;
  }

  saveData(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
