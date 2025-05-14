import { describe, it, expect } from "vitest";
import { Record, RecordSchema } from "./Record";
import { testSchemas } from "./mock/mockSchemas";
import { testRecord } from "./mock/mockRecords";

describe("Record Model", () => {
  describe("RecordSchema Tests", () => {
    // RecordSchema의 내용물인 FieldSchema invalid 테스트는 Field.test.ts 에서 확인

    it("should create a valid record schema", () => {
      const recordSchema = RecordSchema.parse(testSchemas);

      expect(recordSchema).toEqual(testSchemas);
      expect(recordSchema).toHaveLength(testSchemas.length);
      expect(recordSchema[0].type).toBe(testSchemas[0].type);
      expect(recordSchema[1].type).toBe(testSchemas[1].type);
      expect(recordSchema[2].type).toBe(testSchemas[2].type);
    });

    it("should throw an error when a record schema is empty", () => {
      // @ts-expect-error - 허용되지 않는 빈 배열 테스트
      const emptySchema = [];
      // @ts-expect-error - 허용되지 않는 빈 배열 테스트
      expect(() => RecordSchema.parse(emptySchema)).toThrow();
    });

    it("should throw an error when a record schema is not array", () => {
      const notArraySchema = testSchemas[0];
      expect(() => RecordSchema.parse(notArraySchema)).toThrow();
    });
  });

  describe("Record Tests", () => {
    // Record 내용물인 Field invalid 테스트는 Field.test.ts 에서 확인

    it("should create a valid record with multiple fields", () => {
      const record = Record.parse(testRecord);

      expect(record).toEqual(testRecord);
      expect(record).toHaveLength(testRecord.length);
      expect(record[0].type).toBe(testRecord[0].type);
      expect(record[2].type).toBe(testRecord[2].type);
    });

    it("should create a valid empty record", () => {
      const emptyRecord = Record.parse([]);

      expect(emptyRecord).toEqual([]);
      expect(emptyRecord).toHaveLength(0);
    });

    it("should throw an error when a record is not array", () => {
      const notArrayRecord = testRecord[0];
      expect(() => Record.parse(notArrayRecord)).toThrow();
    });
  });
});
