import {
  PlaySquareOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, MenuProps, message, theme } from "antd";
import { Header, Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import FileEditor from "../FileEditor/FileEditor";
import AddFileModal from "../FileList/AddFileModal/AddFileModal";
import { useState } from "react";
import { MenuItem, getItem } from "../../LayoutFunction";
import appStore from "../../state/app.store";

const CodeEditor = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
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

  const handleRunButton = () => {
    messageApi.loading("Uploading Files", 2.5, () =>
      messageApi.success("Your Api is running at http://someSite1329824.host"),
    );
  };

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

export default CodeEditor;
