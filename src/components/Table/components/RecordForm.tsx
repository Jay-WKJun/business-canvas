import React, { useEffect, useMemo } from "react";
import { Form, Input, Button, Checkbox, DatePicker, Select, Modal } from "antd";
import dayjs from "dayjs";

import { useTableContext } from "../context/TableContext";
import { type RecordType } from "../models/Record";
import { type FieldType } from "../models/Field";

const { TextArea } = Input;

interface RecordFormProps {
  visible: boolean;
  onClose: () => void;
  recordIndex?: number;
}

// TODO: text의 경우 20자 넘으면 안됨, textarea의 경우 50자 넘으면 안됨, validate 넣기
export const RecordForm: React.FC<RecordFormProps> = ({
  visible,
  onClose,
  recordIndex,
}) => {
  const [form] = Form.useForm();
  const { addRecord, updateRecord, getRecord, getSchema } = useTableContext();
  const isEditing = recordIndex !== undefined;

  const fields = useMemo(
    () => (recordIndex != null ? getRecord(recordIndex) : getSchema()),
    [getRecord, recordIndex, getSchema]
  );

  useEffect(() => {
    if (visible && isEditing && recordIndex !== undefined) {
      form.setFieldsValue(
        fields.reduce(
          (acc, { type, label, value }) => ({
            ...acc,
            [label]: type === "date" ? dayjs(value) : value,
          }),
          {}
        )
      );
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, recordIndex, form, fields, isEditing]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newRecord: RecordType = fields.map((field) => {
        let value = values[field.label];

        if (field.type === "date" && value) {
          value = value.format("YYYY-MM-DD");
        }

        return {
          ...field,
          value:
            value !== undefined
              ? value
              : field.type === "checkbox"
              ? false
              : "",
        };
      });

      if (isEditing && recordIndex !== undefined) {
        updateRecord(recordIndex, newRecord);
      } else {
        addRecord(newRecord);
      }

      onClose();
    });
  };

  return (
    <Modal
      title={"회원 추가"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? "수정" : "추가"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {fields.map(({ label, type, required }) => {
          return (
            <Form.Item
              key={label}
              name={label}
              label={label}
              valuePropName={type === "checkbox" ? "checked" : "value"}
              rules={[
                {
                  required,
                  message: `${label}을(를) 입력해주세요.`,
                },
              ]}
            >
              {renderFormField(type, label)}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

// 필드 타입에 따른 입력 컴포넌트 렌더링
function renderFormField(type: FieldType["type"], label: string) {
  switch (type) {
    case "checkbox":
      return <Checkbox />;
    case "textarea":
      return <TextArea rows={4} placeholder={`${label} 입력`} />;
    case "date":
      return <DatePicker style={{ width: "100%" }} />;
    case "select":
      return (
        <Select placeholder={`${label} 선택`}>
          <Select.Option value="개발자">개발자</Select.Option>
          <Select.Option value="디자이너">디자이너</Select.Option>
          <Select.Option value="PM">PM</Select.Option>
          <Select.Option value="PO">PO</Select.Option>
        </Select>
      );
    default:
      return <Input placeholder={`${label} 입력`} />;
  }
}
