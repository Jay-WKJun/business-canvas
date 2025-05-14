import { describe, it, expect } from "vitest";
import { Record, RecordSchema } from "./Record";

describe("Record Model", () => {
  describe("RecordSchema Tests", () => {
    const testSchemas = [
      {
        type: "text",
        label: "Name",
        required: true,
        schemaOrder: 1,
      },
      {
        type: "text",
        label: "Text2",
        required: true,
        schemaOrder: 2,
      },
      {
        type: "checkbox",
        label: "Agreement",
        required: false,
        schemaOrder: 3,
      },
      {
        type: "date",
        label: "Birth Date",
        required: true,
        schemaOrder: 4,
      },
      {
        type: "select",
        label: "Occupation",
        required: true,
        schemaOrder: 5,
      },
      {
        type: "textarea",
        label: "Introduction",
        required: false,
        schemaOrder: 6,
      },
      {
        type: "textarea",
        label: "TextArea2",
        required: false,
        schemaOrder: 7,
      },
    ];

    it("should create a valid record schema", () => {
      const recordSchema = RecordSchema.parse(testSchemas);

      expect(recordSchema).toEqual(testSchemas);
      expect(recordSchema).toHaveLength(testSchemas.length);
      expect(recordSchema[0].type).toBe(testSchemas[0].type);
      expect(recordSchema[1].type).toBe(testSchemas[1].type);
      expect(recordSchema[2].type).toBe(testSchemas[2].type);
      expect(recordSchema[3].type).toBe(testSchemas[3].type);
      expect(recordSchema[4].type).toBe(testSchemas[4].type);
      expect(recordSchema[5].type).toBe(testSchemas[5].type);
      expect(recordSchema[6].type).toBe(testSchemas[6].type);
    });

    it("should throw an error when a field in the record schema is invalid", () => {
      const invalidRecordSchema = [
        ...testSchemas,
        {
          // 유효하지 않은 타입
          type: "invalid-type",
          label: "Invalid Field",
          required: true,
          schemaOrder: 8,
        },
      ];

      expect(() => RecordSchema.parse(invalidRecordSchema)).toThrow();
    });

    it("should throw an error when a field in the record schema is missing", () => {
      const missingFieldRecordSchema = [
        ...testSchemas,
        {
          type: "text",
          schemaOrder: 1,
          // label 속성 누락
          // required 속성 누락
        },
      ];

      expect(() => RecordSchema.parse(missingFieldRecordSchema)).toThrow();
    });

    it("should throw an error when a field in the record schema has extra properties", () => {
      const extraPropertyRecordSchema = [
        ...testSchemas,
        {
          type: "text",
          label: "Name",
          required: true,
          schemaOrder: 1,
          // 불필요한 추가 속성
          value: "",
        },
      ];

      expect(() => RecordSchema.parse(extraPropertyRecordSchema)).toThrow();
    });

    it("should throw an error when a record schema is not array", () => {
      const notArraySchema = testSchemas[0];
      expect(() => RecordSchema.parse(notArraySchema)).toThrow();
    });
  });

  describe("Record Tests", () => {
    // 테스트에 사용할 유효한 필드 데이터
    const validFields = [
      {
        type: "text" as const,
        label: "Name",
        required: true,
        schemaOrder: 1,
        value: "John Doe",
      },
      {
        type: "text" as const,
        label: "Description",
        required: true,
        schemaOrder: 2,
        value: "This is a description",
      },
      {
        type: "checkbox" as const,
        label: "Agreement",
        required: false,
        schemaOrder: 3,
        value: true,
      },
      {
        type: "date" as const,
        label: "Birth Date",
        required: true,
        schemaOrder: 4,
        value: "2023-01-01",
      },
      {
        type: "select" as const,
        label: "Occupation",
        required: true,
        schemaOrder: 5,
        value: "Developer",
      },
      {
        type: "select" as const,
        label: "Nationality",
        required: true,
        schemaOrder: 6,
        value: "Korean",
      },
      {
        type: "textarea" as const,
        label: "Introduction",
        required: false,
        schemaOrder: 7,
        value: "Hello, I am John Doe.",
      },
    ];

    it("should create a valid record with multiple fields", () => {
      const record = Record.parse(validFields);

      expect(record).toEqual(validFields);
      expect(record).toHaveLength(validFields.length);
      expect(record[0].type).toBe(validFields[0].type);
      expect(record[1].type).toBe(validFields[1].type);
      expect(record[2].type).toBe(validFields[2].type);
      expect(record[3].type).toBe(validFields[3].type);
      expect(record[4].type).toBe(validFields[4].type);
    });

    it("should create a valid empty record", () => {
      const emptyRecord = Record.parse([]);

      expect(emptyRecord).toEqual([]);
      expect(emptyRecord).toHaveLength(0);
    });

    it("should throw an error when a field in the record is invalid", () => {
      const invalidRecord = [
        ...validFields,
        {
          type: "text" as const,
          label: "Invalid Field",
          required: true,
          schemaOrder: 6,
          value: "1".repeat(30), // 글자수 제한 초과 (최대 20자)
        },
      ];

      expect(() => Record.parse(invalidRecord)).toThrow();
    });

    it("should throw an error when a field has an invalid type", () => {
      const invalidTypeRecord = [
        ...validFields.slice(0, 2),
        {
          type: "invalid-type" as const, // 타입 시스템에서는 유효하지만 런타임에서 검증 실패
          label: "Invalid Type Field",
          required: true,
          schemaOrder: 6,
          value: "Some value",
        },
      ];

      expect(() => Record.parse(invalidTypeRecord)).toThrow();
    });

    it("should throw an error when a required field property is missing", () => {
      // 타입 정의에서 label과 required 속성을 부분적으로 생략
      interface PartialField {
        type: "text";
        schemaOrder: number;
        value: string;
      }

      const missingPropertyRecord = [
        ...validFields.slice(0, 2),
        {
          type: "text",
          // label 속성 누락
          // required 속성 누락
          schemaOrder: 6,
          value: "Some value",
        } as PartialField,
      ];

      expect(() => Record.parse(missingPropertyRecord)).toThrow();
    });

    it("should throw an error when a record has extra properties", () => {
      const extraPropertyRecord = [
        ...validFields,
        {
          type: "text",
          label: "Name",
          required: true,
          schemaOrder: 1,
          // 불필요한 추가 속성
          value: "",
        },
      ];

      expect(() => Record.parse(extraPropertyRecord)).toThrow();
    });

    it("should throw an error when a record is not array", () => {
      const notArrayRecord = validFields[0];
      expect(() => Record.parse(notArrayRecord)).toThrow();
    });
  });
});
