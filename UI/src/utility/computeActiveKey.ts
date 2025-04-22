import { File } from "../proto/filetree/filetree_pb";

export const computeActiveKey = (file: File | null) => {
  if (!file) return "";
  const pathList = file.getPathList();
  const fileName = file.getName();
  // root level
  if (pathList.length === 0) {
    return fileName;
  }
  return `${pathList.join("/")}/${fileName}`;
};
