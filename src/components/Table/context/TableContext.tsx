import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useStorageService } from "@/hooks/useStorageService";

import { getDataSource, getColumns } from "../utils/fieldToSchema";
import type { TableDataType } from "../models/TableData";
import {
  type RecordType,
  RecordSchema,
  Record as RecordModel,
} from "../models/Record";

const STORAGE_KEY = "tableData";

interface TableContextType {
  columns: ReturnType<typeof getColumns>;
  dataSource: ReturnType<typeof getDataSource>;
  isInitialized: boolean;
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
  schema: initialSchema,
  records: initialRecords = [],
  children,
}: TableContextProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tableData, setTableData] = useState<TableDataType>({
    schema: initialSchema,
    records: initialRecords,
  });
  const { schema, records } = tableData;

  const tableDataValidator = useCallback(
    ({ schema, records }: TableDataType) => {
      try {
        RecordSchema.safeParse(schema);
        RecordModel.safeParse(records);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const { storageService } =
    useStorageService<TableDataType>(tableDataValidator);

  useEffect(() => {
    if (isInitialized || !storageService) return;

    // tableData 초기화
    const data = storageService.get(STORAGE_KEY);
    if (data) {
      try {
        tableDataValidator(data);
        // 저장된 테이블 데이터가 검증되었다면 state와 sync 맞추기
        setTableData(data);
      } catch {
        // 저장된 데이터가 잘못되었다면, initial 데이터로 덮어쓰기
        storageService.set(STORAGE_KEY, tableData);
      }
    } else {
      // 저장된 데이터가 없다면, initial 데이터로 저장
      storageService.set(STORAGE_KEY, tableData);
    }

    setIsInitialized(true);
  }, [storageService, isInitialized, tableData, tableDataValidator]);

  useEffect(() => {
    if (!storageService || !isInitialized) return;

    const timer = setTimeout(() => {
      storageService.set(STORAGE_KEY, tableData);
    }, 500);

    return () => clearTimeout(timer);
  }, [storageService, tableData, isInitialized]);

  const columns = getColumns(schema);
  const dataSource = getDataSource(records);

  const getSchema = useCallback(() => {
    return schema;
  }, [schema]);

  const addRecord = useCallback((newRecord: RecordType) => {
    setTableData((prev) => ({
      ...prev,
      records: [...prev.records, newRecord],
    }));
  }, []);

  const deleteRecord = useCallback((recordIndex: number) => {
    setTableData((prev) => ({
      ...prev,
      records: prev.records.filter((_, index) => index !== recordIndex),
    }));
  }, []);

  const updateRecord = useCallback(
    (recordIndex: number, newRecord: RecordType) => {
      setTableData((prev) => ({
        ...prev,
        records: prev.records.map((record, index) =>
          index === recordIndex ? newRecord : record
        ),
      }));
    },
    []
  );

  const getRecord = useCallback(
    (recordIndex: number): RecordType => {
      return tableData.records[recordIndex];
    },
    [tableData.records]
  );

  return (
    <TableContext.Provider
      value={useMemo(
        () => ({
          dataSource,
          columns,
          addRecord,
          deleteRecord,
          updateRecord,
          getRecord,
          getSchema,
          isInitialized,
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
        ]
      )}
    >
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
