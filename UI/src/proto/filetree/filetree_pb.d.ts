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

  getFileChildrenList(): Array<File>;
  setFileChildrenList(value: Array<File>): Directory;
  clearFileChildrenList(): Directory;
  addFileChildren(value?: File, index?: number): File;

  getDirChildrenList(): Array<Directory>;
  setDirChildrenList(value: Array<Directory>): Directory;
  clearDirChildrenList(): Directory;
  addDirChildren(value?: Directory, index?: number): Directory;

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
    fileChildrenList: Array<File.AsObject>,
    dirChildrenList: Array<Directory.AsObject>,
  }
}

export class UploadRequest extends jspb.Message {
  getRoot(): Directory | undefined;
  setRoot(value?: Directory): UploadRequest;
  hasRoot(): boolean;
  clearRoot(): UploadRequest;

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

