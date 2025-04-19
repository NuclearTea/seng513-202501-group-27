import React from "react";
import CodeEditor from "./components/CodeEditor/CodeEditor";
import CreateProjectForm from "./components/CreateProjectForm/CreateProjectForm";
import appStore from "./state/app.store";

const App: React.FC = () => {
  const { files } = appStore();

  return <div>{files.length ? <CodeEditor /> : <CreateProjectForm />}</div>;
};

export default App;
