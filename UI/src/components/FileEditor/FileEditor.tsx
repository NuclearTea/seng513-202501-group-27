import React, { useState } from "react";
import "./fileEditor.css";
import appStore from "../../state/app.store";

const FileEditor = () => {
  const selectedFile = appStore().selectedFile;
  // const updateFileContent = appStore().updateFileContent;
  const [content, setContentLocal] = useState<string>(
    selectedFile?.content || "",
  );

  if (!selectedFile) {
    return <div>Hello</div>;
  }
  const handleContentChange = (value) => {
    setContentLocal(value);
    // if (selectedFile && selectedFile.content !== content) {
    // updateFileContent(selectedFile.id, content);
    // }
  };
  console.log(selectedFile.content);

  return (
    <div className="file-editor-container">
      <h2>Editing {selectedFile.name}</h2>
      <textarea
        content={content}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default FileEditor;
