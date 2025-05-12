type FieldType = "text" | "checkbox" | "date" | "select" | "textarea";

type FieldValueType<T extends FieldType> = T extends "checkbox"
  ? boolean
  : string;

interface IField<T extends FieldType = FieldType> {
  type: T;
  label: string;
  required: boolean;
  value: FieldValueType<T>;
}

export class Field<T extends FieldType = FieldType> implements IField<T> {
  type: T;
  label: string;
  required: boolean;
  value: FieldValueType<T>;

  constructor(field: IField<T>) {
    this.type = field.type;
    this.label = field.label;
    this.required = field.required;
    this.value = field.value;
    this.validate(field);
  }

  private validate({ type, value }: IField<T>) {
    if (!value) throw new Error("Value is empty");

    if (type === "text") {
      const textValue = value as string;
      if (textValue.length > 20) {
        throw new Error("Text field is too long");
      }
    }

    if (type === "textarea") {
      const textValue = value as string;
      if (textValue.length > 50) {
        throw new Error("Textarea field is too long");
      }
    }
  }

  edit(value: IField<T>["value"]) {
    this.validate({ ...this, value });
    this.value = value;
    return true;
  }
}
