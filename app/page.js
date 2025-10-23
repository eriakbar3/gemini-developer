"use client";

import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ChatProvider } from "./components/ChatContext";
import { Spin } from "antd";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#131314",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? <MainLayout /> : <Login />;
}

export default function Home() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}
