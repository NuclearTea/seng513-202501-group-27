import { StateCreator } from "zustand";
import { File } from "../types";
import { ValidBackends } from "../components/CreateProjectForm/CreateProjectForm";

export type FileSlice = {
  files: File[];
  selectedFile: File | null;
  content: string;
  setSelectedFile: (file: File) => void;
  updateFileContent: (id: File["id"], content: string) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  getFileByPath: (filePath: string) => File | null;
  generateInitialFiles: (selectedBackend: ValidBackends) => File[];
};

export const createFileSlice: StateCreator<FileSlice> = (set, get) => ({
  files: [],
  selectedFile: null as File | null,
  content: "",
  setSelectedFile: (file: File) => {
    set({ selectedFile: file });
  },
  setFiles: (files: File[]) => {
    set({ files });
  },
  updateFileContent: (id: File["id"], content: string) => {
    set((state) => {
      const files = state.files;
      if (!files || files.length === 0) return state;

      const fileIndex = files.findIndex((f) => f.id === id);
      if (fileIndex === -1) return state;

      const newFile = { ...files[fileIndex], content };
      const newFiles = files.map((obj, i) => (i === fileIndex ? newFile : obj));
      return { ...state, files: newFiles };
    });
  },
  addFile: (file: File) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  getFileByPath: (filePath: string) => {
    const { files } = get();
    const filePathLowerCase = filePath.toLowerCase();
    const file = files.find(
      (f) =>
        f.path
          .join("/")
          .concat(`${f.path.length ? "/" : ""}${f.name}`)
          .toLowerCase() === filePathLowerCase,
    );
    return file ?? null;
  },
  generateInitialFiles: (selectedBackend: ValidBackends) => {
    let newFiles: File[] = [];
    switch (selectedBackend) {
      case "Node.JS":
        newFiles = [
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
        ];
    }
    set(() => ({
      files: newFiles,
    }));
    return newFiles;
  },
});
