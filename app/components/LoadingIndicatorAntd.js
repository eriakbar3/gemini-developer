"use client";

import { Space, Avatar, Card, Spin } from "antd";
import { RobotOutlined, LoadingOutlined } from "@ant-design/icons";

export default function LoadingIndicatorAntd() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 16,
      }}
    >
      <Space align="start">
        <Avatar
          size={40}
          icon={<RobotOutlined />}
          style={{
            background: "linear-gradient(135deg, #1890ff 0%, #52c41a 100%)",
          }}
        />

        <Card
          style={{
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #d9d9d9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            minWidth: 120,
          }}
          bodyStyle={{ padding: "12px 16px" }}
        >
          <Space size="small">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
            />
            <span style={{ color: "#8c8c8c", fontSize: 14 }}>
              Thinking...
            </span>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
