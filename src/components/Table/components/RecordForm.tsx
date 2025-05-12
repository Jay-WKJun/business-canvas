import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Checkbox, DatePicker, Select, Modal } from "antd";
import dayjs from "dayjs";
import { z } from "zod";

import { useTableContext } from "../context/TableContext";
import { type RecordType } from "../models/Record";
import { Field, type FieldType } from "../models/Field";

const { TextArea } = Input;

interface RecordFormProps {
  visible: boolean;
  recordIndex?: number;
  onClose: () => void;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  visible,
  recordIndex,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { addRecord, updateRecord, getRecord, getSchema } = useTableContext();
  const isEditing = recordIndex != null;
  const [isFormValid, setIsFormValid] = useState(false);

  // 스키마에서 필드 정보 추출
  const fields = useMemo(
    () => (isEditing ? getRecord(recordIndex) : getSchema()),
    [getRecord, recordIndex, getSchema, isEditing]
  );

  useEffect(() => {
    if (visible && isEditing) {
      // 폼 초기값 설정
      const initialValues = fields.reduce((acc, field) => {
        if (!("value" in field)) return acc;

        const value = field.value;
        return {
          ...acc,
          [field.label]: field.type === "date" ? dayjs(value as string) : value,
        };
      }, {});

      form.setFieldsValue(initialValues);
      setIsFormValid(true);
    }

    if (!visible) {
      form.resetFields();
    }

    return () => {
      form.resetFields();
    };
  }, [visible, recordIndex, form, fields, isEditing]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const newRecord: RecordType = fields.map((field) => {
      const value = values[field.label];

      try {
        // zod의 parse 메서드로 검증
        return Field.parse(createNewField(field, value));
      } catch (error) {
        if (!(error instanceof z.ZodError)) throw error;

        form.setFields([
          {
            name: field.label,
            errors: error.errors.map((e) => e.message),
          },
        ]);
        throw new Error(`${field.label} 유효성 검사 실패`);
      }
    });

    if (isEditing) {
      updateRecord(recordIndex, newRecord);
    } else {
      addRecord(newRecord);
    }

    onClose();
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
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          {isEditing ? "수정" : "추가"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {fields.map((field) => {
          const { label, type, required } = field;
          return (
            <Form.Item
              key={label}
              name={label}
              label={label}
              valuePropName={type === "checkbox" ? "checked" : "value"}
              rules={[
                {
                  required,
                  message: `${label}은 필수값입니다.`,
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    try {
                      // Field 스키마로 검증
                      Field.parse(createNewField(field, value));
                      setIsFormValid(true);
                      return Promise.resolve();
                    } catch (error) {
                      setIsFormValid(false);
                      if (error instanceof z.ZodError) {
                        return Promise.reject(error.errors[0].message);
                      }
                      return Promise.reject("유효성 검사 실패");
                    }
                  },
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
      return <TextArea rows={2} placeholder={`${label} 입력`} />;
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

function createNewField(
  field: Omit<FieldType, "value"> & { value?: FieldType["value"] },
  value?: string | boolean | { format: (format: string) => string }
) {
  const isDayValue =
    field.type === "date" && value && typeof value === "object";
  const fieldValue = isDayValue
    ? value.format("YYYY-MM-DD")
    : (value as string | boolean);

  return getDefaultFieldValue({
    ...field,
    value: fieldValue,
  } as FieldType);
}

function getDefaultFieldValue(field: FieldType): FieldType {
  if (field.value) return field;
  if (field.required) return field;

  switch (field.type) {
    case "checkbox":
      return {
        ...field,
        value: false,
      };
    case "date":
      return {
        ...field,
        value: dayjs().format("YYYY-MM-DD"),
      };
    case "select":
    case "text":
    case "textarea":
    default:
      return {
        ...field,
        value: "",
      };
  }
}
