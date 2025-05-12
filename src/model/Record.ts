import { type Field } from "./Field";

type Fields = Field[];

export class Record {
  fields: Fields;

  constructor(fields: Fields) {
    this.fields = fields;
  }

  editField<T extends number, K extends Fields[T]["value"]>(
    index: number,
    value: K
  ) {
    const field = this.fields[index];
    if (!field) throw new Error("Field not found");
    field.edit(value);
  }
}
