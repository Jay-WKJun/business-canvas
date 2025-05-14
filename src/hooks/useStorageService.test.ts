import { renderHook, act } from "@testing-library/react-hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStorageService } from "./useStorageService";
import { createStorageService } from "@/services/StorageService";
import { afterEach } from "node:test";

// 테스트용 데이터 타입
interface TestData {
  name: string;
  age: number;
  active: boolean;
}

let mockStorage: Record<string, unknown> = {};

describe("useStorageService", () => {
  const testKey = "test-key";

  // 테스트용 초기 데이터
  const initialData: TestData = {
    name: "홍길동",
    age: 30,
    active: true,
  };

  // 테스트용 검증 함수
  const validator = (data: unknown): data is TestData => {
    if (!data || typeof data !== "object") return false;

    const typedData = data as Record<string, unknown>;
    return (
      typeof typedData.name === "string" &&
      typeof typedData.age === "number" &&
      typeof typedData.active === "boolean"
    );
  };

  beforeEach(async () => {
    mockStorage = {};
    // StorageService 모킹
    vi.mock("@/services/StorageService", () => {
      return {
        createStorageService: vi
          .fn()
          .mockImplementation((validator: (data: unknown) => boolean) => ({
            get: vi.fn((key: string) => mockStorage[key] || null),
            set: vi.fn((key: string, value: unknown) => {
              if (validator && !validator(value)) {
                throw new Error("Invalid data format");
              }
              mockStorage[key] = value;
            }),
            remove: vi.fn((key: string) => {
              delete mockStorage[key];
            }),
          })),
      };
    });
    await import("@/services/StorageService");
  });

  afterEach(() => {
    vi.resetAllMocks();
    mockStorage = {};
  });

  it("should initialize with initial data and save to storage when there is no stored data", async () => {
    const { result } = renderHook(() =>
      useStorageService({
        key: testKey,
        initialData,
        validator,
      })
    );

    // 초기 상태 확인
    expect(result.current.data).toEqual(initialData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInitialized).toBe(true);
    expect(result.current.error).toBe(null);

    // createStorageService가 호출되었는지 확인
    expect(createStorageService).toHaveBeenCalledWith(validator);
    expect(mockStorage[testKey]).toEqual(initialData);
  });

  it("should load stored data and initialize when data exists", async () => {
    // 데이터 업데이트
    const updatedData = { ...initialData, name: "김철수", age: 25 };
    // 스토리지에 데이터가 있는 것처럼 모킹
    mockStorage[testKey] = updatedData;

    const { result } = renderHook(() =>
      useStorageService({
        key: testKey,
        initialData,
        validator,
      })
    );

    // 업데이트된 데이터 확인
    expect(result.current.data).toEqual(updatedData);
    // store에 저장된 데이터 확인
    expect(mockStorage[testKey]).toEqual(updatedData);
  });

  it("should reset to initial data when invalid data is stored", () => {
    // 유효하지 않은 데이터
    const invalidData = { name: "Invalid", wrongField: true };
    // 스토리지에 유효하지 않은 데이터가 있는 것처럼 모킹
    mockStorage[testKey] = invalidData;

    const { result } = renderHook(() =>
      useStorageService({
        key: testKey,
        initialData,
        validator,
      })
    );

    // 초기 데이터로 리셋되었는지 확인
    expect(result.current.data).toEqual(initialData);
    expect(mockStorage[testKey]).toEqual(initialData);
  });

  it("should apply debounce delay when setting new data", async () => {
    const customDelay = 200;

    const { result } = renderHook(() =>
      useStorageService({
        key: testKey,
        initialData,
        validator,
        debounceDelay: customDelay,
      })
    );

    // 데이터 업데이트
    const updatedData = { ...initialData, name: "박지민" };
    const updatedData2 = { ...initialData, name: "박지민2" };
    const updatedData3 = { ...initialData, name: "박지민3" };
    const updatedData4 = { ...initialData, name: "박지민4" };

    let setDataResult = false;
    act(() => {
      setDataResult = result.current.setData(updatedData);
      setDataResult = result.current.setData(updatedData2);
      setDataResult = result.current.setData(updatedData3);
      setDataResult = result.current.setData(updatedData4);
    });

    // state는 바로 업데이트 되어야 함.
    expect(result.current.data).toEqual(updatedData4);
    expect(setDataResult).toBe(true);

    // 아직 set이 호출되지 않았어야 함
    const storageService = createStorageService(validator);
    expect(storageService.set).not.toHaveBeenCalledWith(testKey, updatedData4);

    // 저장소에 데이터가 저장되지 않았어야 함
    expect(mockStorage[testKey]).not.toEqual(updatedData4);
    expect(mockStorage[testKey]).toEqual(initialData);

    // 디바운스 시간 기다리기
    await new Promise((resolve) => setTimeout(resolve, customDelay));

    // 저장소에 데이터가 저장되었는지 확인
    expect(mockStorage[testKey]).toEqual(updatedData4);
  });

  it("should show error and not save when invalid data is provided", async () => {
    const customDelay = 200;

    const { result } = renderHook(() =>
      useStorageService({
        key: testKey,
        initialData,
        validator,
        debounceDelay: customDelay,
      })
    );

    // 올바르지 않은 데이터
    const invalidData = { ...initialData, name: 123, age: "나이" };

    let setDataResult = false;
    act(() => {
      // @ts-expect-error - 일부러 틀린 데이터 넣음
      setDataResult = result.current.setData(invalidData);
    });

    // 디바운스 시간 기다리기
    await new Promise((resolve) => setTimeout(resolve, customDelay));

    // 저장소에 데이터가 갱신되지 않았어야 함
    expect(mockStorage[testKey]).toEqual(initialData);
    expect(setDataResult).toBe(false);
  });
});
