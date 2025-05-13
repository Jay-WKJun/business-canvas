import { AbstractStorageService } from "./AbstractStorageService";

export class InMemoryStorageService<
  T extends object
> extends AbstractStorageService<T> {
  private storage: Record<string, T> = {};

  get(key: string): T {
    console.log("get", this.storage);
    return this.storage[key];
  }

  saveData(key: string, value: T): void {
    this.storage[key] = value;
    console.log("saveData", this.storage);
  }

  remove(key: string): void {
    delete this.storage[key];
    console.log("remove", this.storage);
  }
}
