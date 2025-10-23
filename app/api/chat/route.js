import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Initialize Gemini API
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Path to chat history file
const CHAT_HISTORY_PATH = path.join(process.cwd(), "data", "chat-history.json");

// Ensure chat history file exists
function ensureChatHistoryExists() {
  const dataDir = path.dirname(CHAT_HISTORY_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(CHAT_HISTORY_PATH)) {
    fs.writeFileSync(CHAT_HISTORY_PATH, JSON.stringify({ conversations: [] }, null, 2));
  }
}

// Read chat history
function readChatHistory() {
  ensureChatHistoryExists();
  const data = fs.readFileSync(CHAT_HISTORY_PATH, "utf8");
  return JSON.parse(data);
}

// Write chat history
function writeChatHistory(data) {
  ensureChatHistoryExists();
  fs.writeFileSync(CHAT_HISTORY_PATH, JSON.stringify(data, null, 2));
}

// POST endpoint - Send message and get AI response
export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Generate response from Gemini using @google/genai
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const aiResponse = response.text;

    // Save to chat history
    const chatHistory = readChatHistory();
    chatHistory.conversations.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userMessage: message,
      aiResponse: aiResponse,
    });
    writeChatHistory(chatHistory);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}

// GET endpoint - Retrieve chat history
export async function GET() {
  try {
    const chatHistory = readChatHistory();
    return NextResponse.json({
      success: true,
      conversations: chatHistory.conversations,
    });
  } catch (error) {
    console.error("Error reading chat history:", error);
    return NextResponse.json(
      { error: "Failed to read chat history" },
      { status: 500 }
    );
  }
}

// DELETE endpoint - Clear chat history
export async function DELETE() {
  try {
    writeChatHistory({ conversations: [] });
    return NextResponse.json({
      success: true,
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 }
    );
  }
}
