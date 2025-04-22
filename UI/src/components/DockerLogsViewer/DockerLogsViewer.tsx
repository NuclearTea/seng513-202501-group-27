import React, { useEffect } from "react";
import { Modal, Typography, Spin } from "antd";
import { useDockerLogs } from "../../hooks/useDockerLogs";
import appStore from "../../state/app.store";

const { Text, Paragraph } = Typography;

interface DockerLogsModalProps {
  containerId: string;
  open: boolean;
  onClose: () => void;
}

const DockerLogsViewer: React.FC<DockerLogsModalProps> = ({
  containerId,
  open,
  onClose,
}) => {
  const { incrementRedeployCount } = appStore();
  useEffect(() => {
    incrementRedeployCount();
  }, [incrementRedeployCount, open]);
  const { logs, error } = useDockerLogs(containerId);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new log
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  const dockerLogs = (
    containerId: string,
    error: string | null,
    logs: string[],
  ): React.ReactNode => {
    if (!containerId) {
      return <Text type="secondary">No container selected.</Text>;
    }

    if (error) {
      return <Text type="danger">Error: {error}</Text>;
    }

    if (logs.length === 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <Paragraph style={{ color: "#888" }}>Waiting for logs...</Paragraph>
        </div>
      );
    }

    return logs.map((line, idx) => <div key={idx}>{line}</div>);
  };
  return (
    <Modal
      title="🔧 Docker Container Logs"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <div
        ref={scrollRef}
        style={{
          backgroundColor: "#000",
          color: "#0f0",
          fontFamily: "monospace",
          height: 400,
          overflowY: "auto",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #333",
        }}
      >
        {dockerLogs(containerId, error, logs)}
      </div>
    </Modal>
  );
};

export default DockerLogsViewer;
