import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FilterDropdown } from "./FilterDropdown";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Table/FilterDropdown",
  component: FilterDropdown,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FilterDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    prefixCls: "ant-dropdown-menu",
    filters: [
      { text: "옵션 1", value: "1" },
      { text: "옵션 2", value: "2" },
      { text: "옵션 3", value: "3" },
    ],
    setSelectedKeys: () => {},
    selectedKeys: ["1"],
    confirm: () => {},
    close: () => {},
    visible: true,
  },
  render: function DefaultComponent(args) {
    const [selectedKeys, setSelectedKeys] = useState(args.selectedKeys ?? []);

    return (
      <FilterDropdown
        {...args}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
    );
  },
};

// 불리언 값을 가진 필터
export const BooleanFilters: Story = {
  args: {
    prefixCls: "ant-dropdown-menu",
    filters: [
      { text: "활성화", value: true },
      { text: "비활성화", value: false },
    ],
    setSelectedKeys: () => {},
    selectedKeys: ["true"],
    confirm: () => {},
    close: () => {},
    visible: true,
  },
  render: function BooleanFiltersComponent(args) {
    const [selectedKeys, setSelectedKeys] = useState(args.selectedKeys ?? []);

    return (
      <FilterDropdown
        {...args}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
    );
  },
};
