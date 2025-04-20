import { useEffect, useState } from "react";
import { DockerLogServiceClient } from "../proto/dockerLogs/DockerLogsServiceClientPb";
import {
  DockerLogEntry,
  DockerLogRequest,
} from "../proto/dockerLogs/dockerLogs_pb";

const client = new DockerLogServiceClient("http://localhost:8081", null, {
  format: "text",
});

export const useDockerLogs = (containerId: string) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const request = new DockerLogRequest();
  request.setContainerId(containerId);

  const stream = client.streamDockerLogs(request, {});

  stream.on("data", (response: DockerLogEntry) => {
    const line = response.getMessage();
    console.log("log data", line);
    setLogs((prev) => [...prev, line]);
  });

  stream.on("error", (err) => {
    console.error("Log stream error:", err);
    setError(err.message);
  });

  stream.on("end", () => {
    console.log("Log stream ended");
  });

  return { logs, error };
};
