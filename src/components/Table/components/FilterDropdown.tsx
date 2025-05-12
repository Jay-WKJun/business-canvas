import { Checkbox, Menu, Typography } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

export function FilterDropdown(props: FilterDropdownProps) {
  const filters = props.filters ?? [];
  const { setSelectedKeys, selectedKeys, confirm } = props;

  return (
    <Menu
      items={filters.map((filter) => {
        const filterText = getFilterText(filter);
        const isSelected = selectedKeys.includes(String(filter.value));

        return {
          key: String(filter.value),
          label: (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                minWidth: 100,
              }}
              onClick={() => {
                setSelectedKeys(
                  isSelected
                    ? selectedKeys.filter((key) => key !== String(filter.value))
                    : [...selectedKeys, String(filter.value)]
                );
                confirm();
              }}
            >
              <Checkbox checked={isSelected} />
              <Typography>{filterText}</Typography>
            </div>
          ),
        };
      })}
    />
  );
}

function getFilterText(
  filter: NonNullable<FilterDropdownProps["filters"]>[number]
) {
  if (typeof filter.value !== "boolean") return filter.text;

  if (filter.value) return "선택됨";
  return "선택 안함";
}
