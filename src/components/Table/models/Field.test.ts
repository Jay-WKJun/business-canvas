import { describe, it, expect } from "vitest";
import { Field, FieldSchema } from "./Field";
import dayjs from "dayjs";

describe("Field Model", () => {
  describe("FieldSchema Tests", () => {
    it("should create a valid field schema", () => {
      const testSchema = {
        type: "text",
        label: "Name",
        required: true,
        schemaOrder: 1,
      };

      const schema = FieldSchema.parse(testSchema);

      expect(schema.type).toBe(testSchema.type);
      expect(schema.label).toBe(testSchema.label);
      expect(schema.required).toBe(testSchema.required);
      expect(schema.schemaOrder).toBe(testSchema.schemaOrder);
    });

    it("should throw an error when required property is missing", () => {
      expect(() =>
        FieldSchema.parse({
          type: "text",
          label: "Name",
          // required property is missing
          schemaOrder: 1,
        })
      ).toThrow();
    });

    it("should throw an error when field type is invalid", () => {
      expect(() =>
        FieldSchema.parse({
          type: "invalid-type", // Invalid type
          label: "Name",
          required: true,
          schemaOrder: 1,
        })
      ).toThrow();
    });

    it("should throw an error when a field schema has extra properties", () => {
      expect(() =>
        FieldSchema.parse({
          type: "text",
          label: "Name",
          required: true,
          schemaOrder: 1,
          // extra property
          value: "",
        })
      ).toThrow();
    });
  });

  describe("Text Field Tests", () => {
    const testData = {
      type: "text",
      label: "Name",
      required: true,
      schemaOrder: 1,
      value: "John Doe",
    };

    it("should create a valid text field", () => {
      const textField = Field.parse(testData);

      expect(textField.type).toBe(testData.type);
      expect(textField.value).toBe(testData.value);
      expect(textField.label).toBe(testData.label);
      expect(textField.required).toBe(testData.required);
      expect(textField.schemaOrder).toBe(testData.schemaOrder);
    });

    it("should throw an error when text field exceeds character limit", () => {
      expect(() =>
        Field.parse({
          ...testData,
          value: "123456789012345678901", // 21 characters (max is 20)
        })
      ).toThrow();
    });

    it("should set default value for text field when value is not provided", () => {
      const textField = Field.parse({
        ...testData,
        value: undefined,
      });

      expect(textField.value).toBe("");
    });
  });

  describe("Textarea Field Tests", () => {
    const testData = {
      type: "textarea",
      label: "Introduction",
      required: true,
      schemaOrder: 5,
      value: "Hello, my name is John Doe.",
    };

    it("should create a valid textarea field", () => {
      const textareaField = Field.parse(testData);

      expect(textareaField.type).toBe(testData.type);
      expect(textareaField.value).toBe(testData.value);
    });

    it("should throw an error when textarea field exceeds character limit", () => {
      expect(() =>
        Field.parse({
          ...testData,
          value: "1".repeat(51), // 51 characters (max is 50)
        })
      ).toThrow();
    });

    it("should set empty string as default when value is not provided", () => {
      const textareaField = Field.parse({
        ...testData,
        value: undefined,
      });

      expect(textareaField.value).toBe("");
    });
  });

  describe("Checkbox Field Tests", () => {
    const testData = {
      type: "checkbox",
      label: "Agreement",
      required: true,
      schemaOrder: 2,
      value: true,
    };

    it("should create a valid checkbox field", () => {
      const checkboxField = Field.parse(testData);

      expect(checkboxField.type).toBe(testData.type);
      expect(checkboxField.value).toBe(testData.value);
    });

    it("should set default value to false when value is not provided", () => {
      const checkboxField = Field.parse({
        ...testData,
        value: undefined,
      });

      expect(checkboxField.value).toBe(false);
    });

    it("should throw an error when checkbox field value is not boolean", () => {
      expect(() =>
        Field.parse({
          ...testData,
          value: "invalid value",
        })
      ).toThrow();
    });
  });

  describe("Date Field Tests", () => {
    const testData = {
      type: "date",
      label: "Birth Date",
      required: true,
      schemaOrder: 3,
      value: "2023-01-01",
    };

    it("should create a valid date field", () => {
      const dateField = Field.parse(testData);

      expect(dateField.type).toBe(testData.type);
      expect(dateField.value).toBe(testData.value);
    });

    it("should set today's date as default when value is not provided", () => {
      const dateField = Field.parse({
        ...testData,
        value: undefined,
      });

      expect(dateField.value).toBe(dayjs().format("YYYY-MM-DD"));
    });

    it("should throw an error when date format is invalid", () => {
      expect(() =>
        Field.parse({
          ...testData,
          value: "2023/01/01", // Invalid format (should be YYYY-MM-DD)
        })
      ).toThrow();

      expect(() =>
        Field.parse({
          ...testData,
          value: "01-01-2023", // Invalid format (should be YYYY-MM-DD)
        })
      ).toThrow();

      expect(() =>
        Field.parse({
          ...testData,
          value: "not a date",
        })
      ).toThrow();
    });
  });

  describe("Select Field Tests", () => {
    const testData = {
      type: "select",
      label: "Occupation",
      required: true,
      schemaOrder: 4,
      value: "Developer",
    };

    it("should create a valid select field", () => {
      const selectField = Field.parse(testData);

      expect(selectField.type).toBe(testData.type);
      expect(selectField.value).toBe(testData.value);
    });

    it("should set empty string as default when value is not provided", () => {
      const selectField = Field.parse({
        ...testData,
        value: undefined,
      });

      expect(selectField.value).toBe("");
    });
  });
});
