import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { File } from "./types";
// import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
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
// Sample files data
export const fileData: File[] = [
  { path: ["Documents", "File1.txt"], name: "File1.txt", content: "", id: "1" },
  { path: ["Documents", "File2.txt"], name: "File2.txt", content: "", id: "2" },
  {
    path: ["Documents", "Folder1", "File3.txt"],
    name: "File3.txt",
    content: "",
    id: "3",
  },
  {
    path: ["Pictures", "Image1.png"],
    name: "Image1.png",
    content: "",
    id: "4",
  },
  {
    path: ["Pictures", "Image2.png"],
    name: "Image2.png",
    content: "",
    id: "5",
  },
  {
    path: ["Pictures", "Folder2", "Image3.png"],
    name: "Image3.png",
    content: "",
    id: "6",
  },
];

export const buildMenuItemsFromFiles = (files: File[]): MenuItem[] => {
  const fileStructure = files.reduce(
    (acc, file) => {
      let current = acc;

      // Traverse each part of the file path to create directories
      file.path.forEach((folder) => {
        if (!hasKey(current, folder)) {
          current[folder] = {};
        }
        current = current[folder];
      });

      // Add the file to the directory structure
      current[file.name] = file;
      return acc;
    },
    {} as Record<string, any>,
  );

  // Function to recursively convert the directory structure into MenuItems
  const convertToMenuItems = (
    structure: any,
    parentPath: string[] = [],
  ): MenuItem[] => {
    return Object.keys(structure).map((key) => {
      const currentPath = [...parentPath, key];
      const item = structure[key];

      // If the item is a file, return a MenuItem with no children
      if (item && item.path) {
        return getItem(
          key, // File name
          currentPath.join("/"), // Key is the joined path
          <FileOutlined />, // File icon
        );
      }

      // If the item is a directory, recursively get its children
      const children = convertToMenuItems(item, currentPath);

      return getItem(
        key, // Directory name
        currentPath.join("/"), // Key is the joined path
        <FolderOutlined />, // Folder icon
        children, // Children directories and files
      );
    });
  };

  return convertToMenuItems(fileStructure);
};
