import { useRef, useState, useEffect } from "react";
import { createStorageService } from "@/services/StorageService";

type StorageServiceParameters<T extends object> = Parameters<
  typeof createStorageService<T>
>[0];

interface UseStorageServiceOptions<T extends object> {
  key: string;
  initialData: T;
  validator: StorageServiceParameters<T>;
  debounceDelay?: number;
}

interface UseStorageServiceResult<T extends object> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useStorageService<T extends object>({
  key,
  initialData,
  validator,
  debounceDelay = 500,
}: UseStorageServiceOptions<T>): UseStorageServiceResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const storageServiceRef = useRef(createStorageService(validator));
  const storageService = storageServiceRef.current;

  // 초기화 로직
  useEffect(() => {
    if (isInitialized || !storageService) return;

    try {
      setIsLoading(true);
      const storedData = storageService.get(key);

      if (storedData) {
        try {
          if (validator(storedData)) {
            setData(storedData);
          } else {
            storageService.set(key, initialData);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error("데이터 검증 실패"));
          storageService.set(key, initialData);
        }
      } else {
        storageService.set(key, initialData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("스토리지 서비스 오류"));
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [key, initialData, storageService, isInitialized, validator]);

  // 데이터 변경 시 저장 로직
  useEffect(() => {
    if (!storageService || !isInitialized) return;

    const timer = setTimeout(() => {
      try {
        storageService.set(key, data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("데이터 저장 실패"));
      }
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [key, data, storageService, isInitialized, debounceDelay]);

  return {
    data,
    setData,
    isInitialized,
    isLoading,
    error,
  };
}
