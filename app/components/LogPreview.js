"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Layout,
  Button,
  Typography,
  Space,
  Card,
  Upload,
  Input,
  Tag,
  Empty,
  App,
  Segmented,
} from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UpOutlined,
  DownOutlined,
  FilterOutlined,
  AimOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export default function LogPreview() {
  const { message } = App.useApp();
  const [logContent, setLogContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [lineCount, setLineCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [matchedLines, setMatchedLines] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [searchMode, setSearchMode] = useState("goto"); // "goto" or "filter"
  const logContainerRef = useRef(null);
  const fullscreenLogRef = useRef(null);

  const handleFileUpload = (file) => {
    // Validasi ekstensi file
    const isLogFile = file.name.endsWith(".log") || file.name.endsWith(".txt");
    if (!isLogFile) {
      message.error("Hanya file .log atau .txt yang diperbolehkan!");
      return false;
    }

    // Validasi ukuran file (max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File harus lebih kecil dari 10MB!");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setLogContent(content);
      setFileName(file.name);
      setFileSize(file.size);
      setLineCount(content.split("\n").length);
      message.success(`File "${file.name}" berhasil dimuat!`);
    };
    reader.onerror = () => {
      message.error("Gagal membaca file!");
    };
    reader.readAsText(file);

    return false; // Prevent upload
  };

  const handleClear = () => {
    setLogContent("");
    setFileName("");
    setFileSize(0);
    setSearchText("");
    setLineCount(0);
    message.info("Log telah dibersihkan!");
  };

  const handleDownload = () => {
    if (!logContent) {
      message.warning("Tidak ada log untuk diunduh!");
      return;
    }

    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("File berhasil diunduh!");
  };

  const handleExportFiltered = () => {
    if (!logContent || matchedLines.length === 0) {
      message.warning("Tidak ada hasil filter untuk di-export!");
      return;
    }

    const lines = logContent.split("\n");
    const filteredContent = matchedLines
      .map((idx) => stripAnsi(lines[idx]))
      .join("\n");

    const blob = new Blob([filteredContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "log";
    a.download = `${baseName}_filtered.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`${matchedLines.length} baris berhasil di-export!`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Find all matching lines when search text changes
  useEffect(() => {
    if (!searchText || !logContent) {
      setMatchedLines([]);
      setCurrentMatchIndex(0);
      return;
    }

    const lines = logContent.split("\n").map((line) => stripAnsi(line));
    const matches = [];
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(searchText.toLowerCase())) {
        matches.push(idx);
      }
    });
    setMatchedLines(matches);
    setCurrentMatchIndex(0);

    // Auto scroll to first match (only in goto mode)
    if (matches.length > 0 && searchMode === "goto") {
      scrollToLine(matches[0]);
    }
  }, [searchText, logContent, searchMode]);

  // Scroll to specific line
  const scrollToLine = useCallback((lineIndex) => {
    const container = isFullscreen ? fullscreenLogRef.current : logContainerRef.current;
    if (!container) return;

    const lineElement = container.querySelector(`[data-line="${lineIndex}"]`);
    if (lineElement) {
      lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isFullscreen]);

  // Go to next match
  const goToNextMatch = () => {
    if (matchedLines.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % matchedLines.length;
    setCurrentMatchIndex(nextIndex);
    scrollToLine(matchedLines[nextIndex]);
  };

  // Go to previous match
  const goToPrevMatch = () => {
    if (matchedLines.length === 0) return;
    const prevIndex = (currentMatchIndex - 1 + matchedLines.length) % matchedLines.length;
    setCurrentMatchIndex(prevIndex);
    scrollToLine(matchedLines[prevIndex]);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Strip ANSI - moved before useEffect that uses it
  const stripAnsi = useCallback((text) => {
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1b\[[0-9;]*m/g, "").replace(/\[([0-9;]*)m/g, "");
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Parse structured log line
  const parseLogLine = (rawLine) => {
    const line = stripAnsi(rawLine);

    // Try to parse structured log format: timestamp [level] message [source] key=value pairs
    const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z?)\s*/);
    const levelMatch = line.match(/\[(info|warning|error|debug|success)\s*\]/i);
    const sourceMatch = line.match(/\[([^\]]+)\]\s*$/);

    let timestamp = "";
    let level = "";
    let source = "";
    let message = line;

    if (timestampMatch) {
      timestamp = timestampMatch[1];
      message = message.replace(timestampMatch[0], "");
    }

    if (levelMatch) {
      level = levelMatch[1].toLowerCase();
      message = message.replace(/\[(info|warning|error|debug|success)\s*\]/i, "");
    }

    // Extract source/module name
    const moduleMatch = message.match(/\[([A-Za-z._]+)\]/);
    if (moduleMatch) {
      source = moduleMatch[1];
      message = message.replace(moduleMatch[0], "");
    }

    // Clean up the message
    message = message.trim();

    return { timestamp, level, source, message, raw: line };
  };

  const getHighlightedContent = () => {
    if (!logContent) return null;

    const lines = logContent.split("\n");
    const cleanedLines = lines.map((line, idx) => ({ line: stripAnsi(line), originalIndex: idx }));

    // Filter lines if in filter mode with search text
    const linesToShow = searchMode === "filter" && searchText
      ? cleanedLines.filter(({ line }) => line.toLowerCase().includes(searchText.toLowerCase()))
      : cleanedLines;

    return linesToShow.map(({ line, originalIndex }) => {
      const idx = originalIndex;
      const parsed = parseLogLine(line);
      const isCurrentMatch = matchedLines[currentMatchIndex] === idx;
      const isMatch = matchedLines.includes(idx);

      // Deteksi level log
      let tagColor = null;
      let tagText = null;

      if (parsed.level === "error" || /\berror\b/i.test(line)) {
        tagColor = "red";
        tagText = "ERROR";
      } else if (parsed.level === "warning" || /\bwarn(ing)?\b/i.test(line)) {
        tagColor = "orange";
        tagText = "WARN";
      } else if (parsed.level === "info" || /\binfo\b/i.test(line)) {
        tagColor = "blue";
        tagText = "INFO";
      } else if (parsed.level === "debug" || /\bdebug\b/i.test(line)) {
        tagColor = "purple";
        tagText = "DEBUG";
      } else if (parsed.level === "success" || /\bsuccess\b/i.test(line)) {
        tagColor = "green";
        tagText = "SUCCESS";
      }

      // Highlight search text and format key=value pairs
      let displayLine = line;

      // Highlight key=value pairs
      displayLine = displayLine.replace(
        /(\w+)=([^\s\[]+|\[[^\]]*\]|'[^']*')/g,
        '<span style="color: #8AB4F8;">$1</span>=<span style="color: #81C995;">$2</span>'
      );

      // Highlight timestamps
      displayLine = displayLine.replace(
        /(\d{4}-\d{2}-\d{2}T[\d:.]+Z?)/g,
        '<span style="color: #9AA0A6;">$1</span>'
      );

      // Highlight module/source names in brackets
      displayLine = displayLine.replace(
        /\[([A-Za-z._]+)\]/g,
        '[<span style="color: #C58AF9;">$1</span>]'
      );

      // Highlight search text
      if (searchText) {
        const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escapedSearch})`, "gi");
        displayLine = displayLine.replace(
          regex,
          '<mark style="background: #FBBC04; color: #131314; padding: 0 2px; border-radius: 2px;">$1</mark>'
        );
      }

      return (
        <div
          key={idx}
          data-line={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: "6px 0",
            borderBottom: "1px solid #2A2B2E",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: 12,
            lineHeight: 1.5,
            background: isCurrentMatch
              ? "rgba(251, 188, 4, 0.2)"
              : isMatch
              ? "rgba(138, 180, 248, 0.1)"
              : "transparent",
            borderLeft: isCurrentMatch
              ? "3px solid #FBBC04"
              : isMatch
              ? "3px solid #8AB4F8"
              : "3px solid transparent",
            marginLeft: -3,
            paddingLeft: 3,
          }}
        >
          <span
            style={{
              color: isCurrentMatch ? "#FBBC04" : "#5F6368",
              minWidth: 45,
              textAlign: "right",
              userSelect: "none",
              fontSize: 11,
              fontWeight: isCurrentMatch ? 600 : 400,
            }}
          >
            {idx + 1}
          </span>
          {tagText && (
            <Tag
              color={tagColor}
              style={{
                margin: 0,
                fontSize: 9,
                padding: "0 6px",
                lineHeight: "16px",
                fontWeight: 600,
                minWidth: 50,
                textAlign: "center",
              }}
            >
              {tagText}
            </Tag>
          )}
          {!tagText && <span style={{ minWidth: 50 }} />}
          <span
            style={{
              color: "#E8EAED",
              flex: 1,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{ __html: displayLine || "&nbsp;" }}
          />
        </div>
      );
    });
  };

  const getStats = () => {
    if (!logContent) return { errors: 0, warnings: 0, info: 0 };

    const lines = logContent.split("\n").map((l) => stripAnsi(l));
    return {
      errors: lines.filter((l) => /\berror\b/i.test(l)).length,
      warnings: lines.filter((l) => /\bwarn(ing)?\b/i.test(l)).length,
      info: lines.filter((l) => /\binfo\b/i.test(l)).length,
    };
  };

  const stats = getStats();

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
            <FileTextOutlined
              style={{ fontSize: 48, color: "#8AB4F8", marginBottom: 16 }}
            />
            <Title level={2} style={{ color: "#E8EAED", marginBottom: 8 }}>
              Log Preview
            </Title>
            <Text style={{ color: "#9AA0A6", fontSize: 16 }}>
              Upload dan preview file .log dengan syntax highlighting
            </Text>
          </div>

          {/* Upload Area */}
          <Card
            style={{
              background: "#1E1F20",
              border: "1px solid #3C4043",
              marginBottom: 24,
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Upload.Dragger
                accept=".log,.txt"
                showUploadList={false}
                beforeUpload={handleFileUpload}
                style={{
                  background: "#292A2D",
                  border: "2px dashed #5F6368",
                  borderRadius: 12,
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: "#8AB4F8" }} />
                </p>
                <p style={{ color: "#E8EAED", fontSize: 16, margin: "16px 0 8px" }}>
                  Klik atau drag file ke area ini
                </p>
                <p style={{ color: "#9AA0A6", fontSize: 14 }}>
                  Support: .log, .txt (Max 10MB)
                </p>
              </Upload.Dragger>

              {/* File Info & Actions */}
              {fileName && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <Space size={16}>
                    <Text style={{ color: "#E8EAED" }}>
                      <FileTextOutlined style={{ marginRight: 8 }} />
                      {fileName}
                    </Text>
                    <Tag color="blue">{formatFileSize(fileSize)}</Tag>
                    <Tag color="green">{lineCount} baris</Tag>
                  </Space>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownload}
                      style={{
                        background: "#292A2D",
                        border: "1px solid #5F6368",
                        color: "#E8EAED",
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      icon={<ClearOutlined />}
                      onClick={handleClear}
                      danger
                    >
                      Clear
                    </Button>
                  </Space>
                </div>
              )}
            </Space>
          </Card>

          {/* Log Content */}
          {logContent ? (
            <Card
              style={{
                background: "#1E1F20",
                border: "1px solid #3C4043",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                {/* Search & Stats */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <Space>
                    <Segmented
                      value={searchMode}
                      onChange={setSearchMode}
                      options={[
                        { value: "goto", icon: <AimOutlined />, label: "Go to" },
                        { value: "filter", icon: <FilterOutlined />, label: "Filter" },
                      ]}
                      style={{
                        background: "#292A2D",
                      }}
                    />
                    <Search
                      placeholder={searchMode === "goto" ? "Go to line..." : "Filter lines..."}
                      allowClear
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 200 }}
                      prefix={<SearchOutlined style={{ color: "#5F6368" }} />}
                    />
                    {searchMode === "goto" && matchedLines.length > 0 && (
                      <>
                        <Text style={{ color: "#9AA0A6", fontSize: 12 }}>
                          {currentMatchIndex + 1} / {matchedLines.length}
                        </Text>
                        <Button
                          icon={<UpOutlined />}
                          size="small"
                          onClick={goToPrevMatch}
                          style={{
                            background: "#292A2D",
                            border: "1px solid #5F6368",
                            color: "#E8EAED",
                          }}
                        />
                        <Button
                          icon={<DownOutlined />}
                          size="small"
                          onClick={goToNextMatch}
                          style={{
                            background: "#292A2D",
                            border: "1px solid #5F6368",
                            color: "#E8EAED",
                          }}
                        />
                      </>
                    )}
                    {searchMode === "filter" && searchText && (
                      <>
                        <Tag color="blue">{matchedLines.length} hasil</Tag>
                        <Button
                          icon={<ExportOutlined />}
                          size="small"
                          onClick={handleExportFiltered}
                          disabled={matchedLines.length === 0}
                          style={{
                            background: "#81C995",
                            border: "none",
                            color: "#131314",
                          }}
                        >
                          Export
                        </Button>
                      </>
                    )}
                  </Space>
                  <Space>
                    <Tag color="red">{stats.errors} Error</Tag>
                    <Tag color="orange">{stats.warnings} Warning</Tag>
                    <Tag color="blue">{stats.info} Info</Tag>
                    <Button
                      icon={<FullscreenOutlined />}
                      onClick={toggleFullscreen}
                      style={{
                        background: "#292A2D",
                        border: "1px solid #5F6368",
                        color: "#E8EAED",
                      }}
                    >
                      Fullscreen
                    </Button>
                  </Space>
                </div>

                {/* Log Lines */}
                <div
                  ref={logContainerRef}
                  style={{
                    background: "#131314",
                    padding: "16px",
                    borderRadius: 8,
                    maxHeight: "500px",
                    overflowY: "auto",
                    border: "1px solid #3C4043",
                  }}
                >
                  {getHighlightedContent()}
                </div>

                <Text
                  style={{ color: "#9AA0A6", fontSize: 12, display: "block" }}
                >
                  📄 Log Preview • {searchText
                    ? searchMode === "filter"
                      ? `Menampilkan ${matchedLines.length} dari ${lineCount} baris`
                      : `${matchedLines.length} hasil ditemukan untuk "${searchText}"`
                    : `Total ${lineCount} baris`}
                </Text>
              </Space>
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
                    Upload file .log untuk melihat preview
                  </Text>
                }
              />
            </Card>
          )}
        </div>
      </Content>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#131314",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Fullscreen Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              background: "#1E1F20",
              borderBottom: "1px solid #3C4043",
            }}
          >
            <Space size={16}>
              <FileTextOutlined style={{ fontSize: 20, color: "#8AB4F8" }} />
              <Text style={{ color: "#E8EAED", fontSize: 16, fontWeight: 500 }}>
                {fileName}
              </Text>
              <Tag color="blue">{formatFileSize(fileSize)}</Tag>
              <Tag color="green">{lineCount} baris</Tag>
            </Space>
            <Space size={12}>
              <Segmented
                value={searchMode}
                onChange={setSearchMode}
                options={[
                  { value: "goto", icon: <AimOutlined />, label: "Go to" },
                  { value: "filter", icon: <FilterOutlined />, label: "Filter" },
                ]}
                style={{
                  background: "#292A2D",
                }}
              />
              <Search
                placeholder={searchMode === "goto" ? "Go to line..." : "Filter lines..."}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
                prefix={<SearchOutlined style={{ color: "#5F6368" }} />}
              />
              {searchMode === "goto" && matchedLines.length > 0 && (
                <>
                  <Text style={{ color: "#9AA0A6", fontSize: 12 }}>
                    {currentMatchIndex + 1} / {matchedLines.length}
                  </Text>
                  <Button
                    icon={<UpOutlined />}
                    size="small"
                    onClick={goToPrevMatch}
                    style={{
                      background: "#292A2D",
                      border: "1px solid #5F6368",
                      color: "#E8EAED",
                    }}
                  />
                  <Button
                    icon={<DownOutlined />}
                    size="small"
                    onClick={goToNextMatch}
                    style={{
                      background: "#292A2D",
                      border: "1px solid #5F6368",
                      color: "#E8EAED",
                    }}
                  />
                </>
              )}
              {searchMode === "filter" && searchText && (
                <>
                  <Tag color="blue">{matchedLines.length} hasil</Tag>
                  <Button
                    icon={<ExportOutlined />}
                    size="small"
                    onClick={handleExportFiltered}
                    disabled={matchedLines.length === 0}
                    style={{
                      background: "#81C995",
                      border: "none",
                      color: "#131314",
                    }}
                  >
                    Export
                  </Button>
                </>
              )}
              <Tag color="red">{stats.errors} Error</Tag>
              <Tag color="orange">{stats.warnings} Warning</Tag>
              <Tag color="blue">{stats.info} Info</Tag>
              <Button
                icon={<FullscreenExitOutlined />}
                onClick={toggleFullscreen}
                style={{
                  background: "#8AB4F8",
                  border: "none",
                  color: "#131314",
                }}
              >
                Exit
              </Button>
            </Space>
          </div>

          {/* Fullscreen Log Content */}
          <div
            ref={fullscreenLogRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 24px",
              background: "#131314",
            }}
          >
            {getHighlightedContent()}
          </div>

          {/* Fullscreen Footer */}
          <div
            style={{
              padding: "12px 24px",
              background: "#1E1F20",
              borderTop: "1px solid #3C4043",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#9AA0A6", fontSize: 12 }}>
              📄 Log Preview • {searchText
                ? searchMode === "filter"
                  ? `Menampilkan ${matchedLines.length} dari ${lineCount} baris`
                  : `${matchedLines.length} hasil ditemukan untuk "${searchText}"`
                : `Total ${lineCount} baris`}
            </Text>
            <Text style={{ color: "#5F6368", fontSize: 12 }}>
              Tekan ESC atau klik Exit untuk keluar dari fullscreen
            </Text>
          </div>
        </div>
      )}
    </Layout>
  );
}
