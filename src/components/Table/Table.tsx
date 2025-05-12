import { Table as AntdTable } from "antd";

import { type Record } from "./models/Record";
import { type DataSource } from "./type";
import { getDataSource, getColumns } from "./utils/fieldToSchema";

interface TableProps {
  records: Record[];
  onSelectionChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: DataSource[]
  ) => void;
}

export function Table({ records, onSelectionChange }: TableProps) {
  const dataSource = getDataSource(records);
  const columns = getColumns(records[0]);

  return (
    <AntdTable
      rowSelection={
        onSelectionChange
          ? {
              type: "checkbox",
              onChange: onSelectionChange,
            }
          : undefined
      }
      dataSource={dataSource}
      columns={columns}
    />
  );
}
