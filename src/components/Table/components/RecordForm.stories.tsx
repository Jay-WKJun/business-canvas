import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { RecordForm } from "./RecordForm";
import {
  TableContextProvider,
  TableContextConsumer,
} from "../context/TableContext";

// 테스트용 스키마
const testSchema = [
  { label: "이름", type: "text" as const, required: true, schemaOrder: 0 },
  { label: "주소", type: "text" as const, required: false, schemaOrder: 1 },
  { label: "메모", type: "textarea" as const, required: false, schemaOrder: 2 },
  { label: "가입일", type: "date" as const, required: true, schemaOrder: 3 },
  { label: "직업", type: "select" as const, required: false, schemaOrder: 4 },
  {
    label: "이메일 수신 동의",
    type: "checkbox" as const,
    required: false,
    schemaOrder: 5,
  },
];

// 테스트용 레코드
const testRecords = [
  [
    {
      label: "이름",
      type: "text" as const,
      required: true,
      value: "홍길동",
      schemaOrder: 0,
    },
    {
      label: "주소",
      type: "text" as const,
      required: false,
      value: "서울시 강남구",
      schemaOrder: 1,
    },
    {
      label: "메모",
      type: "textarea" as const,
      required: false,
      value: "테스트 메모입니다.",
      schemaOrder: 2,
    },
    {
      label: "가입일",
      type: "date" as const,
      required: true,
      value: "2023-01-01",
      schemaOrder: 3,
    },
    {
      label: "직업",
      type: "select" as const,
      required: false,
      value: "개발자",
      schemaOrder: 4,
    },
    {
      label: "이메일 수신 동의",
      type: "checkbox" as const,
      required: false,
      value: true,
      schemaOrder: 5,
    },
  ],
  [
    {
      label: "이름",
      type: "text" as const,
      required: true,
      value: "김철수",
      schemaOrder: 0,
    },
    {
      label: "주소",
      type: "text" as const,
      required: false,
      value: "서울시 서초구",
      schemaOrder: 1,
    },
    {
      label: "메모",
      type: "textarea" as const,
      required: false,
      value: "두 번째 테스트 메모",
      schemaOrder: 2,
    },
    {
      label: "가입일",
      type: "date" as const,
      required: true,
      value: "2023-02-15",
      schemaOrder: 3,
    },
    {
      label: "직업",
      type: "select" as const,
      required: false,
      value: "PM",
      schemaOrder: 4,
    },
    {
      label: "이메일 수신 동의",
      type: "checkbox" as const,
      required: false,
      value: false,
      schemaOrder: 5,
    },
  ],
];

// RecordForm을 TableContextProvider로 감싸는 래퍼 컴포넌트
const RecordFormWithContext = (
  props: React.ComponentProps<typeof RecordForm>
) => {
  const [visible, setVisible] = useState(props.visible);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>();

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    setSelectedRecordIndex(props.recordIndex);
  }, [props.recordIndex]);

  return (
    <TableContextProvider schema={testSchema} records={testRecords}>
      <RecordForm
        {...props}
        visible={visible}
        recordIndex={selectedRecordIndex}
        onClose={() => setVisible(false)}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Button
          style={{ width: 100 }}
          onClick={() => {
            setVisible((prev) => !prev);
            setSelectedRecordIndex(undefined);
          }}
        >
          {visible ? "닫기" : "열기"}
        </Button>
        <TableContextConsumer>
          {(tableContext) => {
            const { dataSource } = tableContext!;
            return (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  maxWidth: "80%",
                }}
              >
                {dataSource.map((record) => (
                  <div
                    key={record.key}
                    style={{
                      width: 200,
                      border: "1px solid black",
                      padding: 8,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRecordIndex(Number(record.index));
                      setVisible(true);
                    }}
                  >
                    {Object.entries(record).map(([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }}
        </TableContextConsumer>
      </div>
    </TableContextProvider>
  );
};

const meta = {
  title: "Table/RecordForm",
  component: RecordFormWithContext,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    visible: { control: "boolean" },
    recordIndex: { control: "number" },
    onClose: { action: "닫기 버튼 클릭" },
  },
} satisfies Meta<typeof RecordFormWithContext>;

export default meta;
type Story = StoryObj<typeof meta>;

// 새 레코드 추가 폼
export const AddNewRecord: Story = {
  args: {
    visible: false,
    onClose: fn(),
  },
  render: function AddNewRecordComponent(args) {
    return <RecordFormWithContext {...args} />;
  },
};
