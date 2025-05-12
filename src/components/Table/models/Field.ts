import { z } from "zod";

// 기본 필드 스키마 (공통 필드)
export const FieldSchema = z.object({
  type: z.enum(["text", "checkbox", "date", "select", "textarea"]),
  label: z.string(),
  required: z.boolean(),
  index: z.number(),
});

// value가 있는 필드 스키마 (기존 FieldSchema)
export const Field = z.discriminatedUnion("type", [
  FieldSchema.extend({
    type: z.literal("checkbox"),
    value: z.boolean(),
  }),
  FieldSchema.extend({
    type: z.enum(["text", "date", "select", "textarea"]),
    value: z.string(),
  }),
]);

export type FieldType = z.infer<typeof FieldSchema>;
export type FieldInputType = FieldType["type"];
