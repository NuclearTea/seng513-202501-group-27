import { Modal } from "antd";
import React, { useState } from "react";
import { v4 } from "uuid";
import appStore from "../../state/app.store.ts";
import { File } from "../../types";

const validateFileName = (fileName: string): boolean => {
  if (!fileName.trim()) {
    return false;
  }

  const invalidChars = /[<>:"\\|?*\p{C}]/u;
  if (invalidChars.test(fileName)) {
    return false;
  }

  const reservedNames = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "LPT1",
    "LPT2",
    "LPT3",
  ];
  if (reservedNames.includes(fileName.toUpperCase())) {
    return false;
  }

  // // Check if the file name has a valid extension (optional)
  // const validExtensions = ["txt", "md", "js", "html", "css"]; // Modify with valid extensions for your use case
  // const extension = fileName.split(".").pop()?.toLowerCase();
  // if (extension && !validExtensions.includes(extension)) {
  //   return false;
  // }
  //
  // If all checks pass, the file name is valid
  return true;
};

type AddFileModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddFileModal: (val: AddFileModalProps) => React.ReactNode = ({
  showModal,
  setShowModal,
}) => {
  const addFile = appStore().addFile;
  const handleCloseModal = () => setShowModal(false);
  const [newFileInput, setNewFileInput] = useState("");
  const handleNewFileNameInput: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setNewFileInput(e.target.value);
  };

  const handleNewFileSubmit = () => {
    if (!validateFileName(newFileInput)) {
      alert("Invalid file name, please try again");
      return;
    }
    const nameSplit = newFileInput.split("/");

    const path = nameSplit.length === 0 ? [] : nameSplit.slice(0, -1);
    const name = nameSplit.length === 0 ? newFileInput : nameSplit.slice(-1)[0];
    const newFile: File = {
      content: "",
      id: v4(),
      name,
      path,
    };
    addFile(newFile);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!newFileInput.length) return;
    if (e.key === "Enter") {
      handleNewFileSubmit();
      return;
    }
  };
  return (
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
          onKeyDown={handleKeyDown}
          onChange={handleNewFileNameInput}
        />
      </div>
    </Modal>
  );
};

export default AddFileModal;
