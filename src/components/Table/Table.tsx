import { Table as AntdTable, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { ColumnType } from "antd/es/table/interface";

import { type DataSource } from "./type";
import {
  TableContextProvider,
  TableContextConsumer,
} from "./context/TableContext";
import type { TableDataType } from "./models/TableData";
import { RecordForm } from "./components/RecordForm";
import { FilterDropdown } from "./components/FilterDropdown";

interface TableProps {
  tableData: TableDataType;
  onSelectionChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: DataSource[]
  ) => void;
}

export function Table({ tableData, onSelectionChange }: TableProps) {
  const [isRecordFormVisible, setIsRecordFormVisible] = useState(false);

  return (
    <TableContextProvider tableData={tableData}>
      <TableContextConsumer>
        {(context) => {
          if (!context) return null;

          const { dataSource, columns } = context;
          return (
            <>
              <div
                style={{
                  padding: "8px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.Title level={5} style={{ margin: 0 }}>
                  회원 목록
                </Typography.Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsRecordFormVisible(true)}
                >
                  추가
                </Button>

                <RecordForm
                  visible={isRecordFormVisible}
                  onClose={() => setIsRecordFormVisible(false)}
                />
              </div>

              <AntdTable
                pagination={{ position: ["none", "none"] }}
                rowSelection={
                  onSelectionChange
                    ? {
                        type: "checkbox",
                        onChange: onSelectionChange,
                      }
                    : undefined
                }
                dataSource={dataSource}
                columns={columns.map((column) => {
                  const dataIndex =
                    "dataIndex" in column ? column.dataIndex : undefined;
                  const filterProps = getColumnFilterProps(
                    dataSource,
                    dataIndex
                  );

                  return {
                    ...column,
                    ...filterProps,
                  };
                })}
              />
            </>
          );
        }}
      </TableContextConsumer>
    </TableContextProvider>
  );
}

function getColumnFilterProps(dataSource: DataSource[], dataIndex?: string) {
  if (dataIndex == null) return {};

  const filters = Array.from(new Set(dataSource.map((data) => data[dataIndex])))
    .map((data) => ({
      text: data,
      value: data,
    }))
    .filter((data) => data.value != null);

  type DataSourceColumnType = NonNullable<ColumnType<DataSource>>;

  const filterDropdown: DataSourceColumnType["filterDropdown"] = (props) => (
    <FilterDropdown {...props} />
  );
  const onFilter: DataSourceColumnType["onFilter"] = (value, record) =>
    record[dataIndex] === value;

  return {
    filterDropdown,
    filters,
    onFilter,
  };
}
