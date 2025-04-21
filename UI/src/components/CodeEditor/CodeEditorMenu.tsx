import { FileAddOutlined } from "@ant-design/icons";
import { Divider, Menu, MenuProps, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { buildMenuItemsFromFiles } from "../../LayoutFunction";
import appStore from "../../state/app.store";
import AddFileModal from "../AddFileModal/AddFileModal";
import DownloadFilesButton from "./DownloadFilesButton";

const CodeEditorMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const { files, setSelectedFile, getFileByPath, addOpenFile } = appStore();

  const menuItems = buildMenuItemsFromFiles(files);

  const handleMenuItemClick: MenuProps["onClick"] = (e) => {
    if (!e) return;
    const filePath = String(e.key).toLowerCase();
    const file = getFileByPath(filePath);
    if (!file) {
      message.error(`Something went wrong accessing: ${e.key}`);
      return;
    }
    setSelectedFile(file);
    addOpenFile(file.getId());
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
          marginBottom: "5%",
          alignItems: "center",
        }}
      >
        <DownloadFilesButton />
        <FileAddOutlined
          style={{
            fontSize: "32px",
          }}
          onClick={handleNewFileButton}
        />
      </div>
      <Divider type="horizontal" style={{ borderColor: "#1ECBE1" }} />
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
