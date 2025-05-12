import { Table } from "./components/Table";
import type { TableDataType } from "./components/Table/models/TableData";

// 필드 스키마 정의
const schema = [
  { type: "text" as const, label: "이름", required: true, index: 0 },
  { type: "text" as const, label: "주소", required: false, index: 1 },
  { type: "textarea" as const, label: "메모", required: false, index: 2 },
  { type: "date" as const, label: "가입일", required: true, index: 3 },
  { type: "select" as const, label: "직업", required: false, index: 4 },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    index: 5,
  },
];

// 레코드 데이터
const record1 = [
  {
    type: "text" as const,
    label: "이름",
    required: true,
    value: "John Doe",
    index: 0,
  },
  {
    type: "text" as const,
    label: "주소",
    required: false,
    value: "서울 강남구",
    index: 1,
  },
  {
    type: "textarea" as const,
    label: "메모",
    required: false,
    value: "외국인",
    index: 2,
  },
  {
    type: "date" as const,
    label: "가입일",
    required: true,
    value: "2024-10-02",
    index: 3,
  },
  {
    type: "select" as const,
    label: "직업",
    required: false,
    value: "개발자",
    index: 4,
  },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    value: true,
    index: 5,
  },
];

const record2 = [
  {
    type: "text" as const,
    label: "이름",
    required: true,
    value: "Foo Bar",
    index: 0,
  },
  {
    type: "text" as const,
    label: "주소",
    required: false,
    value: "서울 서초구",
    index: 1,
  },
  {
    type: "textarea" as const,
    label: "메모",
    required: false,
    value: "한국인",
    index: 2,
  },
  {
    type: "date" as const,
    label: "가입일",
    required: true,
    value: "2024-10-01",
    index: 3,
  },
  {
    type: "select" as const,
    label: "직업",
    required: false,
    value: "PO",
    index: 4,
  },
  {
    type: "checkbox" as const,
    label: "이메일 수신 동의",
    required: false,
    value: false,
    index: 5,
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
