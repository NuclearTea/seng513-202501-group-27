import "./fileList.css";
import { Button, Modal } from "antd";
import appStore from "../../state/app.store.ts";
import { useState } from "react";
import { File } from "../../types.tsx";
import { v4 } from "uuid";

const FileList = () => {
  const files = appStore().files;
  const setSelectedFile = appStore().setSelectedFile;
  const addFile = appStore().addFile;
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleNewFileButton = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [newFileInput, setNewFileInput] = useState("");
  const handleNewFileNameInput: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setNewFileInput(e.target.value);
  };
  const handleNewFileSubmit = () => {
    const newFile: File = {
      content: "",
      id: v4(),
      name: newFileInput,
    };
    addFile(newFile);
  };
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
        onOk={handleNewFileSubmit}
      >
        <div className="modal-content">
          <h2>New File Name</h2>
          <input
            type="text"
            placeholder="Please Enter New File Name"
            required
            name="new-file-name"
            id="new-file-name"
            onChange={handleNewFileNameInput}
          />
        </div>
      </Modal>
    </div>
  );
};

export default FileList;
