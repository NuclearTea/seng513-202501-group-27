import { StateCreator } from "zustand";
import { File } from "../proto/filetree/filetree_pb";
import { NodeJSInitFormData } from "../components/CreateProjectForm/NpmInitForm";
import NodeJSInitFileStructure from "../utility/NodeJS.init";
import { ValidBackends } from "../types/ValidBackends";
import { FlaskInitFormData } from "../components/CreateProjectForm/FlaskInitForm";
import { BackendFormDataMap } from "../components/CreateProjectForm/CreateProjectForm";
import FlaskInitFileStructure from "../utility/Flask.init";

export type FileSlice = {
  files: File[];
  selectedFile: File | null;
  content: string;
  selectedBackend: ValidBackends;
  openFiles: File.AsObject["id"][];
  activeKey: string;
  setActiveKey: (str: string) => void;
  addOpenFile: (newFileId: string) => void;
  removeOpenFile: (removeFileId: string) => void;
  setSelectedBackend: (str: ValidBackends) => void;
  setSelectedFile: (file: File) => void;
  updateFileContent: (id: string, content: string) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  getFileById: (id: string) => File | null;
  getFileByPath: (filePath: string) => File | null;
  generateInitialFiles: <T extends ValidBackends>(
    selectedBackend: T,
    formData: BackendFormDataMap[T],
  ) => File[];
};

export const createFileSlice: StateCreator<FileSlice> = (set, get) => ({
  files: [],
  selectedFile: null,
  content: "",
  selectedBackend: "Node.JS", // default
  openFiles: [], // default
  activeKey: "",
  setActiveKey: (str) => set({ activeKey: str }),
  addOpenFile: (newFileId) => {
    const { openFiles } = get();
    const fileAlreadyOpen = Boolean(openFiles.find((x) => x === newFileId));
    if (fileAlreadyOpen) {
      console.error("File: ", newFileId, "already open");
      return;
    }
    set({ openFiles: [...openFiles, newFileId] });
  },
  removeOpenFile: (removeFileId) => {
    const { openFiles } = get();
    const fileIsOpen = Boolean(openFiles.find((x) => x === removeFileId));
    if (!fileIsOpen) {
      console.error("File: ", removeFileId, "is not open, can't be removed");
      return;
    }
    set({ openFiles: openFiles.filter((x) => x !== removeFileId) });
  },
  setSelectedBackend: (str) => {
    set(() => ({ selectedBackend: str }));
  },
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
  getFileById: (id) => {
    const { files } = get();
    return files.find((x) => x.getId() === id) ?? null;
  },
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

  generateInitialFiles: (selectedBackend, formData) => {
    let newFiles: File[] = [];

    switch (selectedBackend) {
      case "Node.JS":
        newFiles = NodeJSInitFileStructure(formData as NodeJSInitFormData);
        break;
      case "Flask":
        newFiles = FlaskInitFileStructure(formData as FlaskInitFormData);
        break;
    }

    set(() => ({
      files: newFiles,
    }));

    return newFiles;
  },
});
