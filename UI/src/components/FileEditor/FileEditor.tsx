import MonacoEditor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import appStore from "../../state/app.store";
import { File } from "../../proto/filetree/filetree_pb";
import "./fileEditor.css";

const determineLanguage = (f: File): string => {
  const fileNameSplit = f.getName().split(".");
  const fileNameEnding = fileNameSplit[fileNameSplit.length - 1];
  if (!fileNameEnding) return "markdown";
  switch (fileNameEnding.toLowerCase()) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "c":
    case "cpp":
    case "c++":
      return "cpp";
    case "csharp":
    case "c#":
      return "c#";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    case "json":
      return "json";
    default:
      return "markdown";
  }
};

const FileEditor = () => {
  const selectedFile = appStore().selectedFile;
  const updateFileContent = appStore().updateFileContent;

  const [content, setContentLocal] = useState<string>(
    selectedFile?.getContent() ?? "",
  );
  const selectedFileId = selectedFile?.getId();
  useEffect(() => {
    if (selectedFile) {
      setContentLocal(selectedFile.getContent());
    }
  }, [selectedFile, selectedFileId]);

  if (!selectedFile) {
    return <div>Something went wrong with selecting your file</div>;
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContentLocal(value);
      updateFileContent(selectedFile.getId(), value);
    }
  };

  const language = determineLanguage(selectedFile);

  return (
    <div className="file-editor-container">
      <MonacoEditor
        className="monaco-editor"
        path={selectedFile.getName()}
        defaultLanguage={language}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default FileEditor;
