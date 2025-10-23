"use client";

import { useState } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  message as antMessage,
  Divider,
  Alert,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  SendOutlined,
  CopyOutlined,
  ClearOutlined,
  CodeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function CommitGenerator() {
  const [gitDiff, setGitDiff] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessages, setCommitMessages] = useState(null);
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedDetailed, setCopiedDetailed] = useState(false);

  const handleGenerate = async () => {
    if (!gitDiff.trim()) {
      antMessage.warning("Please enter a git diff");
      return;
    }

    setIsLoading(true);
    setCommitMessages(null);

    try {
      const response = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitDiff: gitDiff.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate commit message");
      }

      setCommitMessages(data.commitMessages);
      antMessage.success("Commit message generated successfully!");
    } catch (err) {
      antMessage.error(err.message || "Failed to generate commit message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "short") {
        setCopiedShort(true);
        setTimeout(() => setCopiedShort(false), 2000);
      } else {
        setCopiedDetailed(true);
        setTimeout(() => setCopiedDetailed(false), 2000);
      }
      antMessage.success("Copied to clipboard!");
    } catch (err) {
      antMessage.error("Failed to copy to clipboard");
    }
  };

  const handleClear = () => {
    setGitDiff("");
    setCommitMessages(null);
    setCopiedShort(false);
    setCopiedDetailed(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          <Space direction="vertical" size="small">
            <Title
              level={2}
              style={{ color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}
            >
              <CodeOutlined /> Git Commit Message Generator
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 16 }}>
              Generate professional commit messages from your git diff using AI
            </Text>
          </Space>
        </Card>

        {/* Instructions */}
        <Alert
          message="How to use"
          description={
            <Space direction="vertical" size="small">
              <Text>1. Run <Text code>git diff</Text> or <Text code>git diff --staged</Text> in your terminal</Text>
              <Text>2. Copy and paste the output into the text area below</Text>
              <Text>3. Click "Generate" or press <Text keyboard>Ctrl+Enter</Text></Text>
              <Text>4. Get both short and detailed commit message suggestions</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ borderRadius: 8 }}
        />

        {/* Input Section */}
        <Card title="Git Diff Input" style={{ borderRadius: 8 }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <TextArea
              value={gitDiff}
              onChange={(e) => setGitDiff(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Paste your git diff here...\n\nExample:\ndiff --git a/src/App.js b/src/App.js\nindex 1234567..abcdefg 100644\n--- a/src/App.js\n+++ b/src/App.js\n@@ -1,5 +1,8 @@\n function App() {\n+  const [count, setCount] = useState(0);\n   return (\n     <div>\n+      <button onClick={() => setCount(count + 1)}>\n+        Count: {count}\n+      </button>\n     </div>\n   );\n }`}
              autoSize={{ minRows: 10, maxRows: 20 }}
              disabled={isLoading}
              style={{
                fontFamily: "monospace",
                fontSize: 13,
              }}
            />

            <Space>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={handleGenerate}
                disabled={!gitDiff.trim() || isLoading}
                loading={isLoading}
              >
                Generate Commit Message
              </Button>

              {gitDiff && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              )}
            </Space>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Tip: Press <Text keyboard>Ctrl+Enter</Text> to generate quickly
            </Text>
          </Space>
        </Card>

        {/* Results Section */}
        {commitMessages && (
          <Card title="Generated Commit Messages" style={{ borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              {/* Short Commit Message */}
              <Col xs={24} lg={12}>
                <Card
                  type="inner"
                  title={
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span>Short Commit Message</span>
                    </Space>
                  }
                  extra={
                    <Tooltip title={copiedShort ? "Copied!" : "Copy to clipboard"}>
                      <Button
                        type="text"
                        icon={copiedShort ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CopyOutlined />}
                        onClick={() => handleCopy(commitMessages.short, "short")}
                        size="small"
                      />
                    </Tooltip>
                  }
                  style={{ height: "100%" }}
                >
                  <Paragraph
                    code
                    copyable={{ text: commitMessages.short }}
                    style={{
                      marginBottom: 0,
                      padding: 12,
                      background: "#f5f5f5",
                      borderRadius: 4,
                      fontFamily: "monospace",
                    }}
                  >
                    {commitMessages.short}
                  </Paragraph>
                </Card>
              </Col>

              {/* Detailed Commit Message */}
              <Col xs={24} lg={12}>
                <Card
                  type="inner"
                  title={
                    <Space>
                      <CheckCircleOutlined style={{ color: "#1890ff" }} />
                      <span>Detailed Commit Message</span>
                    </Space>
                  }
                  extra={
                    <Tooltip title={copiedDetailed ? "Copied!" : "Copy to clipboard"}>
                      <Button
                        type="text"
                        icon={copiedDetailed ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CopyOutlined />}
                        onClick={() => handleCopy(commitMessages.detailed, "detailed")}
                        size="small"
                      />
                    </Tooltip>
                  }
                  style={{ height: "100%" }}
                >
                  <Paragraph
                    code
                    copyable={{ text: commitMessages.detailed }}
                    style={{
                      marginBottom: 0,
                      padding: 12,
                      background: "#f5f5f5",
                      borderRadius: 4,
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                    }}
                  >
                    {commitMessages.detailed}
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Alert
              message="Next Steps"
              description={
                <Space direction="vertical">
                  <Text>Copy the commit message you prefer and use it in your git commit:</Text>
                  <Text code>git commit -m "your-commit-message"</Text>
                  <Text>Or for detailed message:</Text>
                  <Text code>git commit</Text>
                  <Text type="secondary">(then paste the detailed message in your editor)</Text>
                </Space>
              }
              type="success"
              showIcon
            />
          </Card>
        )}
      </Space>
    </div>
  );
}
