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
  MenuOutlined,
  DeleteOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import EnhancedMessageAntd from "./EnhancedMessageAntd";
import LoadingIndicatorAntd from "./LoadingIndicatorAntd";
import { useTheme } from "./AntdThemeProvider";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function ChatInterfaceAntd() {
  const { isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      if (data.success) {
        setChatHistory(data.conversations);
        const loadedMessages = [];
        data.conversations.forEach((conv) => {
          loadedMessages.push({
            text: conv.userMessage,
            isUser: true,
            timestamp: conv.timestamp,
          });
          loadedMessages.push({
            text: conv.aiResponse,
            isUser: false,
            timestamp: conv.timestamp,
          });
        });
        setMessages(loadedMessages);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      antMessage.error("Failed to load chat history");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { text: userMessage, isUser: true, timestamp: new Date().toISOString() },
    ]);
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

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { text: data.response, isUser: false, timestamp: data.timestamp },
      ]);

      // Reload history to keep sidebar updated
      loadChatHistory();
    } catch (err) {
      antMessage.error(err.message || "Failed to send message");
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: ${err.message}. Please try again.`,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    try {
      const response = await fetch("/api/chat", { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        setMessages([]);
        setChatHistory([]);
        antMessage.success("Chat history cleared successfully");
      }
    } catch (err) {
      console.error("Failed to clear chat:", err);
      antMessage.error("Failed to clear chat history");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          background: "#ffffff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Space align="center" size="middle">
          <RobotOutlined
            style={{
              fontSize: 32,
              background: "linear-gradient(135deg, #1890ff 0%, #52c41a 50%, #faad14 75%, #ff4d4f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
          <Title
            level={3}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #1890ff 0%, #52c41a 50%, #faad14 75%, #ff4d4f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gemini Chat
          </Title>
        </Space>

        <Space>
          <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Button
              icon={isDark ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggleTheme}
              style={{
                color: isDark ? "#faad14" : "#8c8c8c",
              }}
            >
              {isDark ? "Light" : "Dark"}
            </Button>
          </Tooltip>

          <Tooltip title="View chat history">
            <Badge count={chatHistory.length} overflowCount={99}>
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setHistoryDrawerOpen(true)}
              >
                History
              </Button>
            </Badge>
          </Tooltip>

          {messages.length > 0 && (
            <Popconfirm
              title="Clear all chat history?"
              description="This action cannot be undone."
              onConfirm={handleClearChat}
              okText="Yes, clear"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Clear all messages">
                <Button danger icon={<DeleteOutlined />}>
                  Clear
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      </Header>

      {/* Main Content */}
      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
          background: "#f0f2f5",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Empty State */}
          {messages.length === 0 && !isLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
              }}
            >
              <Empty
                image={
                  <RobotOutlined
                    style={{
                      fontSize: 80,
                      color: "#1890ff",
                    }}
                  />
                }
                styles={{ image: { height: 100 } }}
                description={
                  <Space direction="vertical" size="small">
                    <Title level={2} style={{ marginBottom: 8 }}>
                      Hello! How can I help you today?
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      Start a conversation with Gemini AI
                    </Text>
                  </Space>
                }
              />
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <EnhancedMessageAntd
              key={index}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              onRegenerate={
                !msg.isUser && index === messages.length - 1
                  ? () => {
                      // Regenerate last AI response
                      const lastUserMsg = messages[index - 1]?.text;
                      if (lastUserMsg) {
                        setMessages((prev) => prev.slice(0, -1));
                        setInputValue(lastUserMsg);
                        handleSendMessage();
                      }
                    }
                  : undefined
              }
              onFeedback={(type) => {
                console.log(`Feedback for message ${index}:`, type);
                antMessage.success(`Thank you for your ${type === "like" ? "positive" : "negative"} feedback!`);
              }}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && <LoadingIndicatorAntd />}

          <div ref={messagesEndRef} />
        </div>
      </Content>

      {/* Footer with Input */}
      <Footer
        style={{
          background: "#ffffff",
          padding: "16px 24px",
          borderTop: "1px solid #d9d9d9",
          position: "sticky",
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Space.Compact style={{ width: "100%" }} size="large">
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 6 }}
              disabled={isLoading}
              style={{ borderRadius: "8px 0 0 8px" }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              loading={isLoading}
              style={{ borderRadius: "0 8px 8px 0", height: "auto" }}
            >
              Send
            </Button>
          </Space.Compact>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            Gemini AI can make mistakes. Check important information.
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
        {chatHistory.length === 0 ? (
          <Empty description="No chat history yet" />
        ) : (
          <List
            dataSource={chatHistory}
            renderItem={(item, index) => (
              <Card
                size="small"
                style={{ marginBottom: 16 }}
                hoverable
                title={
                  <Text strong ellipsis>
                    {item.userMessage.substring(0, 30)}
                    {item.userMessage.length > 30 ? "..." : ""}
                  </Text>
                }
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    style={{ margin: 0, fontSize: 12 }}
                  >
                    {item.aiResponse}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </Space>
              </Card>
            )}
          />
        )}
      </Drawer>

      {/* Floating Action Buttons */}
      <FloatButton.Group shape="circle" style={{ right: 24, bottom: 100 }}>
        <FloatButton
          icon={<HistoryOutlined />}
          tooltip="Chat History"
          onClick={() => setHistoryDrawerOpen(true)}
          badge={{ count: chatHistory.length, overflowCount: 99 }}
        />
        <FloatButton.BackTop visibilityHeight={200} />
      </FloatButton.Group>
    </Layout>
  );
}
