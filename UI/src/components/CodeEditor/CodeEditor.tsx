import {
  DownloadOutlined,
  FileAddOutlined,
  PlaySquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { buildMenuItemsFromFiles } from "../../LayoutFunction";
import appStore from "../../state/app.store";
import FileEditor from "../FileEditor/FileEditor";
import AddFileModal from "../AddFileModal/AddFileModal";
import { useGreeter } from "../../hooks/useGreeter";

const CodeEditor = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { getFileByPath, setSelectedFile, selectedFile, files } = appStore();
  const { sayHello, reply, error, loading } = useGreeter();
  const menuItems = buildMenuItemsFromFiles(files);

  const handleMenuItemClick: MenuProps["onClick"] = (e) => {
    if (!e) return;
    const filePath = String(e.key).toLowerCase();
    console.log(filePath);
    const file = getFileByPath(filePath);
    if (!file) {
      messageApi.error(`Something went wrong accessing: ${e.key}`);
      return;
    }
    setSelectedFile(file);
  };

  const handleNewFileButton = () => {
    setShowModal(true);
  };

  const handleRunButton = () => {
    sayHello("Ali");
  };

  useEffect(() => {
    if (loading) {
      messageApi.loading("Uploading Files", 2.5);
      return;
    }
    if (error) {
      messageApi.error("Something went wrong");
      return;
    }
    if (!loading && !error && reply) {
      messageApi.destroy();
      messageApi.success(reply);
    }
  }, [error, loading, reply, messageApi]);

  const items1: MenuProps["items"] = [
    { key: "1", label: "README.md" },
    { key: "2", label: "index.js" },
  ];
  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vh" }}>
      {contextHolder}
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: "13.5vw" }} />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(e) => console.log(e)}
        />
        <Button
          onClick={handleRunButton}
          style={{ background: "green", padding: "1rem 2rem" }}
          icon={<PlaySquareOutlined />}
          type="primary"
          size="large"
        />
      </Header>
      <Layout>
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
          <AddFileModal showModal={showModal} setShowModal={setShowModal} />
        </Sider>
        <Layout>
          <Content style={{ width: "100%", height: "100%" }}>
            {selectedFile ? <FileEditor /> : <></>}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CodeEditor;
