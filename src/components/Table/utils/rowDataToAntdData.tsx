import { Checkbox } from "antd";

import { type TableDataType } from "../models/TableData";
import { type DataSource } from "../type";
import { type RecordType } from "../models/Record";
import { MoreDropdownInRecord } from "../components/MoreDropdownInRecord";

/**
 * @typedef {RecordType[]} Records
 * @typedef {DataSource[]} DataSource
 * @description 레코드 배열을 Ant Design Table에서 사용하는 DataSource 형식으로 변환
 * @param {Records} records 레코드 배열
 * @returns {DataSource} DataSource 형식의 데이터 소스
 */
export function convertRecordsToAntdDataSource(records: RecordType[]) {
  return records.map((record, recordIndex: number) => {
    const dataSource = record.reduce<DataSource>(
      (acc, field) => {
        acc[field.label] = field.value;
        return acc;
      },
      { key: recordIndex, index: recordIndex }
    );
    return dataSource;
  });
}

/**
 * @typedef {TableDataType["schema"]} BaseFieldSchema
 * @description 필드 스키마를 Ant Design Table에서 사용하는 컬럼 정의로 변환
 * @param {BaseFieldSchema} baseFieldSchema 필드 스키마
 * @returns Ant Design Table에서 사용하는 컬럼 정의
 */
export function generateAntdColumnsFromSchema(
  baseFieldSchema: TableDataType["schema"]
) {
  return [
    ...baseFieldSchema.map((field) => {
      const standardColumn = {
        title: field.label,
        dataIndex: field.label,
        key: field.label,

        // column config
        ellipsis: true,
      };

      if (field.type === "checkbox") {
        return {
          ...standardColumn,
          render: (value: boolean) => <Checkbox checked={value} />,
        };
      }

      return standardColumn;
    }),
    // 컨트롤러 컬럼
    {
      title: "",
      key: "controller",
      render: (_: string, record: DataSource) => (
        <MoreDropdownInRecord recordIndex={record.index as number} />
      ),
    },
  ];
}
