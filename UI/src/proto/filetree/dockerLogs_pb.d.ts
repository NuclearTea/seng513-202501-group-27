import * as jspb from 'google-protobuf'



export class DockerLogRequest extends jspb.Message {
  getContainerId(): string;
  setContainerId(value: string): DockerLogRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DockerLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DockerLogRequest): DockerLogRequest.AsObject;
  static serializeBinaryToWriter(message: DockerLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DockerLogRequest;
  static deserializeBinaryFromReader(message: DockerLogRequest, reader: jspb.BinaryReader): DockerLogRequest;
}

export namespace DockerLogRequest {
  export type AsObject = {
    containerId: string,
  }
}

export class DockerLogEntry extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): DockerLogEntry;

  getTimestamp(): string;
  setTimestamp(value: string): DockerLogEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DockerLogEntry.AsObject;
  static toObject(includeInstance: boolean, msg: DockerLogEntry): DockerLogEntry.AsObject;
  static serializeBinaryToWriter(message: DockerLogEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DockerLogEntry;
  static deserializeBinaryFromReader(message: DockerLogEntry, reader: jspb.BinaryReader): DockerLogEntry;
}

export namespace DockerLogEntry {
  export type AsObject = {
    message: string,
    timestamp: string,
  }
}

