import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import appStore from "../../state/app.store";
import { File } from "../../proto/filetree/filetree_pb";

/**
 * Converts proto File[] into a zip and downloads it
 * maintaining directory structure.
 */
const downloadZip = async (files: File[], zipName = "project.zip") => {
  const zip = new JSZip();

  for (const file of files) {
    const pathList = file.getPathList(); // e.g., ["src"]
    const filePath = [...pathList, file.getName()].join("/"); // e.g., "src/index.js"
    zip.file(filePath, file.getContent());
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
};

const DownloadFilesButton = () => {
  const { files } = appStore();
  const handleOnClick = () => {
    downloadZip(files);
  };
  return (
    <Button
      style={{ width: "40%", backgroundColor: "var(--dun)" }}
      icon={<DownloadOutlined style={{ color: "black" }} />}
      type="primary"
      onClick={handleOnClick}
    />
  );
};

export default DownloadFilesButton;
