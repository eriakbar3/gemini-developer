"use client";

import { Card, Typography, Space, Avatar, Tooltip } from "antd";
import { UserOutlined, RobotOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text, Paragraph } = Typography;

export default function ChatMessageAntd({ message, isUser, timestamp }) {
  const [copied, setCopied] = useState(false);
  console.log("Rendering message:", { message, isUser, timestamp });
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <Space
        align="start"
        style={{"flex-direction": isUser ? "row-reverse" : "row"}}
      >
        {/* Avatar */}
        <Avatar
          size={40}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{
            background: isUser
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #1890ff 0%, #52c41a 100%)",
            flexShrink: 0,
          }}
        />

        {/* Message Card */}
        <Card
          hoverable={!isUser}
          style={{
            background: isUser ? "#e6f7ff" : "#ffffff",
            borderRadius: 12,
            border: isUser ? "1px solid #91d5ff" : "1px solid #d9d9d9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            flex: 1,
          }}
          bodyStyle={{ padding: "12px 16px" }}
          actions={
            !isUser
              ? [
                  <Tooltip title={copied ? "Copied!" : "Copy message"} key="copy">
                    <span
                      onClick={handleCopy}
                      style={{ cursor: "pointer", fontSize: 14 }}
                    >
                      {copied ? (
                        <CheckOutlined style={{ color: "#52c41a" }} />
                      ) : (
                        <CopyOutlined />
                      )}
                    </span>
                  </Tooltip>,
                ]
              : undefined
          }
        >
          <Paragraph
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 14,
              lineHeight: 1.6,
              color: isUser ? "#0050b3" : "#262626",
            }}
          >
            {message}
          </Paragraph>
          {timestamp && (
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                marginTop: 8,
                display: "block",
              }}
            >
              {new Date(timestamp).toLocaleTimeString()}
            </Text>
          )}
        </Card>
      </Space>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
