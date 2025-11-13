"use client";

import { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  Card,
  message,
  Radio,
} from "antd";
import {
  CopyOutlined,
  CheckOutlined,
  SwapOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function Base64Tool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    if (!inputText.trim()) {
      message.warning("Silakan masukkan teks terlebih dahulu!");
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      message.success("Berhasil di-encode ke Base64!");
    } catch (error) {
      console.error("Encode error:", error);
      message.error("Gagal encode. Pastikan teks valid!");
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      message.warning("Silakan masukkan teks Base64 terlebih dahulu!");
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(inputText.trim())));
      setOutputText(decoded);
      message.success("Berhasil di-decode dari Base64!");
    } catch (error) {
      console.error("Decode error:", error);
      message.error("Gagal decode. Pastikan Base64 valid!");
    }
  };

  const handleProcess = () => {
    if (mode === "encode") {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      message.warning("Tidak ada hasil untuk disalin!");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      message.success("Hasil berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error("Gagal menyalin hasil");
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText("");
    setMode(mode === "encode" ? "decode" : "encode");
    message.info("Input dan output ditukar!");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    message.info("Input dan output dibersihkan!");
  };

  return (
    <Layout style={{ height: "calc(100vh - 56px)", background: "#131314" }}>
      <Content
        style={{
          padding: "24px 20px",
          overflowY: "auto",
          background: "#131314",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <LockOutlined
              style={{ fontSize: 48, color: "#8AB4F8", marginBottom: 16 }}
            />
            <Title level={2} style={{ color: "#E8EAED", marginBottom: 8 }}>
              Base64 Encoder/Decoder
            </Title>
            <Text style={{ color: "#9AA0A6", fontSize: 16 }}>
              Encode dan decode teks ke/dari Base64
            </Text>
          </div>

          {/* Mode Selection */}
          <Card
            style={{
              background: "#1E1F20",
              border: "1px solid #3C4043",
              marginBottom: 24,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Text strong style={{ color: "#E8EAED", marginRight: 16 }}>
                Mode:
              </Text>
              <Radio.Group
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="encode">
                  <LockOutlined style={{ marginRight: 8 }} />
                  Encode
                </Radio.Button>
                <Radio.Button value="decode">
                  <UnlockOutlined style={{ marginRight: 8 }} />
                  Decode
                </Radio.Button>
              </Radio.Group>
            </div>
          </Card>

          {/* Input */}
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
                  {mode === "encode" ? "Input Teks" : "Input Base64"}
                </Text>
                <TextArea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    mode === "encode"
                      ? "Masukkan teks yang ingin di-encode..."
                      : "Masukkan Base64 yang ingin di-decode..."
                  }
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  className="custom-textarea"
                  style={{
                    background: "#292A2D",
                    border: "1px solid #3C4043",
                    color: "#E8EAED",
                    fontSize: 15,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <Space style={{ width: "100%" }} size={12}>
                <Button
                  type="primary"
                  size="large"
                  icon={mode === "encode" ? <LockOutlined /> : <UnlockOutlined />}
                  onClick={handleProcess}
                  style={{
                    flex: 1,
                    background: "#8AB4F8",
                    border: "none",
                    borderRadius: "24px",
                    height: 48,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#131314",
                  }}
                >
                  {mode === "encode" ? "Encode ke Base64" : "Decode dari Base64"}
                </Button>
                <Button
                  size="large"
                  icon={<SwapOutlined />}
                  onClick={handleSwap}
                  disabled={!outputText}
                  style={{
                    borderRadius: "24px",
                    height: 48,
                    background: "#292A2D",
                    border: "1px solid #5F6368",
                    color: "#E8EAED",
                  }}
                >
                  Tukar
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Output */}
          {outputText && (
            <Card
              style={{
                background: "#1E1F20",
                border: "1px solid #3C4043",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ color: "#E8EAED" }}>
                    {mode === "encode" ? "Hasil Encode (Base64)" : "Hasil Decode (Teks)"}
                  </Text>
                  <Space>
                    <Button
                      type="text"
                      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={handleCopy}
                      style={{
                        color: copied ? "#81C995" : "#8AB4F8",
                        borderRadius: "20px",
                      }}
                    >
                      {copied ? "Tersalin!" : "Salin"}
                    </Button>
                    <Button
                      type="text"
                      onClick={handleClear}
                      style={{
                        color: "#EA4335",
                        borderRadius: "20px",
                      }}
                    >
                      Bersihkan
                    </Button>
                  </Space>
                </div>
                <div
                  style={{
                    background: "#292A2D",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid #3C4043",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  <Text
                    style={{
                      color: "#E8EAED",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {outputText}
                  </Text>
                </div>
                <Text
                  type="secondary"
                  style={{ color: "#9AA0A6", fontSize: 12, display: "block" }}
                >
                  🔒 Base64 Tool • {outputText.length} karakter
                </Text>
              </Space>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
}
