import { useState } from "react";
import { FileServiceClient } from "../proto/filetree/FiletreeServiceClientPb";
import {
  Directory,
  UploadRequest,
  UploadResponse,
} from "../proto/filetree/filetree_pb";
import { ValidBackends, validBackendStrToEnum } from "../types/ValidBackends";

const client = new FileServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useFileService = () => {
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  const uploadProject = (root: Directory, backend: ValidBackends) => {
    const request = new UploadRequest();
    request.setRoot(root);
    request.setProjecttype(validBackendStrToEnum(backend));

    setStatusMessages([]);
    setError(null);
    setLink(null);
    setLoading(true);
    const stream = client.upload(request, {});

    stream.on("data", (response: UploadResponse) => {
      console.log(1, response);
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
      console.log(2, "error", err);
      setError(err.message || "An error occurred");
      setLoading(false);
    });

    stream.on("end", () => {
      console.log(3, "end");
      setLoading(false);
    });
  };

  return { statusMessages, loading, error, link, uploadProject };
};
