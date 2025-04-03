import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";
import { File } from "../types.tsx";
const NodeJSInitFileStructure = (formData: NodeJSInitFormData): File[] => {
  return [
    {
      id: "1",
      name: "index.js",
      content: "console.log('Hello World')",
      path: ["src"],
    },
    { id: "2", name: "App.js", content: "", path: ["src"] },
    {
      id: "3",
      name: "styles.css",
      content: "",
      path: ["src"],
    },
    { id: "4", name: "README.md", content: "", path: [] },
    {
      id: "5",
      name: "package.json",
      content: JSON.stringify(formData, null, 2),
      path: [],
    },
  ];
};

export default NodeJSInitFileStructure;
