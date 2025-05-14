import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LocalStorageService } from "./LocalStorageService";

describe("LocalStorageService", () => {
  // 테스트용 타입 정의
  interface TestData {
    id: number;
    name: string;
  }

  // 테스트용 validator
  const validator = (data: TestData): boolean => {
    return typeof data.id === "number" && typeof data.name === "string";
  };

  const TEST_KEY = "test-key";
  // 유효한 데이터
  const validData: TestData = { id: 1, name: "Test" };
  // 타입이 맞지 않는 데이터
  const invalidData = { id: "1", name: 123 };

  // localStorage 모킹
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    localStorageMock = {};

    // localStorage 모킹
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
    });

    // localStorage 메소드 추적
    vi.spyOn(localStorage, "getItem");
    vi.spyOn(localStorage, "setItem");
    vi.spyOn(localStorage, "removeItem");
    vi.spyOn(localStorage, "clear");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("get", () => {
    it("should retrieve data correctly", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);
      service.set(TEST_KEY, validData);

      // 실행
      const retrieved = service.get(TEST_KEY);

      // 검증
      expect(retrieved).toEqual(validData);
      expect(localStorage.getItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it("should return null when data is not found", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);

      // 실행
      const retrieved = service.get("non-existent-key");

      // 검증
      expect(retrieved).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith("non-existent-key");
    });

    it("should return null when stored data fails validation", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);

      // localStorage에 직접 유효하지 않은 데이터 저장 (validator 우회)
      localStorage.setItem(TEST_KEY, JSON.stringify(invalidData));

      // 실행
      const retrieved = service.get(TEST_KEY);

      // 검증
      expect(retrieved).toBeNull();
    });

    it("should handle JSON.parse errors", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);

      // localStorage에 유효하지 않은 JSON 저장
      localStorage.setItem(TEST_KEY, "invalid-json");

      // 실행 & 검증
      expect(() => {
        service.get(TEST_KEY);
      }).toThrow();
    });
  });

  describe("set", () => {
    it("should store data correctly", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);

      // 실행
      service.set(TEST_KEY, validData);

      // 검증
      expect(localStorage.setItem).toHaveBeenCalledWith(
        TEST_KEY,
        JSON.stringify(validData)
      );

      // 실제로 저장되었는지 확인
      expect(JSON.parse(localStorageMock[TEST_KEY])).toEqual(validData);
    });

    it("should throw error when trying to set invalid data", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);

      // 실행 & 검증
      expect(() => {
        // @ts-expect-error: 의도적으로 잘못된 타입의 데이터를 전달
        service.set(TEST_KEY, invalidData);
      }).toThrow("Invalid data format");

      // localStorage에 저장되지 않았는지 확인
      expect(localStorageMock[TEST_KEY]).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("should remove data correctly", () => {
      // 준비
      const service = new LocalStorageService<TestData>(validator);
      service.set(TEST_KEY, validData);

      // 실행
      service.remove(TEST_KEY);

      // 검증
      expect(localStorage.removeItem).toHaveBeenCalledWith(TEST_KEY);
      expect(service.get(TEST_KEY)).toBeNull();
      expect(localStorageMock[TEST_KEY]).toBeUndefined();
    });
  });
});
