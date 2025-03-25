import "./fileList.css";
import { Button } from "antd";
import appStore from "../../state/app.store.ts";
import { useState } from "react";
import AddFileModal from "./AddFileModal/AddFileModal.tsx";

const FileList = () => {
  const files = appStore().files;
  const setSelectedFile = appStore().setSelectedFile;
  const [showModal, setShowModal] = useState(false);
  const handleNewFileButton = () => setShowModal(true);

  if (files.length === 0) {
    return <div>No Files, Add One!</div>;
  }

  return (
    <div className="file-list-container">
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} onClick={() => setSelectedFile(file)}>
            {file.name}
          </li>
        ))}
      </ul>
      <Button type="primary" onClick={handleNewFileButton}>
        New File
      </Button>
      <AddFileModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default FileList;
