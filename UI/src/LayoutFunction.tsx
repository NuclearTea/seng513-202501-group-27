import { File } from "./types";
// import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";

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
// export function buildMenuItems(files: File[]): MenuItem[] {
//   return [getItem(label, key)];
// }

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
console.log("here");
// Generate the MenuItems from the file data
// const menuItems = buildMenuItems(fileData);
// console.log(JSON.stringify(menuItems, null, 2));
