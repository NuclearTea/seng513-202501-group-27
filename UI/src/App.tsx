import {
  DownloadOutlined,
  FileOutlined,
  FolderOutlined,
  PlaySquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import React, { useState } from "react";
import FileEditor from "./components/FileEditor/FileEditor.tsx";
import AddFileModal from "./components/FileList/AddFileModal/AddFileModal.tsx";
import { getItem, MenuItem } from "./LayoutFunction.tsx";
import appStore from "./state/app.store.ts";

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { getFileByPath, setSelectedFile, selectedFile } = appStore();

  // const menuItems = buildMenuItems(files);
  const menuItems: MenuItem[] = [
    getItem("src", "src", <FolderOutlined />, [
      getItem("index.js", "src/index.js", <FileOutlined />),
      getItem("App.js", "src/App.js", <FileOutlined />),
      getItem("styles.css", "src/styles.css", <FileOutlined />),
    ]),
    getItem("README.md", "README.md", <FileOutlined />),
  ];

  const handleMenuItemClick = (e) => {
    if (!e) return;
    const file = getFileByPath(String(e.key));
    if (!file) return;
    setSelectedFile(file);
  };

  const handleNewFileButton = (e) => {
    setShowModal(true);
  };
  const items1: MenuProps["items"] = [
    { key: "1", label: "README.md" },
    { key: "2", label: "index.js" },
  ];
  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: "13.5vw" }} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
          onClick={(e) => console.log(e)}
        />
        <Button
          style={{ background: "green", width: "3rem" }}
          icon={<PlaySquareOutlined />}
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
              // marginLeft: "10%",
              marginBottom: "10%",
            }}
          >
            <Button
              style={{ width: "40%", backgroundColor: "var(--smokey-black)" }}
              icon={<UploadOutlined />}
            />
            <Button
              style={{ width: "40%", backgroundColor: "var(--dun)" }}
              icon={<DownloadOutlined />}
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
          >
            <h3>New File</h3>
          </Button>
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

export default App;
