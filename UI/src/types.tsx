export type File = {
  content: string;
  id: string;
  name: string;
  path: string[];
};

export type Directory = {
  name: string;
  path: string[];
  children: (Directory | File)[];
};

export type TreeDataNode = {
  title: React.ReactNode; // The title of the node, e.g., the file or folder name
  key: string; // The unique key of the node
  isLeaf?: boolean; // Flag to indicate if the node is a leaf (file) or not (directory)
  children?: TreeDataNode[]; // The children of the node (only for non-leaf nodes)
  icon?: React.ReactNode; // The icon for the node
  disabled?: boolean; // Flag to disable the node
};
