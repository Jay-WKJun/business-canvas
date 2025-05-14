import { describe, it, expect } from "vitest";
import { Field, FieldSchema } from "./Field";
import dayjs from "dayjs";
import {
  textFieldTestData,
  checkboxFieldTestData,
  dateFieldTestData,
  selectFieldTestData,
  textareaFieldTestData,
} from "./mock/mockFields";
import { textSchemaTestData } from "./mock/mockSchemas";

describe("Field Model", () => {
  describe("FieldSchema Tests", () => {
    it("should create a valid field schema", () => {
      const schema = FieldSchema.parse(textSchemaTestData);

      expect(schema.type).toBe(textSchemaTestData.type);
      expect(schema.label).toBe(textSchemaTestData.label);
      expect(schema.required).toBe(textSchemaTestData.required);
      expect(schema.schemaOrder).toBe(textSchemaTestData.schemaOrder);
    });

    it("should throw an error when required property is missing", () => {
      expect(() =>
        FieldSchema.parse({
          type: "text",
          label: "Name",
          // required 속성 누락
          schemaOrder: 1,
        })
      ).toThrow();
    });

    it("should throw an error when field type is invalid", () => {
      expect(() =>
        FieldSchema.parse({
          // 유효하지 않은 타입
          type: "invalid-type",
          label: "Name",
          required: true,
          schemaOrder: 1,
        })
      ).toThrow();
    });

    it("extra property should be ignored", () => {
      expect(() =>
        FieldSchema.parse({
          ...textSchemaTestData,
          // 불필요한 속성
          extraProperty: "extra",
        })
      ).toThrow();
    });
  });

  describe("Text Field Tests", () => {
    it("should create a valid text field", () => {
      const textField = Field.parse(textFieldTestData);

      expect(textField.type).toBe(textFieldTestData.type);
      expect(textField.value).toBe(textFieldTestData.value);
      expect(textField.label).toBe(textFieldTestData.label);
      expect(textField.required).toBe(textFieldTestData.required);
      expect(textField.schemaOrder).toBe(textFieldTestData.schemaOrder);
    });

    it("should throw an error when text field exceeds character limit", () => {
      expect(() =>
        Field.parse({
          ...textFieldTestData,
          // 글자수 제한 초과
          value: "123456789012345678901", // 21 characters (max is 20)
        })
      ).toThrow();
    });

    it("should set default value for text field when value is not provided", () => {
      const textField = Field.parse({
        ...textFieldTestData,
        value: undefined,
      });

      expect(textField.value).toBe("");
    });
  });

  describe("Textarea Field Tests", () => {
    it("should create a valid textarea field", () => {
      const textareaField = Field.parse(textareaFieldTestData);

      expect(textareaField.type).toBe(textareaFieldTestData.type);
      expect(textareaField.value).toBe(textareaFieldTestData.value);
    });

    it("should throw an error when textarea field exceeds character limit", () => {
      expect(() =>
        Field.parse({
          ...textareaFieldTestData,
          // 글자수 제한 초과
          value: "1".repeat(51), // 51 characters (max is 50)
        })
      ).toThrow();
    });

    it("should set empty string as default when value is not provided", () => {
      const textareaField = Field.parse({
        ...textareaFieldTestData,
        value: undefined,
      });

      expect(textareaField.value).toBe("");
    });
  });

  describe("Checkbox Field Tests", () => {
    it("should create a valid checkbox field", () => {
      const checkboxField = Field.parse(checkboxFieldTestData);

      expect(checkboxField.type).toBe(checkboxFieldTestData.type);
      expect(checkboxField.value).toBe(checkboxFieldTestData.value);
    });

    it("should set default value to false when value is not provided", () => {
      const checkboxField = Field.parse({
        ...checkboxFieldTestData,
        value: undefined,
      });

      expect(checkboxField.value).toBe(false);
    });

    it("should throw an error when checkbox field value is not boolean", () => {
      expect(() =>
        Field.parse({
          ...checkboxFieldTestData,
          // 유효하지 않은 값 (boolean 타입이 아님)
          value: "invalid value",
        })
      ).toThrow();
    });
  });

  describe("Date Field Tests", () => {
    it("should create a valid date field", () => {
      const dateField = Field.parse(dateFieldTestData);

      expect(dateField.type).toBe(dateFieldTestData.type);
      expect(dateField.value).toBe(dateFieldTestData.value);
    });

    it("should set today's date as default when value is not provided", () => {
      const dateField = Field.parse({
        ...dateFieldTestData,
        value: undefined,
      });

      expect(dateField.value).toBe(dayjs().format("YYYY-MM-DD"));
    });

    it("should throw an error when date format is invalid", () => {
      expect(() =>
        Field.parse({
          ...dateFieldTestData,
          // 유효하지 않은 형식 (YYYY-MM-DD 형식이 아님)
          value: "2023/01/01",
        })
      ).toThrow();

      expect(() =>
        Field.parse({
          ...dateFieldTestData,
          // 유효하지 않은 형식 (YYYY-MM-DD 형식이 아님)
          value: "01-01-2023",
        })
      ).toThrow();

      expect(() =>
        Field.parse({
          ...dateFieldTestData,
          // 유효하지 않은 형식 (YYYY-MM-DD 형식이 아님)
          value: "not a date",
        })
      ).toThrow();
    });
  });

  describe("Select Field Tests", () => {
    it("should create a valid select field", () => {
      const selectField = Field.parse(selectFieldTestData);

      expect(selectField.type).toBe(selectFieldTestData.type);
      expect(selectField.value).toBe(selectFieldTestData.value);
    });

    it("should set empty string as default when value is not provided", () => {
      const selectField = Field.parse({
        ...selectFieldTestData,
        value: undefined,
      });

      expect(selectField.value).toBe("");
    });
  });
});
