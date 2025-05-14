// Schema 테스트 데이터
export const textSchemaTestData = {
  type: "text",
  label: "Name",
  required: true,
  schemaOrder: 1,
};

const checkboxSchemaTestData = {
  type: "checkbox",
  label: "Agreement",
  required: false,
  schemaOrder: 2,
};

const dateSchemaTestData = {
  type: "date",
  label: "Birth Date",
  required: true,
  schemaOrder: 3,
};

const selectSchemaTestData = {
  type: "select",
  label: "Occupation",
  required: true,
  schemaOrder: 4,
};

const textareaSchemaTestData = {
  type: "textarea",
  label: "Introduction",
  required: false,
  schemaOrder: 5,
};

export const testSchemas = [
  textSchemaTestData,
  {
    ...textSchemaTestData,
    label: "Text2",
    schemaOrder: 2,
  },
  checkboxSchemaTestData,
  dateSchemaTestData,
  selectSchemaTestData,
  textareaSchemaTestData,
  {
    ...textareaSchemaTestData,
    label: "TextArea2",
    schemaOrder: 6,
  },
];
