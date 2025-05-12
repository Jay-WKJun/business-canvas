import { z } from "zod";

import { RecordSchema, Record } from "./Record";

export const TableData = z.object({
  schema: RecordSchema, // 필드 정의 (메타데이터)
  records: z.array(Record), // 데이터 레코드 배열
});

export type TableDataType = z.infer<typeof TableData>;
