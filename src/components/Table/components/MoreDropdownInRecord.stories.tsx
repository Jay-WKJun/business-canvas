import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MoreDropdownInRecord } from "./MoreDropdownInRecord";
import {
  TableContextProvider,
  TableContextConsumer,
} from "../context/TableContext";

// 테스트용 스키마
const testSchema = [
  { label: "이름", type: "text" as const, required: true, schemaOrder: 0 },
  { label: "주소", type: "text" as const, required: false, schemaOrder: 1 },
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
  ],
  [
    {
      label: "이름",
      type: "text" as const,
      required: true,
      value: "박영희",
      schemaOrder: 0,
    },
    {
      label: "주소",
      type: "text" as const,
      required: false,
      value: "서울시 강남구",
      schemaOrder: 1,
    },
  ],
];

// MoreDropdownInRecord를 TableContextProvider로 감싸는 래퍼 컴포넌트
const MoreDropdownInRecordWithContext = (
  props: React.ComponentProps<typeof MoreDropdownInRecord>
) => {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>(
    props.recordIndex
  );

  useEffect(() => {
    setSelectedRecordIndex(props.recordIndex);
  }, [props.recordIndex]);

  return (
    <TableContextProvider schema={testSchema} records={testRecords}>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>
          이 아래 버튼을 눌러주세요 / 선택된 레코드: {selectedRecordIndex}
        </h2>
        <div
          style={{
            width: "fit-content",
            marginBottom: "30px",
            border: "1px solid black",
            borderRadius: 8,
            padding: 30,
          }}
        >
          <MoreDropdownInRecord {...props} />
        </div>
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
  title: "Table/MoreDropdownInRecord",
  component: MoreDropdownInRecordWithContext,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    recordIndex: { control: "number", description: "레코드 인덱스" },
  },
} satisfies Meta<typeof MoreDropdownInRecordWithContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRecord: Story = {
  parameters: {
    docs: {
      description: {
        story: `
          이 컴포넌트는 테이블의 각 행에서 '수정'과 '삭제' 기능을 제공하는 드롭다운 메뉴입니다.
          '수정' 버튼을 클릭하면 RecordForm 모달이 열리고, '삭제' 버튼을 클릭하면 해당 레코드가 삭제됩니다.
          이 컴포넌트는 TableContext를 사용하여 레코드 데이터에 접근합니다.
        `,
      },
    },
  },
  args: {
    recordIndex: 0,
  },
  render: function FirstRecordComponent(args) {
    return <MoreDropdownInRecordWithContext {...args} />;
  },
};
