import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useTableContext } from "../context/TableContext";
import { RecordForm } from "./RecordForm";

interface RecordMoreProps {
  recordIndex: number;
}

export const RecordMore: React.FC<RecordMoreProps> = ({ recordIndex }) => {
  const { deleteRecord } = useTableContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "delete") {
      deleteRecord(recordIndex);
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: "edit",
          label: <div style={{ minWidth: 100 }}>수정</div>,
          onClick: () => setIsModalOpen(true),
        },
        { type: "divider" },
        {
          key: "delete",
          label: <div style={{ minWidth: 100 }}>삭제</div>,
          danger: true,
          onClick: () => deleteRecord(recordIndex),
        },
      ]}
      onClick={handleMenuClick}
    />
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <MoreOutlined style={{ cursor: "pointer" }} />
      </Dropdown>

      <RecordForm
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recordIndex={recordIndex}
      />
    </>
  );
};
