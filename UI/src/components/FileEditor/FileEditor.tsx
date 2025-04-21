import MonacoEditor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import appStore from "../../state/app.store";
import { File } from "../../proto/filetree/filetree_pb";
import "./fileEditor.css";

type FileEditorProps = {
  fileToEdit: File | null;
};

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
    case "py":
      return "python";
    default:
      return "markdown";
  }
};

const FileEditor = ({ fileToEdit }: FileEditorProps) => {
  const updateFileContent = appStore().updateFileContent;

  const [content, setContentLocal] = useState<string>(
    fileToEdit?.getContent() ?? "",
  );
  const selectedFileId = fileToEdit?.getId();
  useEffect(() => {
    if (fileToEdit) {
      setContentLocal(fileToEdit.getContent());
    }
  }, [fileToEdit, selectedFileId]);
  if (!fileToEdit) {
    return (
      <div className="file-editor-container">
        <div>Please select a file</div>
      </div>
    );
  }
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContentLocal(value);
      updateFileContent(fileToEdit.getId(), value);
    }
  };

  const language = determineLanguage(fileToEdit);

  return (
    <div className="file-editor-container">
      <MonacoEditor
        className="monaco-editor"
        path={fileToEdit.getName()}
        defaultLanguage={language}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default FileEditor;
