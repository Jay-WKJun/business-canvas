import { z } from "zod";

import { FieldSchema } from "./Field";

export const RecordSchema = z.array(FieldSchema);
export type Record = z.infer<typeof RecordSchema>;
