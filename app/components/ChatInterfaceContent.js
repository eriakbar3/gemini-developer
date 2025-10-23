"use client";

import { useState, useEffect, useRef } from "react";
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message as antMessage,
  Empty,
  Drawer,
  List,
  Card,
  Popconfirm,
  Tooltip,
  Badge,
  FloatButton,
} from "antd";
import {
  SendOutlined,
  ClearOutlined,
  HistoryOutlined,
  RobotOutlined,
  DeleteOutlined,
  BulbOutlined,
  CodeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import EnhancedMessageAntd from "./EnhancedMessageAntd";
import LoadingIndicatorAntd from "./LoadingIndicatorAntd";
import { useChatContext } from "./ChatContext";

const { Content, Footer } = Layout;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function ChatInterfaceContent({ onNewChat }) {
  const {
    chatSessions,
    currentSessionId,
    currentMessages,
    createNewSession,
    addMessage,
  } = useChatContext();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Expose newChat function via prop
  useEffect(() => {
    if (onNewChat) {
      onNewChat(() => handleNewChat());
    }
  }, [onNewChat]);

  // Initialize with new session on mount if no session exists
  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, [currentSessionId, createNewSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message to context
    addMessage({ text: userMessage, isUser: true });
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add AI response to context
      addMessage({ text: data.response, isUser: false });
    } catch (err) {
      antMessage.error(err.message || "Failed to send message");
      addMessage({
        text: `Error: ${err.message}. Please try again.`,
        isUser: false,
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    createNewSession();
    antMessage.success("Started new chat");
    inputRef.current?.focus();
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout style={{ height: "calc(100vh - 56px)" }}>
      {/* Action Bar - Hidden for cleaner look */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "12px 20px",
          borderBottom: "none",
          display: "none", // Hide action bar for ultra-minimal look
          justifyContent: "flex-end",
        }}
      >
        <Space>
          <Tooltip title="View chat history">
            <Badge count={chatSessions.length} overflowCount={99}>
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setHistoryDrawerOpen(true)}
              >
                History
              </Button>
            </Badge>
          </Tooltip>

          {currentMessages.length > 0 && (
            <Tooltip title="Start new chat">
              <Button icon={<MessageOutlined />} onClick={handleNewChat}>
                New Chat
              </Button>
            </Tooltip>
          )}
        </Space>
      </div>

      {/* Main Content */}
      <Content
        style={{
          padding: "24px 20px",
          overflowY: "auto",
          background: "#131314",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          {/* Empty State - Gemini style with suggestions */}
          {currentMessages.length === 0 && !isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "calc(100vh - 280px)",
                padding: "40px 0",
              }}
            >
              {/* Main greeting */}
              <Title
                level={1}
                style={{
                  margin: "0 0 48px 0",
                  fontSize: 56,
                  fontWeight: 400,
                  color: "#E8EAED",
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                }}
              >
                Hello
              </Title>

              {/* Prompt suggestions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "12px",
                  width: "100%",
                  maxWidth: 800,
                }}
              >
                {[
                  {
                    icon: <BulbOutlined />,
                    text: "Give me tips for how to care for a specific plant",
                  },
                  {
                    icon: <CodeOutlined />,
                    text: "Help me debug a Python function",
                  },
                  {
                    icon: <MessageOutlined />,
                    text: "Suggest fun activities for a team event",
                  },
                  {
                    icon: <RobotOutlined />,
                    text: "Explain quantum computing in simple terms",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    hoverable
                    onClick={() => {
                      setInputValue(item.text);
                      inputRef.current?.focus();
                    }}
                    style={{
                      borderRadius: "16px",
                      border: "1px solid #3C4043",
                      background: "#1E1F20",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    bodyStyle={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: 20, color: "#9AA0A6" }}>{item.icon}</div>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#E8EAED",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.text}
                    </Text>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {currentMessages.map((msg, index) => (
            <EnhancedMessageAntd
              key={index}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              onRegenerate={
                !msg.isUser && index === currentMessages.length - 1
                  ? () => {
                      // Regenerate last AI response
                      const lastUserMsg = currentMessages[index - 1]?.text;
                      if (lastUserMsg) {
                        setInputValue(lastUserMsg);
                        handleSendMessage();
                      }
                    }
                  : undefined
              }
              onFeedback={(type) => {
                console.log(`Feedback for message ${index}:`, type);
                antMessage.success(
                  `Thank you for your ${type === "like" ? "positive" : "negative"} feedback!`
                );
              }}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && <LoadingIndicatorAntd />}

          <div ref={messagesEndRef} />
        </div>
      </Content>

      {/* Footer with Input - Dark Gemini style */}
      <Footer
        style={{
          background: "#131314",
          padding: "0 20px 24px",
          borderTop: "none",
          boxShadow: "none",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
              background: "#1E1F20",
              border: "1px solid #3C4043",
              borderRadius: "24px",
              padding: "4px 4px 4px 20px",
              transition: "all 0.15s ease",
              minHeight: 56,
            }}
          >
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a prompt here"
              autoSize={{ minRows: 1, maxRows: 8 }}
              disabled={isLoading}
              style={{
                border: "none",
                background: "transparent",
                resize: "none",
                fontSize: 16,
                padding: "14px 0",
                boxShadow: "none",
                color: "#E8EAED",
              }}
            />
            <Button
              type="text"
              size="large"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              loading={isLoading}
              style={{
                borderRadius: "50%",
                height: 48,
                width: 48,
                minWidth: 48,
                background: inputValue.trim() ? "#8AB4F8" : "transparent",
                border: "none",
                color: inputValue.trim() ? "#131314" : "#9AA0A6",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            />
          </div>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: 12,
              marginTop: 16,
              color: "#9AA0A6",
            }}
          >
            Gemini may display inaccurate info, including about people, so double-check its responses.
          </Text>
        </div>
      </Footer>

      {/* Chat History Drawer */}
      <Drawer
        title={
          <Space>
            <HistoryOutlined />
            <span>Chat History</span>
          </Space>
        }
        placement="right"
        onClose={() => setHistoryDrawerOpen(false)}
        open={historyDrawerOpen}
        width={400}
      >
        {chatSessions.length === 0 ? (
          <Empty description="No chat sessions yet" />
        ) : (
          <List
            dataSource={chatSessions}
            renderItem={(session) => (
              <Card
                size="small"
                style={{ marginBottom: 16 }}
                hoverable
                title={
                  <Text strong ellipsis>
                    {session.title}
                  </Text>
                }
                onClick={() => {
                  // Will implement load session later
                  antMessage.info("Load session: " + session.title);
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {session.messages.length} messages
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(session.updatedAt).toLocaleString()}
                  </Text>
                </Space>
              </Card>
            )}
          />
        )}
      </Drawer>

      {/* Floating Action Buttons */}
      <FloatButton.Group shape="circle" style={{ right: 24, bottom: 24 }}>
        <FloatButton
          icon={<HistoryOutlined />}
          tooltip="Chat Sessions"
          onClick={() => setHistoryDrawerOpen(true)}
          badge={{ count: chatSessions.length, overflowCount: 99 }}
        />
        <FloatButton.BackTop visibilityHeight={200} />
      </FloatButton.Group>
    </Layout>
  );
}
