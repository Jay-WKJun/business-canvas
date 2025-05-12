import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { getDataSource, getColumns } from "../utils/fieldToSchema";
import type { TableDataType } from "../models/TableData";
import type { RecordType } from "../models/Record";

interface TableContextType {
  columns: ReturnType<typeof getColumns>;
  dataSource: ReturnType<typeof getDataSource>;
  addRecord: (newRecord: RecordType) => void;
  deleteRecord: (recordIndex: number) => void;
  updateRecord: (recordIndex: number, newRecord: RecordType) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextConsumer = TableContext.Consumer;

interface TableContextProviderProps {
  tableData: TableDataType;
  children: React.ReactNode;
}

export function TableContextProvider({
  tableData,
  children,
}: TableContextProviderProps) {
  const { schema, records } = tableData;

  const [tableDataState, setTableData] =
    useState<TableDataType["records"]>(records);

  const columns = getColumns(schema);
  const dataSource = getDataSource(tableDataState);

  const addRecord = useCallback(
    (newRecord: RecordType) => {
      const newTableData = [...tableDataState, newRecord];
      setTableData(newTableData);
    },
    [tableDataState]
  );

  const deleteRecord = useCallback(
    (recordIndex: number) => {
      const newTableData = tableDataState.filter(
        (_, index) => index !== recordIndex
      );
      setTableData(newTableData);
    },
    [tableDataState]
  );

  const updateRecord = useCallback(
    (recordIndex: number, newRecord: RecordType) => {
      const newTableData = tableDataState.map((record, index) =>
        index === recordIndex ? newRecord : record
      );
      setTableData(newTableData);
    },
    [tableDataState]
  );

  return (
    <TableContext.Provider
      value={useMemo(
        () => ({ dataSource, columns, addRecord, deleteRecord, updateRecord }),
        [dataSource, columns, addRecord, deleteRecord, updateRecord]
      )}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext() {
  return useContext(TableContext) ?? {};
}
