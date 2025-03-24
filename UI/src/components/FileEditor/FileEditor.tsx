import React, { useState, useEffect } from "react";
import "./fileEditor.css";
import appStore from "../../state/app.store";

const FileEditor = () => {
  const selectedFile = appStore().selectedFile;
  const updateFileContent = appStore().updateFileContent;
  const [content, setContentLocal] = useState<string>(
    selectedFile?.content || "",
  );
  useEffect(() => {
    // console.log(selectedFile?.content);
    if (!selectedFile) return;
    updateFileContent(selectedFile.id, content);
  }, [content, selectedFile, updateFileContent]);

  if (!selectedFile) {
    return <div>Hello</div>;
  }
  const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setContentLocal(event.target.value);
    // if (selectedFile && selectedFile.content !== content) {
    // updateFileContent(selectedFile.id, content);
    // }
  };
  console.log(selectedFile.content);

  return (
    <div className="file-editor-container">
      <h2>Editing {selectedFile.name}</h2>
      <textarea
        value={content}
        onChange={handleContentChange}
        rows={20}
        cols={80}
      />
    </div>
  );
};

export default FileEditor;
