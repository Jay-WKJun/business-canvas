import { describe, it, expect, vi, beforeEach } from "vitest";

describe("createStorageService", () => {
  const testValidator = (data: unknown) => {
    return typeof data === "object" && data !== null;
  };

  // 각 테스트 전에 모듈 캐시와 모킹을 초기화
  beforeEach(() => {
    vi.resetModules();
    vi.unmock("@/utils/env");
  });

  it("should create a local storage service when env.storage is local-storage", async () => {
    // env 모듈 모킹
    vi.doMock("@/utils/env", () => ({
      env: {
        storage: "local-storage",
      },
    }));

    // 모킹된 모듈 가져오기
    const { createStorageService } = await import("./StorageService");
    const { LocalStorageService } = await import("./LocalStorageService");
    const storageService = createStorageService(testValidator);

    expect(storageService).toBeInstanceOf(LocalStorageService);
    expect(Object.getPrototypeOf(storageService).constructor.name).toBe(
      LocalStorageService.name
    );
  });

  it("should create an in-memory storage service when env.storage is in-memory", async () => {
    // env 모듈 모킹
    vi.doMock("@/utils/env", () => ({
      env: {
        storage: "in-memory",
      },
    }));

    // 모킹된 모듈 가져오기
    const { createStorageService } = await import("./StorageService");
    const { InMemoryStorageService } = await import("./InMemoryService");
    const storageService = createStorageService(testValidator);

    expect(storageService).toBeInstanceOf(InMemoryStorageService);
    expect(Object.getPrototypeOf(storageService).constructor.name).toBe(
      InMemoryStorageService.name
    );
  });

  it("should create an in-memory storage service when env.storage is undefined", async () => {
    // env 모듈 모킹
    vi.doMock("@/utils/env", () => ({
      env: {
        storage: undefined,
      },
    }));

    // 모킹된 모듈 가져오기
    const { createStorageService } = await import("./StorageService");
    const { InMemoryStorageService } = await import("./InMemoryService");
    const storageService = createStorageService(testValidator);

    expect(storageService).toBeInstanceOf(InMemoryStorageService);
    expect(Object.getPrototypeOf(storageService).constructor.name).toBe(
      InMemoryStorageService.name
    );
  });

  it("should create an in-memory storage service when env.storage is any other value", async () => {
    // env 모듈 모킹
    vi.doMock("@/utils/env", () => ({
      env: {
        storage: "any-other-value",
      },
    }));

    // 모킹된 모듈 가져오기
    const { createStorageService } = await import("./StorageService");
    const { InMemoryStorageService } = await import("./InMemoryService");
    const storageService = createStorageService(testValidator);

    expect(storageService).toBeInstanceOf(InMemoryStorageService);
    expect(Object.getPrototypeOf(storageService).constructor.name).toBe(
      InMemoryStorageService.name
    );
  });
});
