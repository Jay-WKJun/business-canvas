import type { StorageService } from "./type";

export abstract class AbstractStorageService<T extends object>
  implements StorageService<T>
{
  protected validator: (data: T) => boolean;

  constructor(validator: (data: T) => boolean) {
    this.validator = validator;
  }

  abstract get(key: string): T;

  set(key: string, value: T): void {
    if (!this.validator(value)) {
      throw new Error("Invalid data format");
    }
    this.saveData(key, value);
  }

  protected abstract saveData(key: string, value: T): void;
  abstract remove(key: string): void;
}
