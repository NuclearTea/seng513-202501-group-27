import {
  DockerOutlined,
  DownloadOutlined,
  FileAddOutlined,
  InfoCircleTwoTone,
  PlaySquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useFileService } from "../../hooks/useFileService";
import { buildMenuItemsFromFiles } from "../../LayoutFunction";
import appStore from "../../state/app.store";
import { buildDirectoryTree } from "../../utility/flatFilesToProtoDirectory";
import AddFileModal from "../AddFileModal/AddFileModal";
import FileEditor from "../FileEditor/FileEditor";
import UploadStatusModal from "../UploadStatusModal/UploadStatusModal";
import DockerLogsViewer from "../DockerLogsViewer/DockerLogsViewer";
import appNameFromURL from "../../utility/appNameFromURL";

const CodeEditor = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showUploadStatusModal, setShowUploadStatusModal] = useState(false);
  const [showDockerLogsModal, setShowDockerLogsModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    getFileByPath,
    setSelectedFile,
    selectedFile,
    files,
    selectedBackend,
  } = appStore();

  const { uploadProject, error, link, loading, statusMessages } =
    useFileService();
  const containerId = appNameFromURL(link);

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
    setShowAddFileModal(true);
  };

  const handleRunButton = () => {
    const asDir = buildDirectoryTree(files);
    uploadProject(asDir, selectedBackend);
    setShowUploadStatusModal(true);
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
          onClick={() => setShowDockerLogsModal(true)}
          icon={<DockerOutlined />}
          type="primary"
          size="large"
          style={{
            background: "#002F5C",
            padding: "1rem 2rem",
            marginRight: "1rem",
          }}
        />
        <Button
          onClick={() => setShowUploadStatusModal(true)}
          icon={<InfoCircleTwoTone />}
          type="primary"
          size="large"
          style={{
            background: "#002F5C",
            padding: "1rem 2rem",
            marginRight: "1rem",
          }}
          disabled={!(error || link || statusMessages.length || link)}
        />
        <Button
          onClick={handleRunButton}
          style={{ background: "green", padding: "1rem 2rem" }}
          icon={<PlaySquareOutlined />}
          type="primary"
          size="large"
          disabled={link !== null}
          loading={loading}
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
          <AddFileModal
            showModal={showAddFileModal}
            setShowModal={setShowAddFileModal}
          />
        </Sider>
        <Layout>
          <Content style={{ width: "100%", height: "100%" }}>
            {selectedFile ? <FileEditor /> : <></>}
          </Content>
        </Layout>
      </Layout>
      <DockerLogsViewer
        containerId={containerId || ""}
        open={showDockerLogsModal && containerId !== null}
        onClose={() => setShowDockerLogsModal(false)}
      />
      <UploadStatusModal
        onClose={() => setShowUploadStatusModal(false)}
        open={showUploadStatusModal}
        error={error}
        link={link}
        loading={loading}
        statusMessages={statusMessages}
      />
    </Layout>
  );
};

export default CodeEditor;
