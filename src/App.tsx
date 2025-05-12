import { Table } from "./components/Table";
import type { TableDataType } from "./components/Table/models/TableData";

// 필드 스키마 정의
const schema = [
  { type: "text" as const, label: "이름", required: true, schemaOrder: 0 },
  { type: "text" as const, label: "주소", required: false, schemaOrder: 1 },
  { type: "textarea" as const, label: "메모", required: false, schemaOrder: 2 },
  { type: "date" as const, label: "가입일", required: true, schemaOrder: 3 },
  { type: "select" as const, label: "직업", required: false, schemaOrder: 4 },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    schemaOrder: 5,
  },
];

// 레코드 데이터
const record1 = [
  {
    type: "text" as const,
    label: "이름",
    required: true,
    value: "John Doe",
    schemaOrder: 0,
  },
  {
    type: "text" as const,
    label: "주소",
    required: false,
    value: "서울 강남구",
    schemaOrder: 1,
  },
  {
    type: "textarea" as const,
    label: "메모",
    required: false,
    value: "외국인",
    schemaOrder: 2,
  },
  {
    type: "date" as const,
    label: "가입일",
    required: true,
    value: "2024-10-02",
    schemaOrder: 3,
  },
  {
    type: "select" as const,
    label: "직업",
    required: false,
    value: "개발자",
    schemaOrder: 4,
  },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    value: true,
    schemaOrder: 5,
  },
];

const record2 = [
  {
    type: "text" as const,
    label: "이름",
    required: true,
    value: "Foo Bar",
    schemaOrder: 0,
  },
  {
    type: "text" as const,
    label: "주소",
    required: false,
    value: "서울 서초구",
    schemaOrder: 1,
  },
  {
    type: "textarea" as const,
    label: "메모",
    required: false,
    value: "한국인",
    schemaOrder: 2,
  },
  {
    type: "date" as const,
    label: "가입일",
    required: true,
    value: "2024-10-01",
    schemaOrder: 3,
  },
  {
    type: "select" as const,
    label: "직업",
    required: false,
    value: "PO",
    schemaOrder: 4,
  },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    value: false,
    schemaOrder: 5,
  },
];

// 테이블 데이터
const tableData: TableDataType = {
  schema,
  records: [record1, record2],
};

export function App() {
  return (
    <Table
      tableData={tableData}
      onSelectionChange={(selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);
      }}
    />
  );
}
