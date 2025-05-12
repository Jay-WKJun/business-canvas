import { Checkbox } from "antd";

import { type TableDataType } from "../models/TableData";
import { type DataSource } from "../type";
import { type RecordType } from "../models/Record";

export function getDataSource(records: RecordType[]) {
  return records.map((record, recordIndex: number) => {
    const dataSource = record.reduce<DataSource>(
      (acc, field) => {
        acc[field.label] = field.value;
        return acc;
      },
      { key: recordIndex }
    );
    return dataSource;
  });
}

export function getColumns(baseFieldSchema: TableDataType["schema"]) {
  return baseFieldSchema.map((field) => {
    const standardColumn = {
      title: field.label,
      dataIndex: field.label,
      key: field.label,
    };

    if (field.type === "checkbox") {
      return {
        ...standardColumn,
        render: (value: boolean) => <Checkbox checked={value} />,
      };
    }

    return standardColumn;
  });
}
