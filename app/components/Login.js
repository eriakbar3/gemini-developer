"use client";

import { useState } from "react";
import { Layout, Input, Button, Card, Typography, Space, Alert, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, RobotOutlined } from "@ant-design/icons";
import { useAuth } from "./AuthContext";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);

    // Simulate delay for better UX
    setTimeout(() => {
      const result = login(username, password);

      if (result.success) {
        // Authentication successful - context will handle redirect
      } else {
        setError(result.error);
        setPassword("");
      }

      setLoading(false);
    }, 500);
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #131314 0%, #1E1F20 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Content style={{ maxWidth: 480, width: "100%", padding: "20px" }}>
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 8px 24px rgba(138, 180, 248, 0.3)",
            }}
          >
            <RobotOutlined style={{ fontSize: 40, color: "#131314" }} />
          </div>
          <Title
            level={2}
            style={{
              color: "#E8EAED",
              marginBottom: 8,
              fontWeight: 400,
              fontSize: 32,
            }}
          >
            Welcome to Gemini
          </Title>
          <Text style={{ color: "#9AA0A6", fontSize: 16 }}>
            Sign in to continue
          </Text>
        </div>

        {/* Login Card */}
        <Card
          style={{
            background: "#1E1F20",
            border: "1px solid #3C4043",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
          bodyStyle={{ padding: "32px" }}
        >
          <form onSubmit={handleLogin}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Error Alert */}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError("")}
                  style={{
                    background: "#3C1F1F",
                    border: "1px solid #F28B82",
                    borderRadius: "12px",
                  }}
                />
              )}

              {/* Username Input */}
              <div>
                <Text
                  strong
                  style={{
                    color: "#E8EAED",
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Username
                </Text>
                <Input
                  size="large"
                  prefix={<UserOutlined style={{ color: "#9AA0A6" }} />}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  style={{
                    background: "#292A2D",
                    border: "1px solid #3C4043",
                    color: "#E8EAED",
                    borderRadius: "12px",
                    height: 48,
                  }}
                />
              </div>

              {/* Password Input */}
              <div>
                <Text
                  strong
                  style={{
                    color: "#E8EAED",
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Password
                </Text>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: "#9AA0A6" }} />}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    background: "#292A2D",
                    border: "1px solid #3C4043",
                    color: "#E8EAED",
                    borderRadius: "12px",
                    height: 48,
                  }}
                />
              </div>

              {/* Login Button */}
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<LoginOutlined />}
                loading={loading}
                block
                style={{
                  background: "linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%)",
                  border: "none",
                  borderRadius: "24px",
                  height: 52,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#131314",
                  marginTop: 8,
                }}
              >
                Sign In
              </Button>
            </Space>
          </form>

          <Divider style={{ borderColor: "#3C4043", margin: "24px 0" }}>
            <Text style={{ color: "#9AA0A6", fontSize: 12 }}>OR USE DEMO ACCOUNTS</Text>
          </Divider>

          {/* Quick Login Buttons */}
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Button
              type="text"
              onClick={() => quickLogin("admin", "admin123")}
              disabled={loading}
              block
              style={{
                background: "#292A2D",
                border: "1px solid #3C4043",
                color: "#E8EAED",
                borderRadius: "12px",
                height: 44,
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                Admin Account
              </span>
              <Text style={{ color: "#9AA0A6", fontSize: 12 }}>admin / admin123</Text>
            </Button>

            <Button
              type="text"
              onClick={() => quickLogin("user", "user123")}
              disabled={loading}
              block
              style={{
                background: "#292A2D",
                border: "1px solid #3C4043",
                color: "#E8EAED",
                borderRadius: "12px",
                height: 44,
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                User Account
              </span>
              <Text style={{ color: "#9AA0A6", fontSize: 12 }}>user / user123</Text>
            </Button>

            <Button
              type="text"
              onClick={() => quickLogin("demo", "demo123")}
              disabled={loading}
              block
              style={{
                background: "#292A2D",
                border: "1px solid #3C4043",
                color: "#E8EAED",
                borderRadius: "12px",
                height: 44,
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                Demo Account
              </span>
              <Text style={{ color: "#9AA0A6", fontSize: 12 }}>demo / demo123</Text>
            </Button>
          </Space>
        </Card>

        {/* Footer Info */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text style={{ color: "#9AA0A6", fontSize: 13 }}>
            🔒 Secure authentication with static credentials
          </Text>
        </div>
      </Content>
    </Layout>
  );
}
