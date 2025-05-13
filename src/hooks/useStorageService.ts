import { useRef } from "react";
import { createStorageService } from "@/services/StorageService";

type StorageServiceParameters<T extends object> = Parameters<
  typeof createStorageService<T>
>[0];

export function useStorageService<T extends object>(
  parameters: StorageServiceParameters<T>
) {
  const storageServiceRef = useRef(createStorageService(parameters));
  const storageService = storageServiceRef.current;
  return { storageServiceRef, storageService };
}
