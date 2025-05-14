import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useStorageService } from "@/hooks/useStorageService";

import { getDataSource, getColumns } from "../utils/fieldToSchema";
import { TableData, type TableDataType } from "../models/TableData";
import { type RecordType, RecordSchema } from "../models/Record";

const STORAGE_KEY = "tableData";

interface TableContextType {
  columns: ReturnType<typeof getColumns>;
  dataSource: ReturnType<typeof getDataSource>;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  addRecord: (newRecord: RecordType) => void;
  deleteRecord: (recordIndex: number) => void;
  updateRecord: (recordIndex: number, newRecord: RecordType) => void;
  getRecord: (recordIndex: number) => RecordType;
  getSchema: () => TableDataType["schema"];
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextConsumer = TableContext.Consumer;

export interface TableContextProviderProps {
  schema: TableDataType["schema"];
  records?: TableDataType["records"];
  children: React.ReactNode;
}

export function TableContextProvider({
  schema: _initialSchema,
  records: initialRecords = [],
  children,
}: TableContextProviderProps) {
  const initialSchema = useMemo(
    () => RecordSchema.parse(_initialSchema),
    [_initialSchema]
  );

  const {
    data: tableData,
    setData: setTableData,
    isInitialized,
    isLoading,
    error,
  } = useStorageService<TableDataType>({
    key: STORAGE_KEY,
    initialData: {
      schema: initialSchema,
      records: initialRecords,
    },
    validator: useCallback((tableData: TableDataType) => {
      try {
        TableData.parse(tableData);
        return true;
      } catch {
        return false;
      }
    }, []),
  });

  const { schema, records } = tableData;
  const columns = getColumns(schema);
  const dataSource = getDataSource(records);

  const getSchema = useCallback(() => {
    return schema;
  }, [schema]);

  const addRecord = useCallback(
    (newRecord: RecordType) => {
      setTableData((prev) => ({
        ...prev,
        records: [...prev.records, newRecord],
      }));
    },
    [setTableData]
  );

  const deleteRecord = useCallback(
    (recordIndex: number) => {
      setTableData((prev) => ({
        ...prev,
        records: prev.records.filter((_, index) => index !== recordIndex),
      }));
    },
    [setTableData]
  );

  const updateRecord = useCallback(
    (recordIndex: number, newRecord: RecordType) => {
      setTableData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === recordIndex ? newRecord : record
        ),
      }));
    },
    [setTableData]
  );

  const getRecord = useCallback(
    (recordIndex: number): RecordType => {
      return records[recordIndex];
    },
    [records]
  );

  const contextValue = useMemo(
    () => ({
      dataSource,
      columns,
      addRecord,
      deleteRecord,
      updateRecord,
      getRecord,
      getSchema,
      isInitialized,
      isLoading,
      error,
    }),
    [
      dataSource,
      columns,
      addRecord,
      deleteRecord,
      updateRecord,
      getRecord,
      getSchema,
      isInitialized,
      isLoading,
      error,
    ]
  );

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error(
      "useTableContext must be used within a TableContextProvider"
    );
  }
  return context;
}
