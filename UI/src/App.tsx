import FileList from "./components/FileList/FileList.tsx";
import FileEditor from "./components/FileEditor/FileEditor.tsx";
import "./App.css";
import appStore from "./state/app.store.ts";
import RightPanel from "./components/RightPanel/RightPanel.tsx";

const App = () => {
  const selectedFile = appStore().selectedFile;
  // console.log(selectedFile);
  return (
    <div className="ide-container">
      <div className="file-list">
        <FileList />
      </div>
      <div className="file-editor">
        {selectedFile ? <FileEditor /> : <div></div>}
      </div>
      <div className="right-panel">{selectedFile ? <RightPanel /> : <></>}</div>
    </div>
  );
};

export default App;
