import { env } from "@/utils/env";
import type { StorageService } from "./type";
import { LocalStorageService } from "./LocalStorageService";
import { InMemoryStorageService } from "./InMemoryService";

type StorageType = "local-storage" | "in-memory";
const storageType: StorageType = env.storage as StorageType;

export function createStorageService<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _?: T
): StorageService<T> {
  if (storageType === "local-storage") {
    return new LocalStorageService<T>();
  }

  return new InMemoryStorageService<T>();
}
