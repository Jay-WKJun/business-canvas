import { Checkbox } from "antd";

import { type Field } from "../models/Field";
import { type DataSource } from "../type";

export function getDataSource(records: Field[][]) {
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

export function getColumns(record: Field[]) {
  return record.map((field) => {
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
