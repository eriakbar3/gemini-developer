"use client";

import { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Card,
  message,
} from "antd";
import {
  CopyOutlined,
  CheckOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function PromptMaker() {
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState("indonesian");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const languageOptions = [
    { value: "indonesian", label: "Bahasa Indonesia" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" },
    { value: "german", label: "Deutsch" },
    { value: "japanese", label: "日本語" },
    { value: "korean", label: "한국어" },
    { value: "chinese", label: "中文" },
  ];

  const generatePrompt = async () => {
    if (!inputText.trim()) {
      message.warning("Silakan masukkan teks terlebih dahulu!");
      return;
    }

    setLoading(true);
    setGeneratedPrompt("");

    try {
      const response = await fetch("/api/prompt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGeneratedPrompt(data.prompt);
        message.success("Prompt berhasil di-generate!");
      } else {
        message.error(data.error || "Gagal membuat prompt");
      }
    } catch (error) {
      console.error("Generate prompt error:", error);
      message.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      message.success("Prompt berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error("Gagal menyalin prompt");
    }
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
            <BulbOutlined
              style={{ fontSize: 48, color: "#8AB4F8", marginBottom: 16 }}
            />
            <Title level={2} style={{ color: "#E8EAED", marginBottom: 8 }}>
              Prompt Maker
            </Title>
            <Text style={{ color: "#9AA0A6", fontSize: 16 }}>
              Buat prompt yang lebih baik dengan bantuan AI
            </Text>
          </div>

          {/* Input Form */}
          <Card
            style={{
              background: "#1E1F20",
              border: "1px solid #3C4043",
              marginBottom: 24,
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              {/* Language Selection */}
              <div>
                <Text strong style={{ color: "#E8EAED", marginBottom: 8, display: "block" }}>
                  Bahasa Output Prompt
                </Text>
                <Select
                  value={language}
                  onChange={setLanguage}
                  style={{ width: "100%" }}
                  size="large"
                >
                  {languageOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Input Text */}
              <div>
                <Text strong style={{ color: "#E8EAED", marginBottom: 8, display: "block" }}>
                  Apa yang ingin Anda tanyakan?
                </Text>
                <TextArea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Masukkan teks atau pertanyaan Anda..."
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  style={{
                    background: "#292A2D",
                    border: "1px solid #3C4043",
                    color: "#E8EAED",
                    fontSize: 15,
                  }}
                />
              </div>

              {/* Generate Button */}
              <Button
                type="primary"
                size="large"
                icon={<BulbOutlined />}
                onClick={generatePrompt}
                loading={loading}
                disabled={loading}
                block
                style={{
                  background: "#8AB4F8",
                  border: "none",
                  borderRadius: "24px",
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#131314",
                }}
              >
                {loading ? "Sedang membuat prompt..." : "Buat Prompt dengan AI"}
              </Button>
            </Space>
          </Card>

          {/* Generated Prompt */}
          {generatedPrompt && (
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
                    Generated Prompt
                  </Text>
                  <Button
                    type="text"
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopy}
                    style={{
                      color: copied ? "#81C995" : "#8AB4F8",
                      borderRadius: "20px",
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div
                  style={{
                    background: "#292A2D",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid #3C4043",
                  }}
                >
                  <Paragraph
                    style={{
                      color: "#E8EAED",
                      marginBottom: 0,
                      whiteSpace: "pre-wrap",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {generatedPrompt}
                  </Paragraph>
                </div>
                <Text
                  type="secondary"
                  style={{ color: "#9AA0A6", fontSize: 12, display: "block" }}
                >
                  🤖 Dibuat oleh Gemini AI • 💡 Salin dan gunakan prompt ini di chat AI manapun
                </Text>
              </Space>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
}
