import {
  DockerOutlined,
  DownloadOutlined,
  FileAddOutlined,
  InfoCircleTwoTone,
  PlaySquareOutlined,
  RedoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { useDockerService } from "../../hooks/useDockerService";
import { buildMenuItemsFromFiles } from "../../LayoutFunction";
import appStore from "../../state/app.store";
import appSlugFromURL from "../../utility/appNameFromURL";
import { buildDirectoryTree } from "../../utility/flatFilesToProtoDirectory";
import AddFileModal from "../AddFileModal/AddFileModal";
import DockerLogsViewer from "../DockerLogsViewer/DockerLogsViewer";
import FileEditor from "../FileEditor/FileEditor";
import UploadStatusModal from "../UploadStatusModal/UploadStatusModal";
import CodeEditorMenu from "./CodeEditorMenu";

const CodeEditor = () => {
  const [showUploadStatusModal, setShowUploadStatusModal] = useState(false);
  const [showDockerLogsModal, setShowDockerLogsModal] = useState(false);
  const { selectedFile, files, selectedBackend } = appStore();

  const {
    redeployProject,
    uploadProject,
    error,
    link,
    loading,
    statusMessages,
  } = useDockerService();
  const [hasUploaded, setHasUploaded] = useState(Boolean(link));
  const appSlug = appSlugFromURL(link);

  const handleRunButton = () => {
    const asDir = buildDirectoryTree(files);
    uploadProject(asDir, selectedBackend);
    setShowUploadStatusModal(true);

    setHasUploaded(true);
  };

  const handleRedeployButton = () => {
    const asDir = buildDirectoryTree(files);
    if (appSlug) {
      redeployProject(appSlug, asDir, selectedBackend);
      setShowUploadStatusModal(true);
      return;
    }
    message.error("error getting app slug on redeploy");
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
          onClick={hasUploaded ? handleRedeployButton : handleRunButton}
          style={{ background: "green", padding: "1rem 2rem" }}
          icon={hasUploaded ? <RedoOutlined /> : <PlaySquareOutlined />}
          type="primary"
          size="large"
          loading={loading}
        />
      </Header>
      <Layout>
        <CodeEditorMenu />
        <Layout>
          <Content style={{ width: "100%", height: "100%" }}>
            {selectedFile ? <FileEditor /> : <></>}
          </Content>
        </Layout>
      </Layout>
      <DockerLogsViewer
        containerId={appSlug || ""}
        open={showDockerLogsModal && appSlug !== null}
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
