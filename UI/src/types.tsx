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
