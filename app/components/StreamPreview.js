"use client";

import { useState, useEffect, useRef } from "react";
import {
  Layout,
  Button,
  Typography,
  Space,
  Card,
  Input,
  Tag,
  Empty,
  App,
  Tooltip,
} from "antd";
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClearOutlined,
  CopyOutlined,
  CheckOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function StreamPreview() {
  const { message } = App.useApp();
  const [inputText, setInputText] = useState("");
  const [events, setEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const eventsContainerRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Parse SSE data from input
  const parseSSEData = (text) => {
    const lines = text.trim().split("\n");
    const parsedEvents = [];

    lines.forEach((line) => {
      if (line.startsWith("data: ")) {
        try {
          const jsonStr = line.substring(6); // Remove "data: " prefix
          const data = JSON.parse(jsonStr);
          parsedEvents.push(data);
        } catch (e) {
          // Skip invalid JSON
          console.error("Failed to parse:", line);
        }
      }
    });

    return parsedEvents;
  };

  // Handle input change and parse events
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (text.trim()) {
      const parsed = parseSSEData(text);
      setEvents(parsed);
      setCurrentIndex(0);
      setIsPlaying(false);
    } else {
      setEvents([]);
      setCurrentIndex(0);
    }
  };

  // Play animation
  const handlePlay = () => {
    if (events.length === 0) {
      message.warning("Tidak ada event untuk diputar!");
      return;
    }

    setIsPlaying(true);
    setCurrentIndex(0);
  };

  // Stop animation
  const handleStop = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  // Reset to beginning
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  // Clear all
  const handleClear = () => {
    setInputText("");
    setEvents([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    message.info("Data telah dibersihkan!");
  };

  // Copy final result
  const handleCopyResult = async () => {
    const finalEvent = events.find((e) => e.type === "final_result");
    if (!finalEvent) {
      message.warning("Tidak ada hasil akhir untuk disalin!");
      return;
    }

    try {
      const resultText = JSON.stringify(finalEvent.data, null, 2);
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      message.success("Hasil berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error("Gagal menyalin hasil!");
    }
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && currentIndex < events.length) {
      playIntervalRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1000); // 1 second delay between events
    } else if (currentIndex >= events.length) {
      setIsPlaying(false);
    }

    return () => {
      if (playIntervalRef.current) {
        clearTimeout(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, events.length]);

  // Auto scroll to latest event
  useEffect(() => {
    if (eventsContainerRef.current && currentIndex > 0) {
      eventsContainerRef.current.scrollTop = eventsContainerRef.current.scrollHeight;
    }
  }, [currentIndex]);

  // Get level color and icon
  const getLevelInfo = (level) => {
    switch (level?.toUpperCase()) {
      case "ERROR":
        return { color: "#F28B82", bgColor: "rgba(242, 139, 130, 0.1)", icon: <WarningOutlined /> };
      case "WARNING":
        return { color: "#FDD663", bgColor: "rgba(253, 214, 99, 0.1)", icon: <WarningOutlined /> };
      case "INFO":
        return { color: "#8AB4F8", bgColor: "rgba(138, 180, 248, 0.1)", icon: <InfoCircleOutlined /> };
      case "DEBUG":
        return { color: "#C58AF9", bgColor: "rgba(197, 138, 249, 0.1)", icon: <CodeOutlined /> };
      case "SUCCESS":
        return { color: "#81C995", bgColor: "rgba(129, 201, 149, 0.1)", icon: <CheckCircleOutlined /> };
      default:
        return { color: "#9AA0A6", bgColor: "rgba(154, 160, 166, 0.1)", icon: <InfoCircleOutlined /> };
    }
  };

  // Get type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "thinking":
        return <Tag color="processing" icon={<LoadingOutlined spin />}>Thinking</Tag>;
      case "final_result":
        return <Tag color="success" icon={<CheckCircleOutlined />}>Final Result</Tag>;
      case "error":
        return <Tag color="error" icon={<WarningOutlined />}>Error</Tag>;
      case "data":
        return <Tag color="blue" icon={<DatabaseOutlined />}>Data</Tag>;
      default:
        return <Tag color="default">{type || "Unknown"}</Tag>;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });
    } catch {
      return timestamp;
    }
  };

  // Render event card
  const renderEvent = (event, index) => {
    const levelInfo = getLevelInfo(event.level);
    const isVisible = index < currentIndex || !isPlaying;

    if (!isVisible && isPlaying) return null;

    return (
      <div
        key={index}
        style={{
          background: levelInfo.bgColor,
          border: `1px solid ${levelInfo.color}33`,
          borderLeft: `4px solid ${levelInfo.color}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
          animation: isPlaying && index === currentIndex - 1 ? "fadeIn 0.3s ease-in" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Space>
            {getTypeBadge(event.type)}
            <Tag color={event.level?.toLowerCase() === "warning" ? "warning" : event.level?.toLowerCase() === "error" ? "error" : "default"}>
              {event.level || "INFO"}
            </Tag>
          </Space>
          <Text style={{ color: "#9AA0A6", fontSize: 11, fontFamily: "monospace" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {formatTimestamp(event.timestamp)}
          </Text>
        </div>

        <Text style={{ color: "#E8EAED", fontSize: 14, display: "block", marginBottom: event.data ? 12 : 0 }}>
          {event.message}
        </Text>

        {/* Render additional data for final_result */}
        {event.type === "final_result" && event.data && (
          <div style={{ marginTop: 12 }}>
            {/* Result message */}
            {event.data.result && (
              <div
                style={{
                  background: "#1E1F20",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#81C995", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Result:
                </Text>
                <Text style={{ color: "#E8EAED", fontSize: 13, whiteSpace: "pre-wrap" }}>
                  {event.data.result}
                </Text>
              </div>
            )}

            {/* SQL Query */}
            {event.data.sql && (
              <div
                style={{
                  background: "#1E1F20",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#8AB4F8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  <CodeOutlined style={{ marginRight: 4 }} />
                  SQL Query:
                </Text>
                <pre
                  style={{
                    color: "#C58AF9",
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {event.data.sql}
                </pre>
              </div>
            )}

            {/* Metadata */}
            <Space wrap style={{ marginTop: 8 }}>
              {event.data.row_count !== undefined && (
                <Tag color="blue">
                  <DatabaseOutlined style={{ marginRight: 4 }} />
                  {event.data.row_count} rows
                </Tag>
              )}
              {event.data.chart_available !== undefined && (
                <Tag color={event.data.chart_available ? "green" : "default"}>
                  Chart: {event.data.chart_available ? "Yes" : "No"}
                </Tag>
              )}
              {event.data.data_available !== undefined && (
                <Tag color={event.data.data_available ? "green" : "warning"}>
                  Data: {event.data.data_available ? "Available" : "Not Available"}
                </Tag>
              )}
            </Space>
          </div>
        )}
      </div>
    );
  };

  const visibleEvents = isPlaying ? events.slice(0, currentIndex) : events;

  return (
    <Layout style={{ height: "calc(100vh - 56px)", background: "#131314" }}>
      <Content
        style={{
          padding: "24px 20px",
          overflowY: "auto",
          background: "#131314",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <ThunderboltOutlined
              style={{ fontSize: 48, color: "#8AB4F8", marginBottom: 16 }}
            />
            <Title level={2} style={{ color: "#E8EAED", marginBottom: 8 }}>
              Stream Preview
            </Title>
            <Text style={{ color: "#9AA0A6", fontSize: 16 }}>
              Preview dan visualisasi streaming response (SSE)
            </Text>
          </div>

          {/* Input Area */}
          <Card
            style={{
              background: "#1E1F20",
              border: "1px solid #3C4043",
              marginBottom: 24,
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div>
                <Text strong style={{ color: "#E8EAED", marginBottom: 8, display: "block" }}>
                  Paste SSE Response Data
                </Text>
                <TextArea
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={'Paste streaming data here...\n\nFormat: data: {"timestamp": "...", "level": "INFO", "message": "...", "type": "thinking"}'}
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  className="custom-textarea"
                  style={{
                    background: "#292A2D",
                    border: "1px solid #3C4043",
                    color: "#E8EAED",
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
              </div>

              {/* Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <Space>
                  {!isPlaying ? (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={handlePlay}
                      disabled={events.length === 0}
                      style={{
                        background: "#8AB4F8",
                        border: "none",
                        color: "#131314",
                      }}
                    >
                      Play
                    </Button>
                  ) : (
                    <Button
                      icon={<PauseCircleOutlined />}
                      onClick={handleStop}
                      style={{
                        background: "#FDD663",
                        border: "none",
                        color: "#131314",
                      }}
                    >
                      Pause
                    </Button>
                  )}
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleReset}
                    disabled={events.length === 0}
                    style={{
                      background: "#292A2D",
                      border: "1px solid #5F6368",
                      color: "#E8EAED",
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleClear}
                    danger
                  >
                    Clear All
                  </Button>
                </Space>

                <Space>
                  {events.length > 0 && (
                    <>
                      <Tag color="blue">{events.length} events</Tag>
                      {isPlaying && (
                        <Tag color="processing" icon={<LoadingOutlined spin />}>
                          {currentIndex} / {events.length}
                        </Tag>
                      )}
                    </>
                  )}
                  {events.some((e) => e.type === "final_result") && (
                    <Tooltip title="Copy final result">
                      <Button
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={handleCopyResult}
                        style={{
                          background: copied ? "#81C995" : "#292A2D",
                          border: "1px solid #5F6368",
                          color: copied ? "#131314" : "#E8EAED",
                        }}
                      >
                        {copied ? "Copied!" : "Copy Result"}
                      </Button>
                    </Tooltip>
                  )}
                </Space>
              </div>
            </Space>
          </Card>

          {/* Events Preview */}
          {events.length > 0 ? (
            <Card
              style={{
                background: "#1E1F20",
                border: "1px solid #3C4043",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text strong style={{ color: "#E8EAED", fontSize: 16 }}>
                  Stream Events
                </Text>
                <Space>
                  <Tag color="blue">{events.filter((e) => e.type === "thinking").length} thinking</Tag>
                  <Tag color="success">{events.filter((e) => e.type === "final_result").length} final</Tag>
                  <Tag color="warning">{events.filter((e) => e.level === "WARNING").length} warnings</Tag>
                </Space>
              </div>

              <div
                ref={eventsContainerRef}
                style={{
                  maxHeight: 500,
                  overflowY: "auto",
                  padding: "8px 0",
                }}
              >
                {visibleEvents.map((event, index) => renderEvent(event, index))}
              </div>

              <Text style={{ color: "#9AA0A6", fontSize: 12, display: "block", marginTop: 12 }}>
                ⚡ Stream Preview • {isPlaying ? `Playing ${currentIndex}/${events.length}` : `${events.length} events total`}
              </Text>
            </Card>
          ) : (
            <Card
              style={{
                background: "#1E1F20",
                border: "1px solid #3C4043",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text style={{ color: "#9AA0A6" }}>
                    Paste SSE response data untuk melihat preview
                  </Text>
                }
              />
            </Card>
          )}
        </div>
      </Content>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
}
