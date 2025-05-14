import { useRef, useState, useEffect, useCallback } from "react";
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
  setData: (value: T) => boolean;
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
  const [data, setDataState] = useState<T>(initialData);
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
            // 유효한 데이터라면 상태 업데이트
            setDataState(storedData);
          } else {
            // 유효하지 않은 데이터라면 초기값을 저장
            storageService.set(key, initialData);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error("데이터 검증 실패"));
          // 유효하지 않은 데이터라면 초기값을 저장
          storageService.set(key, initialData);
        }
      } else {
        // key값으로 저장된 데이터가 없다면 초기값을 저장
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
        // 디바운스 딜레이 후 저장
        storageService.set(key, data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("데이터 저장 실패"));
      }
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [key, data, storageService, isInitialized, debounceDelay]);

  const setData = useCallback(
    (value: T) => {
      if (validator(value)) {
        // 유효한 데이터라면 상태 업데이트
        setDataState(value);
        return true;
      }

      // 유효하지 않은 데이터라면 에러 설정
      setError(new Error("유효하지 않은 데이터 입니다."));
      return false;
    },
    [validator]
  );

  return {
    data,
    setData,
    isInitialized,
    isLoading,
    error,
  };
}
