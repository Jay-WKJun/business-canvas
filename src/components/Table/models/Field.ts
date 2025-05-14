import { z } from "zod";
import dayjs from "dayjs";

// 기본 필드 스키마 (공통 필드)
export const FieldSchema = z.object({
  type: z.enum(["text", "checkbox", "date", "select", "textarea"]),
  label: z.string(),
  required: z.boolean(),
  schemaOrder: z.number(),
});

export type FieldSchemaType = z.infer<typeof FieldSchema>;
export type FieldSchemaInputType = FieldSchemaType["type"];

// value가 있는 필드 스키마 (기존 FieldSchema)
export const Field = z.discriminatedUnion("type", [
  FieldSchema.extend({
    type: z.literal("checkbox"),
    value: z.boolean().default(false),
  }),
  FieldSchema.extend({
    type: z.enum(["date"]),
    value: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .default(dayjs().format("YYYY-MM-DD")),
  }),
  FieldSchema.extend({
    type: z.enum(["select"]),
    value: z.string().default(""),
  }),
  FieldSchema.extend({
    type: z.enum(["text"]),
    value: z.string().max(20, "글자수 20자를 초과할 수 없습니다.").default(""),
  }),
  FieldSchema.extend({
    type: z.enum(["textarea"]),
    value: z.string().max(50, "글자수 50자를 초과할 수 없습니다.").default(""),
  }),
]);

export type FieldType = z.infer<typeof Field>;
export type FieldInputType = FieldType["type"];
