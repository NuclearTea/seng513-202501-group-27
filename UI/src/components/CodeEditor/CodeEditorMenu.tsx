import {
  DownloadOutlined,
  FileAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Menu, MenuProps, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { buildMenuItemsFromFiles } from "../../LayoutFunction";
import appStore from "../../state/app.store";
import AddFileModal from "../AddFileModal/AddFileModal";

const CodeEditorMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const { files, setSelectedFile, getFileByPath } = appStore();

  const menuItems = buildMenuItemsFromFiles(files);

  const handleMenuItemClick: MenuProps["onClick"] = (e) => {
    if (!e) return;
    const filePath = String(e.key).toLowerCase();
    console.log(filePath);
    const file = getFileByPath(filePath);
    if (!file) {
      message.error(`Something went wrong accessing: ${e.key}`);
      return;
    }
    setSelectedFile(file);
  };

  const handleNewFileButton = () => {
    setShowAddFileModal(true);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: "10%",
        }}
      >
        <Button
          style={{ width: "40%", backgroundColor: "var(--gray)" }}
          icon={<UploadOutlined />}
          type="primary"
        />
        <Button
          style={{ width: "40%", backgroundColor: "var(--dun)" }}
          icon={<DownloadOutlined style={{ color: "black" }} />}
          type="primary"
        />
      </div>
      <Button
        style={{
          width: "80%",
          marginLeft: "10%",
          marginBottom: "10%",
          backgroundColor: "var(--anti-flash-white)",
        }}
        onClick={handleNewFileButton}
        icon={<FileAddOutlined />}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={menuItems}
        onClick={handleMenuItemClick}
      />
      <AddFileModal
        showModal={showAddFileModal}
        setShowModal={setShowAddFileModal}
      />
    </Sider>
  );
};
export default CodeEditorMenu;
