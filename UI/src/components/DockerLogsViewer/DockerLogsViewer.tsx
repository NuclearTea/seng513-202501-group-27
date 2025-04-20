import React from "react";
import { Modal, Typography, Spin } from "antd";
import { useDockerLogs } from "../../hooks/useDockerLogs";

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
  const { logs, error } = useDockerLogs(containerId);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new log
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

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
        {!containerId ? (
          <Text type="secondary">No container selected.</Text>
        ) : error ? (
          <Text type="danger">Error: {error}</Text>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <Spin />
            <Paragraph style={{ color: "#888" }}>Waiting for logs...</Paragraph>
          </div>
        ) : (
          logs.map((line, idx) => <div key={idx}>{line}</div>)
        )}
      </div>
    </Modal>
  );
};

export default DockerLogsViewer;
