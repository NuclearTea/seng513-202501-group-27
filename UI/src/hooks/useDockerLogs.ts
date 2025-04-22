import { useEffect, useRef, useState } from "react";
import {
  DockerLogRequest,
  DockerLogEntry,
} from "../proto/dockerLogs/dockerLogs_pb";
import { DockerLogServiceClient } from "../proto/dockerLogs/DockerLogsServiceClientPb";
import appStore from "../state/app.store";
import { ClientReadableStream } from "grpc-web";

const client = new DockerLogServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useDockerLogs = (containerId: string) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { redeployCount } = appStore();
  const streamRef = useRef<ClientReadableStream<DockerLogEntry> | null>(null);
  useEffect(() => {
    if (!containerId) return;
    console.log("getting logs");
    const timeout = setTimeout(() => {
      const request = new DockerLogRequest();
      request.setContainerId(containerId);

      const stream = client.streamDockerLogs(request, {});
      streamRef.current = stream;
      stream.on("data", (response: DockerLogEntry) => {
        const line = response.getMessage();
        setLogs((prev) => [...prev, line]);
      });

      stream.on("error", (err) => {
        console.error("Log stream error:", err);
        setError(err.message);
      });

      stream.on("end", () => {
        console.log("Log stream ended");
      });
    }, 2000);

    return () => {
      clearTimeout(timeout);
      console.log("Cleaning up log stream");
      streamRef?.current?.cancel();
      streamRef.current = null;
      // stream.cancel(); // Cancels the gRPC stream
    };
  }, [containerId, redeployCount]);

  return { logs, error };
};
