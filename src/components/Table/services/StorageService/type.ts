export interface StorageService<T extends object> {
  get(key: string): T;
  set(key: string, value: T): void;
  remove(key: string): void;
}
