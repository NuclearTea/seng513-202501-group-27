import MonacoEditor from "@monaco-editor/react"; // Monaco Editor package
import { useEffect, useState } from "react";
import appStore from "../../state/app.store"; // Your app store

import { File } from "../../types";
import "./fileEditor.css";

const determineLanguage = (f: File): string => {
  const fileNameSplit = f.name.split(".");
  const fileNameEnding = fileNameSplit[fileNameSplit.length - 1];
  if (!fileNameEnding) return "markdown";
  switch (fileNameEnding) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "c":
      return "cpp";
    case "cpp":
      return "cpp";
    case "c++":
      return "cpp";
    case "csharp":
      return "c#";
    case "c#":
      return "c#";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    case "MD":
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
    selectedFile?.content ?? "",
  );

  useEffect(() => {
    if (selectedFile) {
      setContentLocal(selectedFile.content);
    }
  }, [selectedFile, selectedFile?.id]);

  if (!selectedFile) {
    return <div>Something went wrong with selecting your file</div>;
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContentLocal(value);
      updateFileContent(selectedFile.id, value);
    }
  };
  console.log(selectedFile.content);
  // React 19 doesn't require useMemo, but would've been used here
  const language = determineLanguage(selectedFile);
  return (
    <div className="file-editor-container">
      <MonacoEditor
        className="monaco-editor"
        path={selectedFile.name}
        defaultLanguage={language}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default FileEditor;
