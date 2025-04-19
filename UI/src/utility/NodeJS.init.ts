import { File } from "../proto/filetree/filetree_pb";
import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";

const createNodeJSInitFiles = (formData: NodeJSInitFormData): File[] => {
  const file1 = new File();
  file1.setId("1");
  file1.setName("index.js");
  file1.setContent("console.log('Hello World')");
  file1.setPathList(["src"]);

  const file2 = new File();
  file2.setId("2");
  file2.setName("App.js");
  file2.setContent("");
  file2.setPathList(["src"]);

  const file3 = new File();
  file3.setId("3");
  file3.setName("styles.css");
  file3.setContent("");
  file3.setPathList(["src"]);

  const file4 = new File();
  file4.setId("4");
  file4.setName("README.md");
  file4.setContent("");
  file4.setPathList([]);

  const file5 = new File();
  file5.setId("5");
  file5.setName("package.json");
  file5.setContent(JSON.stringify(formData, null, 2));
  file5.setPathList([]);

  return [file1, file2, file3, file4, file5];
};

export default createNodeJSInitFiles;
