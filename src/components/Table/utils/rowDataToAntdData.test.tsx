import { describe, it, expect, vi } from "vitest";
import {
  convertRecordsToAntdDataSource,
  generateAntdColumnsFromSchema,
} from "./rowDataToAntdData";
import type { RecordType } from "../models/Record";
import type { TableDataType } from "../models/TableData";

// Mock Checkbox component
vi.mock("antd", () => ({
  Checkbox: ({ checked }: { checked: boolean }) => ({
    type: "Checkbox",
    props: { checked },
  }),
}));

// Mock MoreDropdownInRecord component
vi.mock("../components/MoreDropdownInRecord", () => ({
  MoreDropdownInRecord: ({ recordIndex }: { recordIndex: number }) => ({
    type: "MoreDropdownInRecord",
    props: { recordIndex },
  }),
}));

describe("rowDataToAntdData", () => {
  describe("convertRecordsToAntdDataSource", () => {
    it("should convert records to Ant Design DataSource format", () => {
      // Arrange
      const mockRecords: RecordType[] = [
        [
          {
            label: "name",
            value: "John Doe",
            type: "text",
            required: false,
            schemaOrder: 0,
          },
          {
            label: "age",
            value: "30",
            type: "text",
            required: false,
            schemaOrder: 1,
          },
          {
            label: "active",
            value: true,
            type: "checkbox",
            required: false,
            schemaOrder: 2,
          },
        ],
        [
          {
            label: "name",
            value: "Jane Smith",
            type: "text",
            required: false,
            schemaOrder: 0,
          },
          {
            label: "age",
            value: "25",
            type: "text",
            required: false,
            schemaOrder: 1,
          },
          {
            label: "active",
            value: false,
            type: "checkbox",
            required: false,
            schemaOrder: 2,
          },
        ],
      ];

      // Act
      const result = convertRecordsToAntdDataSource(mockRecords);

      // Assert
      expect(result).toEqual([
        { key: 0, index: 0, name: "John Doe", age: "30", active: true },
        { key: 1, index: 1, name: "Jane Smith", age: "25", active: false },
      ]);
    });

    it("should handle empty records array", () => {
      // Arrange
      const mockRecords: RecordType[] = [];

      // Act
      const result = convertRecordsToAntdDataSource(mockRecords);

      // Assert
      expect(result).toEqual([]);
    });

    it("should handle records with different field structures", () => {
      // Arrange
      const mockRecords: RecordType[] = [
        [
          {
            label: "name",
            value: "John Doe",
            type: "text",
            required: false,
            schemaOrder: 0,
          },
          {
            label: "age",
            value: "30",
            type: "text",
            required: false,
            schemaOrder: 1,
          },
        ],
        [
          {
            label: "name",
            value: "Jane Smith",
            type: "text",
            required: false,
            schemaOrder: 0,
          },
          {
            label: "active",
            value: true,
            type: "checkbox",
            required: false,
            schemaOrder: 1,
          },
        ],
      ];

      // Act
      const result = convertRecordsToAntdDataSource(mockRecords);

      // Assert
      expect(result).toEqual([
        { key: 0, index: 0, name: "John Doe", age: "30" },
        { key: 1, index: 1, name: "Jane Smith", active: true },
      ]);
    });
  });

  describe("generateAntdColumnsFromSchema", () => {
    it("should generate columns from schema with correct length", () => {
      const mockSchema: TableDataType["schema"] = [
        { label: "name", type: "text", required: false, schemaOrder: 0 },
        { label: "age", type: "text", required: false, schemaOrder: 1 },
        { label: "active", type: "checkbox", required: false, schemaOrder: 2 },
      ];

      const columns = generateAntdColumnsFromSchema(mockSchema);

      // Assert 3 필드 + 1 컨트롤러 컬럼
      expect(columns).toHaveLength(4);

      // 순서에 맞춰 컬럼이 생성되었는지 확인
      expect(columns[0].title).toBe(mockSchema[0].label);
      expect(columns[1].title).toBe(mockSchema[1].label);
      expect(columns[2].title).toBe(mockSchema[2].label);
      // 컨트롤러 컬럼은 항상 포함되어야 함.
      expect(columns[3].title).toBe("");
      expect(columns[3].key).toBe("controller");
      expect(typeof columns[3].render).toBe("function");
    });

    it("should handle empty schema", () => {
      const mockSchema: TableDataType["schema"] = [];

      const columns = generateAntdColumnsFromSchema(mockSchema);

      expect(columns).toHaveLength(1);
      // 필드가 없다면 컨트롤러만 있음.
      expect(columns[0].key).toBe("controller");
      expect(typeof columns[0].render).toBe("function");
    });

    it("should handle checkbox type with render function", () => {
      const mockSchema: TableDataType["schema"] = [
        { label: "active", type: "checkbox", required: false, schemaOrder: 0 },
      ];

      const columns = generateAntdColumnsFromSchema(mockSchema);

      // Assert 1 필드 + 1 컨트롤러 컬럼
      expect(columns).toHaveLength(2);
      expect(columns[0].title).toBe(mockSchema[0].label);
      // checkbox type의 경우 render 함수가 있어야 함
      expect(typeof columns[0].render).toBe("function");
    });
  });
});
