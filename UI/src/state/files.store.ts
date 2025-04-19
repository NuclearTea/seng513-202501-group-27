import { StateCreator } from "zustand";
import { File } from "../proto/filetree/filetree_pb";
import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";
import NodeJSInitFileStructure from "../utility/NodeJS.init";
import { ValidBackends } from "../types/ValidBackends";

export type FileSlice = {
  files: File[];
  selectedFile: File | null;
  content: string;
  setSelectedFile: (file: File) => void;
  updateFileContent: (id: string, content: string) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  getFileByPath: (filePath: string) => File | null;
  generateInitialFiles: (
    selectedBackend: ValidBackends,
    formData: NodeJSInitFormData,
  ) => File[];
};

export const createFileSlice: StateCreator<FileSlice> = (set, get) => ({
  files: [],
  selectedFile: null,
  content: "",

  setSelectedFile: (file: File) => {
    set({ selectedFile: file });
  },

  setFiles: (files: File[]) => {
    set({ files });
  },

  updateFileContent: (id: string, content: string) => {
    set((state) => {
      const updatedFiles = state.files.map((file) => {
        if (file.getId() === id) {
          const updatedFile = new File()
            .setId(file.getId())
            .setName(file.getName())
            .setPathList(file.getPathList())
            .setContent(content);
          return updatedFile;
        }
        return file;
      });
      return { ...state, files: updatedFiles };
    });
  },
  addFile: (file: File) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  getFileByPath: (filePath: string) => {
    const { files } = get();
    const targetPath = filePath.toLowerCase();

    return (
      files.find((f) => {
        const fullPath = [...f.getPathList(), f.getName()]
          .join("/")
          .toLowerCase();
        return fullPath === targetPath;
      }) ?? null
    );
  },

  generateInitialFiles: (selectedBackend: ValidBackends, formData) => {
    let newFiles: File[] = [];

    switch (selectedBackend) {
      case "Node.JS":
        newFiles = NodeJSInitFileStructure(formData);
        break;
      // Add more backends here
    }

    set(() => ({
      files: newFiles,
    }));

    return newFiles;
  },
});
