export interface StorageService<T extends object> {
  get(key: string): T | null;
  set(key: string, value: T): void;
  remove(key: string): void;
}
