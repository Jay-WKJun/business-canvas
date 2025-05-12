import { Table as AntdTable } from "antd";

import { type DataSource } from "./type";
import {
  TableContextProvider,
  TableContextConsumer,
} from "./context/TableContext";
import type { TableDataType } from "./models/TableData";

interface TableProps {
  tableData: TableDataType;
  onSelectionChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: DataSource[]
  ) => void;
}

export function Table({ tableData, onSelectionChange }: TableProps) {
  return (
    <TableContextProvider tableData={tableData}>
      <TableContextConsumer>
        {(context) => {
          if (!context) return null;

          const { dataSource, columns } = context;
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
        }}
      </TableContextConsumer>
    </TableContextProvider>
  );
}
