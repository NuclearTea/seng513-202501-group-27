import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { File } from "./proto/filetree/filetree_pb";
import { MenuProps } from "antd";
import React from "react";
import hasKey from "./utility/hasKey";

export type MenuItem = Required<MenuProps>["items"][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// ✅ Create File instances instead of plain objects
export const fileData: File[] = (() => {
  const createFile = (
    id: string,
    name: string,
    content: string,
    path: string[],
  ): File => {
    const f = new File();
    f.setId(id);
    f.setName(name);
    f.setContent(content);
    f.setPathList(path);
    return f;
  };

  return [
    createFile("1", "File1.txt", "", ["Documents"]),
    createFile("2", "File2.txt", "", ["Documents"]),
    createFile("3", "File3.txt", "", ["Documents", "Folder1"]),
    createFile("4", "Image1.png", "", ["Pictures"]),
    createFile("5", "Image2.png", "", ["Pictures"]),
    createFile("6", "Image3.png", "", ["Pictures", "Folder2"]),
  ];
})();

export const buildMenuItemsFromFiles = (files: File[]): MenuItem[] => {
  const fileStructure = files.reduce(
    (acc, file) => {
      let current = acc;

      // Traverse each part of the file path to create directories
      for (const folder of file.getPathList()) {
        if (!hasKey(current, folder)) {
          current[folder] = {};
        }
        current = current[folder];
      }

      // Add the file object into the structure
      current[file.getName()] = file;
      return acc;
    },
    {} as Record<string, any>,
  );

  // Recursive conversion to MenuItem[]
  const convertToMenuItems = (
    structure: any,
    parentPath: string[] = [],
  ): MenuItem[] => {
    return Object.keys(structure).map((key) => {
      const currentPath = [...parentPath, key];
      const item = structure[key];

      if (item instanceof File) {
        return getItem(item.getName(), currentPath.join("/"), <FileOutlined />);
      }

      const children = convertToMenuItems(item, currentPath);
      return getItem(key, currentPath.join("/"), <FolderOutlined />, children);
    });
  };

  return convertToMenuItems(fileStructure);
};
