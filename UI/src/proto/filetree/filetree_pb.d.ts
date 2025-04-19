import * as jspb from 'google-protobuf'



export class File extends jspb.Message {
  getContent(): string;
  setContent(value: string): File;

  getId(): string;
  setId(value: string): File;

  getName(): string;
  setName(value: string): File;

  getPathList(): Array<string>;
  setPathList(value: Array<string>): File;
  clearPathList(): File;
  addPath(value: string, index?: number): File;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): File.AsObject;
  static toObject(includeInstance: boolean, msg: File): File.AsObject;
  static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): File;
  static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
}

export namespace File {
  export type AsObject = {
    content: string,
    id: string,
    name: string,
    pathList: Array<string>,
  }
}

export class Directory extends jspb.Message {
  getName(): string;
  setName(value: string): Directory;

  getPathList(): Array<string>;
  setPathList(value: Array<string>): Directory;
  clearPathList(): Directory;
  addPath(value: string, index?: number): Directory;

  getChildrenList(): Array<Child>;
  setChildrenList(value: Array<Child>): Directory;
  clearChildrenList(): Directory;
  addChildren(value?: Child, index?: number): Child;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Directory.AsObject;
  static toObject(includeInstance: boolean, msg: Directory): Directory.AsObject;
  static serializeBinaryToWriter(message: Directory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Directory;
  static deserializeBinaryFromReader(message: Directory, reader: jspb.BinaryReader): Directory;
}

export namespace Directory {
  export type AsObject = {
    name: string,
    pathList: Array<string>,
    childrenList: Array<Child.AsObject>,
  }
}

export class Child extends jspb.Message {
  getFile(): File | undefined;
  setFile(value?: File): Child;
  hasFile(): boolean;
  clearFile(): Child;

  getDirectory(): Directory | undefined;
  setDirectory(value?: Directory): Child;
  hasDirectory(): boolean;
  clearDirectory(): Child;

  getNodeCase(): Child.NodeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Child.AsObject;
  static toObject(includeInstance: boolean, msg: Child): Child.AsObject;
  static serializeBinaryToWriter(message: Child, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Child;
  static deserializeBinaryFromReader(message: Child, reader: jspb.BinaryReader): Child;
}

export namespace Child {
  export type AsObject = {
    file?: File.AsObject,
    directory?: Directory.AsObject,
  }

  export enum NodeCase { 
    NODE_NOT_SET = 0,
    FILE = 1,
    DIRECTORY = 2,
  }
}

export class UploadRequest extends jspb.Message {
  getRoot(): Directory | undefined;
  setRoot(value?: Directory): UploadRequest;
  hasRoot(): boolean;
  clearRoot(): UploadRequest;

  getProjecttype(): BackendType;
  setProjecttype(value: BackendType): UploadRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UploadRequest): UploadRequest.AsObject;
  static serializeBinaryToWriter(message: UploadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadRequest;
  static deserializeBinaryFromReader(message: UploadRequest, reader: jspb.BinaryReader): UploadRequest;
}

export namespace UploadRequest {
  export type AsObject = {
    root?: Directory.AsObject,
    projecttype: BackendType,
  }
}

export class UploadResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): UploadResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UploadResponse): UploadResponse.AsObject;
  static serializeBinaryToWriter(message: UploadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadResponse;
  static deserializeBinaryFromReader(message: UploadResponse, reader: jspb.BinaryReader): UploadResponse;
}

export namespace UploadResponse {
  export type AsObject = {
    status: string,
  }
}

export enum BackendType { 
  UNSPECIFIED = 0,
  NODEJS = 1,
  FLASK = 2,
  JAVA = 3,
  RUBY = 4,
}
