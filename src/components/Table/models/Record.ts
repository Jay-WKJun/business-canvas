import { z } from "zod";

import { Field, FieldSchema } from "./Field";

export const RecordSchema = z.array(FieldSchema);
export type RecordSchemaType = z.infer<typeof RecordSchema>;

export const Record = z.array(Field);
export type RecordType = z.infer<typeof Record>;
