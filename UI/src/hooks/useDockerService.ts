import { useState } from "react";
import { FileServiceClient } from "../proto/filetree/FiletreeServiceClientPb";
import {
  Directory,
  UploadRequest,
  ReuploadRequest,
  UploadResponse,
} from "../proto/filetree/filetree_pb";
import { ValidBackends, validBackendStrToEnum } from "../types/ValidBackends";
import { ClientReadableStream } from "grpc-web";

const client = new FileServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useDockerService = () => {
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  const handleStream = (stream: ClientReadableStream<UploadResponse>) => {
    setStatusMessages([]);
    setError(null);
    setLink(null);
    setLoading(true);

    stream.on("data", (response) => {
      const status = response.getStatus();
      if (status) {
        setStatusMessages((prev) => [...prev, status]);
      }

      const url = response.getUrl();
      if (url) {
        setLink(url);
      }
    });

    stream.on("error", (err) => {
      setError(err.message || "An error occurred");
      setLoading(false);
    });

    stream.on("end", () => {
      setLoading(false);
    });
  };

  const uploadProject = (root: Directory, backend: ValidBackends) => {
    const request = new UploadRequest();
    request.setRoot(root);
    request.setProjecttype(validBackendStrToEnum(backend));
    const stream = client.upload(request, {});
    handleStream(stream);
  };

  const redeployProject = (
    projectSlug: string,
    root: Directory,
    backend: ValidBackends,
  ) => {
    const request = new ReuploadRequest();
    request.setProjectslug(projectSlug);
    request.setRoot(root);
    request.setProjecttype(validBackendStrToEnum(backend));
    const stream = client.redeploy(request, {});
    handleStream(stream);
  };

  return {
    statusMessages,
    loading,
    error,
    link,
    uploadProject,
    redeployProject,
  };
};
