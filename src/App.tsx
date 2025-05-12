import type { Field } from "./components/Table";
import { Table } from "./components/Table";

const record: Field[] = [
  { type: "text", label: "이름", required: true, value: "John Doe" },
  {
    type: "text",
    label: "주소",
    required: true,
    value: "서울 강남구",
  },
  { type: "text", label: "메모", required: true, value: "외국인" },
  {
    type: "date",
    label: "가입일",
    required: true,
    value: "2024-10-02",
  },
  { type: "text", label: "직업", required: true, value: "개발자" },
  {
    type: "checkbox",
    label: "이메일 수신 동의",
    required: true,
    value: true,
  },
];

const record2: Field[] = [
  { type: "text", label: "이름", required: true, value: "Foo Bar" },
  {
    type: "text",
    label: "주소",
    required: true,
    value: "서울 서초구",
  },
  { type: "text", label: "메모", required: true, value: "한국인" },
  {
    type: "date",
    label: "가입일",
    required: true,
    value: "2024-10-01",
  },
  { type: "text", label: "직업", required: true, value: "PO" },
  {
    type: "checkbox",
    label: "이메일 수신 동의",
    required: true,
    value: false,
  },
];

export function App() {
  return (
    <Table
      records={[record, record2]}
      onSelectionChange={(selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);
      }}
    />
  );
}
