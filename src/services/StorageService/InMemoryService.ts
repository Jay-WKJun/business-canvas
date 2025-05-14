import { AbstractStorageService } from "./AbstractStorageService";

export class InMemoryStorageService<
  T extends object
> extends AbstractStorageService<T> {
  private storage: Record<string, T> = {};

  get(key: string): T | null {
    return this.storage[key] ?? null;
  }

  saveData(key: string, value: T): void {
    this.storage[key] = value;
  }

  remove(key: string): void {
    delete this.storage[key];
  }
}
