"use client";

import { Card, Typography, Space, Avatar, Tooltip, Button, Popconfirm } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CopyOutlined,
  CheckOutlined,
  LikeOutlined,
  DislikeOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./CodeBlock";

const { Text, Paragraph } = Typography;

export default function EnhancedMessageAntd({
  message,
  isUser,
  timestamp,
  onRegenerate,
  onEdit,
  onDelete,
  onFeedback,
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(type);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 40,
        paddingLeft: isUser ? 56 : 0,
        paddingRight: isUser ? 0 : 56,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <Space
        align="start"
        size={12}
        style={{
          width: "100%",
          flexDirection: "row",
        }}
      >
        {/* Avatar - Simple icon only */}
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {isUser ? (
            <UserOutlined style={{ fontSize: 20, color: "#9AA0A6" }} />
          ) : (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500, color: "#131314" }}>G</span>
            </div>
          )}
        </div>

        {/* Message Content - NO CARD/BUBBLE */}
        <div style={{ flex: 1, minWidth: 0 }}>
            {/* Message Content - Plain text style */}
            {isUser ? (
              <Paragraph
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#E8EAED",
                  fontWeight: 400,
                }}
              >
                {message}
              </Paragraph>
            ) : (
              <div
                className="markdown-content"
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "#E8EAED",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Custom code block rendering
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");

                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={codeString} />
                      ) : (
                        <code
                          style={{
                            background: "#f5f5f5",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 13,
                            fontFamily: '"Fira Code", monospace',
                            color: "#d73a49",
                            border: "1px solid #e8e8e8",
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    // Enhanced headings
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: 28,
                          fontWeight: 600,
                          marginTop: 24,
                          marginBottom: 16,
                          borderBottom: "2px solid #f0f0f0",
                          paddingBottom: 8,
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: 24,
                          fontWeight: 600,
                          marginTop: 20,
                          marginBottom: 12,
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          marginTop: 16,
                          marginBottom: 10,
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    // Enhanced lists
                    ul: ({ children }) => (
                      <ul
                        style={{
                          marginLeft: 20,
                          marginTop: 8,
                          marginBottom: 8,
                        }}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol
                        style={{
                          marginLeft: 20,
                          marginTop: 8,
                          marginBottom: 8,
                        }}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li
                        style={{
                          marginBottom: 6,
                          lineHeight: 1.7,
                        }}
                      >
                        {children}
                      </li>
                    ),
                    // Enhanced blockquotes
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "4px solid #1890ff",
                          paddingLeft: 16,
                          marginLeft: 0,
                          marginTop: 12,
                          marginBottom: 12,
                          color: "#595959",
                          fontStyle: "italic",
                          background: "#f9f9f9",
                          padding: "12px 16px",
                          borderRadius: 4,
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                    // Enhanced links
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1890ff",
                          textDecoration: "none",
                          borderBottom: "1px solid #91d5ff",
                        }}
                      >
                        {children}
                      </a>
                    ),
                    // Enhanced tables
                    table: ({ children }) => (
                      <div style={{ overflowX: "auto", marginTop: 12, marginBottom: 12 }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #e8e8e8",
                          }}
                        >
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th
                        style={{
                          padding: "10px 12px",
                          background: "#fafafa",
                          borderBottom: "2px solid #e8e8e8",
                          fontWeight: 600,
                          textAlign: "left",
                        }}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid #e8e8e8",
                        }}
                      >
                        {children}
                      </td>
                    ),
                    // Enhanced paragraphs
                    p: ({ children }) => (
                      <p
                        style={{
                          marginTop: 8,
                          marginBottom: 8,
                          lineHeight: 1.8,
                        }}
                      >
                        {children}
                      </p>
                    ),
                  }}
                >
                  {message}
                </ReactMarkdown>
              </div>
            )}

          {/* Action Buttons - Inline, minimal */}
          <Space
            size={2}
            style={{
              marginTop: 12,
              display: "flex",
            }}
          >
            {/* Copy Button - Dark minimal style */}
            <Button
              type="text"
              size="small"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              style={{
                color: copied ? "#81C995" : "#9AA0A6",
                fontSize: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                padding: 0,
              }}
            />

            {/* AI Message Actions */}
            {!isUser && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<LikeOutlined />}
                  onClick={() => handleFeedback("like")}
                  style={{
                    color: feedback === "like" ? "#8AB4F8" : "#9AA0A6",
                    fontSize: 16,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    padding: 0,
                  }}
                />

                <Button
                  type="text"
                  size="small"
                  icon={<DislikeOutlined />}
                  onClick={() => handleFeedback("dislike")}
                  style={{
                    color: feedback === "dislike" ? "#F28B82" : "#9AA0A6",
                    fontSize: 16,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    padding: 0,
                  }}
                />

                {onRegenerate && (
                  <Button
                    type="text"
                    size="small"
                    icon={<RedoOutlined />}
                    onClick={onRegenerate}
                    style={{
                      color: "#9AA0A6",
                      fontSize: 16,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      padding: 0,
                    }}
                  />
                )}
              </>
            )}
          </Space>
        </div>
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
