"use client";

import { useState, useMemo, useCallback } from "react";
import { Layout, Space, Typography, Button, Tooltip, Drawer } from "antd";
import {
  MessageOutlined,
  CodeOutlined,
  RobotOutlined,
  BulbOutlined,
  BulbFilled,
  MenuOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ChatInterfaceContent from "./ChatInterfaceContent";
import CommitGenerator from "./CommitGenerator";
import PromptMaker from "./PromptMaker";
import { useTheme } from "./AntdThemeProvider";
import { useAuth } from "./AuthContext";
import { useChatContext } from "./ChatContext";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function MainLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { chatSessions, loadSession, deleteSession } = useChatContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("general-chat");
  const [newChatTrigger, setNewChatTrigger] = useState(null);

  const handleNewChat = () => {
    setActiveMenu("general-chat");
    if (newChatTrigger) {
      newChatTrigger();
    }
    if (window.innerWidth < 768) setMobileSidebarOpen(false);
  };

  const handleSetNewChatTrigger = useCallback((trigger) => {
    setNewChatTrigger(() => trigger);
  }, []);

  // Menu items with memoization to prevent re-rendering
  const menuItems = useMemo(() => [
    {
      key: "general-chat",
      icon: <MessageOutlined />,
      label: "General Chat",
      component: <ChatInterfaceContent key="chat" onNewChat={handleSetNewChatTrigger} />,
    },
    {
      key: "commit-generator",
      icon: <CodeOutlined />,
      label: "Commit Generator",
      component: <CommitGenerator key="commit" />,
    },
    {
      key: "prompt-maker",
      icon: <BulbOutlined />,
      label: "Prompt Maker",
      component: <PromptMaker key="prompt" />,
    },
  ], [handleSetNewChatTrigger]);

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return then.toLocaleDateString();
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* New Chat Button */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #3C4043" }}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          style={{
            width: "100%",
            height: 44,
            borderRadius: "24px",
            border: "1px solid #5F6368",
            color: "#E8EAED",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "0 20px",
          }}
        >
          New chat
        </Button>
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: "16px 0", borderBottom: "1px solid #3C4043" }}>
        <div style={{ padding: "0 8px" }}>
          <Text
            style={{
              fontSize: 11,
              color: "#9AA0A6",
              fontWeight: 500,
              textTransform: "uppercase",
              paddingLeft: 8,
              display: "block",
              marginBottom: 8,
            }}
          >
            Features
          </Text>
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                if (window.innerWidth < 768) setMobileSidebarOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "0 24px 24px 0",
                margin: "2px 0",
                marginRight: 8,
                background: activeMenu === item.key ? "#292A2D" : "transparent",
                transition: "background 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.key) {
                  e.currentTarget.style.background = "#3C4043";
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.key) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: 18, color: activeMenu === item.key ? "#8AB4F8" : "#9AA0A6" }}>
                {item.icon}
              </span>
              <Text
                style={{
                  color: activeMenu === item.key ? "#E8EAED" : "#9AA0A6",
                  fontSize: 14,
                  fontWeight: activeMenu === item.key ? 500 : 400,
                }}
              >
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        <div style={{ padding: "8px 16px", marginBottom: 8 }}>
          <Text style={{ fontSize: 11, color: "#9AA0A6", fontWeight: 500, textTransform: "uppercase" }}>
            Recent Chats
          </Text>
        </div>
        {chatSessions.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center" }}>
            <Text style={{ color: "#9AA0A6", fontSize: 13 }}>No chats yet</Text>
          </div>
        ) : (
          chatSessions.map((session) => (
            <div
              key={session.id}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "0 24px 24px 0",
                margin: "2px 0",
                marginRight: 8,
                transition: "background 0.15s ease",
              }}
              onClick={() => {
                loadSession(session.id);
                setActiveMenu("general-chat");
                if (window.innerWidth < 768) setMobileSidebarOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#3C4043")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <Text
                    ellipsis
                    style={{
                      color: "#E8EAED",
                      fontSize: 14,
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    {session.title}
                  </Text>
                  <Text style={{ color: "#9AA0A6", fontSize: 12 }}>
                    {getRelativeTime(session.updatedAt)}
                  </Text>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  style={{ color: "#9AA0A6", opacity: 0, transition: "opacity 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom User Info & Logout */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #3C4043" }}>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 12px",
              background: "#292A2D",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserOutlined style={{ color: "#131314", fontSize: 16 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text
                strong
                style={{
                  color: "#E8EAED",
                  fontSize: 14,
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                {user?.name || "User"}
              </Text>
              <Text
                style={{
                  color: "#9AA0A6",
                  fontSize: 12,
                  display: "block",
                }}
              >
                @{user?.username || "user"}
              </Text>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={logout}
            style={{
              width: "100%",
              height: 40,
              borderRadius: "20px",
              color: "#F28B82",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0 16px",
            }}
          >
            Logout
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#131314" }}>
      {/* Sidebar - Desktop */}
      <Sider
        width={280}
        collapsedWidth={0}
        collapsed={sidebarCollapsed}
        breakpoint="md"
        onBreakpoint={(broken) => {
          if (broken) setSidebarCollapsed(true);
        }}
        style={{
          background: "#1E1F20",
          borderRight: "1px solid #3C4043",
          overflow: "hidden",
          position: "fixed",
          height: "100vh",
          left: 0,
          zIndex: 100,
        }}
        className="gemini-sidebar"
      >
        <SidebarContent />
      </Sider>

      {/* Sidebar - Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileSidebarOpen(false)}
        open={mobileSidebarOpen}
        width={280}
        bodyStyle={{ padding: 0, background: "#1E1F20" }}
        headerStyle={{ display: "none" }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Layout */}
      <Layout style={{ marginLeft: sidebarCollapsed ? 0 : 280, background: "#131314" }}>
        {/* Dark Gemini Header */}
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: "#1E1F20",
            borderBottom: "1px solid #3C4043",
            boxShadow: "none",
            height: 56,
            lineHeight: "56px",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <Space align="center" size={12}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              style={{
                fontSize: 20,
                color: "#E8EAED",
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
            />
            <Title
              level={4}
              style={{
                margin: 0,
                fontWeight: 400,
                fontSize: 22,
                color: "#E8EAED",
                letterSpacing: "-0.01em",
              }}
            >
              Gemini
            </Title>
          </Space>

          <Space size={4}>
            <Tooltip title="New chat">
              <Button
                type="text"
                size="middle"
                icon={<MessageOutlined />}
                onClick={handleNewChat}
                style={{
                  fontSize: 20,
                  color: "#9AA0A6",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                }}
              />
            </Tooltip>
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{ background: "#131314" }}>
          {menuItems.find((item) => item.key === activeMenu)?.component}
        </Content>
      </Layout>
    </Layout>
  );
}
