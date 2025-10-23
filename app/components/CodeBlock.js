"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button, Space, Typography, message } from "antd";
import { CopyOutlined, CheckOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error("Failed to copy code");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("Code downloaded!");
  };

  return (
    <div
      style={{
        position: "relative",
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #d9d9d9",
      }}
    >
      {/* Header with language and actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "#1e1e1e",
          borderBottom: "1px solid #3c3c3c",
        }}
      >
        <Text
          style={{
            color: "#858585",
            fontSize: 12,
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          {language || "plaintext"}
        </Text>
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            style={{
              color: copied ? "#52c41a" : "#858585",
              border: "none",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{
              color: "#858585",
              border: "none",
            }}
          >
            Download
          </Button>
        </Space>
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "16px",
          fontSize: 14,
          lineHeight: 1.6,
          maxHeight: "500px",
          overflowY: "auto",
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "Courier New", monospace',
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
