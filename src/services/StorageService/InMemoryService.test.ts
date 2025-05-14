import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStorageService } from "./InMemoryService";

describe("InMemoryStorageService", () => {
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

  // 각 테스트마다 새로운 인스턴스 사용
  let service: InMemoryStorageService<TestData>;

  beforeEach(() => {
    service = new InMemoryStorageService<TestData>(validator);
  });

  describe("get", () => {
    it("should retrieve data correctly", () => {
      // 준비
      service.set(TEST_KEY, validData);

      // 실행
      const retrieved = service.get(TEST_KEY);

      // 검증
      expect(retrieved).toEqual(validData);
    });

    it("should return null when data is not found", () => {
      // 실행
      const retrieved = service.get("non-existent-key");

      // 검증
      expect(retrieved).toBeNull();
    });
  });

  describe("set", () => {
    it("should store data correctly", () => {
      // 실행
      service.set(TEST_KEY, validData);

      // 검증
      const retrieved = service.get(TEST_KEY);
      expect(retrieved).toEqual(validData);
    });

    it("should throw error when trying to set invalid data", () => {
      // 실행 & 검증
      expect(() => {
        // @ts-expect-error: 의도적으로 잘못된 타입의 데이터를 전달
        service.set(TEST_KEY, invalidData);
      }).toThrow("Invalid data format");

      // 데이터가 저장되지 않았는지 확인
      expect(service.get(TEST_KEY)).toBeNull();
    });

    it("should overwrite existing data with the same key", () => {
      // 준비
      const initialData: TestData = { id: 1, name: "Initial" };
      const updatedData: TestData = { id: 1, name: "Updated" };

      // 실행
      service.set(TEST_KEY, initialData);
      service.set(TEST_KEY, updatedData);

      // 검증
      const retrieved = service.get(TEST_KEY);
      expect(retrieved).toEqual(updatedData);
      expect(retrieved).not.toEqual(initialData);
    });
  });

  describe("remove", () => {
    it("should remove data correctly", () => {
      // 준비
      service.set(TEST_KEY, validData);

      // 실행
      service.remove(TEST_KEY);

      // 검증
      expect(service.get(TEST_KEY)).toBeNull();
    });
  });

  describe("multiple instances", () => {
    it("should maintain separate storage for different instances", () => {
      // 준비
      const service1 = new InMemoryStorageService<TestData>(validator);
      const service2 = new InMemoryStorageService<TestData>(validator);

      // 실행
      service1.set(TEST_KEY, validData);

      // 검증
      expect(service1.get(TEST_KEY)).toEqual(validData);
      expect(service2.get(TEST_KEY)).toBeNull();
    });
  });
});
