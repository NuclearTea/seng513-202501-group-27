import { Modal, Typography, Spin, Alert, Space, Divider } from "antd";
import { LoadingOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const { Text, Paragraph, Link } = Typography;

type UploadStatusModalProps = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  statusMessages: string[];
  link: string | null;
};

const UploadStatusModal: React.FC<UploadStatusModalProps> = ({
  open,
  onClose,
  loading,
  error,
  statusMessages,
  link,
}) => {
  return (
    <Modal
      title="🚀 Deploying Your Project"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {loading && (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            tip="Working hard to deploy..."
          />
        )}

        {!loading && error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}

        {!loading && link && (
          <>
            <Alert
              message="Deployment Complete!"
              type="success"
              showIcon
              icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
            />
            <Paragraph copyable={{ text: link }}>
              <Link href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </Link>
            </Paragraph>
          </>
        )}

        {statusMessages.length > 0 && (
          <>
            <Divider orientation="left">Build Logs</Divider>
            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                background: "#f6f8fa",
                padding: "8px 12px",
                borderRadius: 4,
                border: "1px solid #d9d9d9",
              }}
            >
              {statusMessages.map((msg, index) => (
                <Text key={index} type="secondary" style={{ display: "block" }}>
                  {msg}
                </Text>
              ))}
            </div>
          </>
        )}
      </Space>
    </Modal>
  );
};

export default UploadStatusModal;
