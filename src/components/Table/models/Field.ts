import { z } from "zod";

export const FieldSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("checkbox"),
    label: z.string(),
    required: z.boolean(),
    value: z.boolean(),
  }),
  z.object({
    type: z.enum(["text", "date", "select", "textarea"]),
    label: z.string(),
    required: z.boolean(),
    value: z.string(),
  }),
]);

export type Field = z.infer<typeof FieldSchema>;
export type FieldType = Field["type"];
