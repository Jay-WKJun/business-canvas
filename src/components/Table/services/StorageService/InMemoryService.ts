import { AbstractStorageService } from "./AbstractStorageService";

export class InMemoryStorageService<
  T extends object
> extends AbstractStorageService<T> {
  private storage: Record<string, T> = {};

  get(key: string): T {
    return this.storage[key];
  }

  saveData(key: string, value: T): void {
    this.storage[key] = value;
  }

  remove(key: string): void {
    delete this.storage[key];
  }
}
