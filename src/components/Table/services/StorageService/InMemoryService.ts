import type { StorageService } from "./type";

export class InMemoryStorageService<T extends object>
  implements StorageService<T>
{
  private storage: Record<string, T> = {};

  get(key: string): T {
    return this.storage[key];
  }

  set(key: string, value: T): void {
    this.storage[key] = value;
  }

  remove(key: string): void {
    delete this.storage[key];
  }
}
