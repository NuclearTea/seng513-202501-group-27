import { useEffect, useState } from "react";
import {
  DockerLogRequest,
  DockerLogEntry,
} from "../proto/dockerLogs/dockerLogs_pb";
import { DockerLogServiceClient } from "../proto/dockerLogs/DockerLogsServiceClientPb";

const client = new DockerLogServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useDockerLogs = (containerId: string) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerId) return;

    const request = new DockerLogRequest();
    request.setContainerId(containerId);

    const stream = client.streamDockerLogs(request, {});

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

    return () => {
      console.log("Cleaning up log stream");
      stream.cancel(); // Cancels the gRPC stream
    };
  }, [containerId]);

  return { logs, error };
};
