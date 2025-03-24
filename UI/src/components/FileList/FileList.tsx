import "./fileList.css";
import { Button, Modal } from "antd";
import appStore from "../../state/app.store.ts";
import { useState } from "react";

const FileList = () => {
  const files = appStore().files;
  const setSelectedFile = appStore().setSelectedFile;
  // const addFile = appStore().addFile;
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleNewFileButton = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
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
      <Modal
        open={showModal}
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        destroyOnClose
      >
        <h1>New File Name</h1>
      </Modal>
    </div>
  );
};

export default FileList;
