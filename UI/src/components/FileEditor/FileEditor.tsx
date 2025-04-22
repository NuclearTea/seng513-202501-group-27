import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Result, Spin } from "antd";
import { File } from "../../proto/filetree/filetree_pb";
import appStore from "../../state/app.store";
import "./fileEditor.css";
import { LoadingOutlined } from "@ant-design/icons";

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
      return "csharp";
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
        <Result
          status="404"
          title="No File Selected"
          subTitle="Please select a file from the tabs above to start editing."
        />
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
  const EditorLoader = () => (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 32, color: "#fff" }} spin />
        }
        tip={<span style={{ color: "#fff" }}>Loading editor...</span>}
      />
    </div>
  );
  return (
    <div className="file-editor-container">
      <Editor
        saveViewState={false}
        className="monaco-editor"
        path={`${fileToEdit.getName()}-${fileToEdit.getPathList().toString()}`}
        language={language}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
        loading={<EditorLoader />}
      />
    </div>
  );
};

export default FileEditor;
