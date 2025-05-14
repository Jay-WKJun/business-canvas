import {
  textFieldTestData,
  checkboxFieldTestData,
  dateFieldTestData,
  selectFieldTestData,
  textareaFieldTestData,
} from "./mockFields";

// 단일 필드 테스트 데이터를 활용하여 테스트 레코드 생성
export const testRecord = [
  // 기존 textFieldTestData 활용
  textFieldTestData,

  // 두 번째 텍스트 필드 추가
  {
    ...textFieldTestData,
    label: "Description",
    schemaOrder: 2,
    value: "Short description",
  },

  // 체크박스 필드 활용
  {
    ...checkboxFieldTestData,
    schemaOrder: 3,
    required: false,
  },

  // 날짜 필드 활용
  {
    ...dateFieldTestData,
    schemaOrder: 4,
  },

  // 선택 필드 활용
  {
    ...selectFieldTestData,
    schemaOrder: 5,
  },

  // 두 번째 선택 필드 추가
  {
    ...selectFieldTestData,
    label: "Nationality",
    schemaOrder: 6,
    value: "Korean",
  },

  // 텍스트영역 필드 활용
  {
    ...textareaFieldTestData,
    schemaOrder: 7,
    required: false,
    value: "Hello, I am John Doe.",
  },
];

export const testRecord2 = [
  {
    type: "text",
    label: "제품명",
    required: true,
    schemaOrder: 1,
    value: "스마트폰 XYZ-2000",
  },
  {
    type: "textarea",
    label: "제품 설명",
    required: true,
    schemaOrder: 2,
    value: "최신 기술이 탑재된 스마트폰입니다.",
  },
  {
    type: "select",
    label: "카테고리",
    required: true,
    schemaOrder: 3,
    value: "전자기기",
  },
  {
    type: "select",
    label: "제품 상태",
    required: true,
    schemaOrder: 4,
    value: "판매중",
  },
  {
    type: "checkbox",
    label: "재고 있음",
    required: false,
    schemaOrder: 5,
    value: true,
  },
  {
    type: "date",
    label: "출시일",
    required: true,
    schemaOrder: 6,
    value: "2023-05-15",
  },
  {
    type: "text",
    label: "제품 가격",
    required: true,
    schemaOrder: 7,
    value: "1000000",
  },
];
