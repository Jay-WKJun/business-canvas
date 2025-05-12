import { Checkbox } from "antd";

import { type TableDataType } from "../models/TableData";
import { type DataSource } from "../type";
import { type RecordType } from "../models/Record";
import { RecordMore } from "../components/RecordMore";

export function getDataSource(records: RecordType[]) {
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

export function getColumns(baseFieldSchema: TableDataType["schema"]) {
  return [
    ...baseFieldSchema.map((field) => {
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
    }),
    {
      title: "",
      key: "controller",
      render: (_: string, record: DataSource) => (
        <RecordMore recordIndex={record.index as number} />
      ),
    },
  ];
}
