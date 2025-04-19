import { useCallback, useState } from "react";
import { FileServiceClient } from "../proto/filetree/FiletreeServiceClientPb";
import {
  UploadRequest,
  UploadResponse,
  Directory,
} from "../proto/filetree/filetree_pb";

const client = new FileServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useFileUpload = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadProject = useCallback((rootDirectory: Directory) => {
    const request = new UploadRequest();
    request.setRoot(rootDirectory);

    setLoading(true);
    setStatus(null);
    setError(null);
    console.log(request.toObject());
    client.upload(request, {}, (err, response: UploadResponse | null) => {
      if (err) {
        setError(err.message);
      } else if (response) {
        setStatus(response.getStatus());
        console.log(response.toObject());
      }
      setLoading(false);
    });
  }, []);

  return { status, loading, error, uploadProject };
};
