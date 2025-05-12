import { AbstractStorageService } from "./AbstractStorageService";

export class LocalStorageService<
  T extends object
> extends AbstractStorageService<T> {
  get(key: string): T {
    const data = localStorage.getItem(key);
    if (!data) {
      throw new Error(`No data found for key: ${key}`);
    }

    const parsedData = JSON.parse(data) as T;
    if (!this.validator(parsedData)) {
      throw new Error("Invalid data format in storage");
    }

    return parsedData;
  }

  saveData(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
