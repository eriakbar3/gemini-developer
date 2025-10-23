"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gemini_chat_sessions");
    if (saved) {
      try {
        const sessions = JSON.parse(saved);
        setChatSessions(sessions);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("gemini_chat_sessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const createNewSession = () => {
    const sessionId = `session_${Date.now()}`;
    const newSession = {
      id: sessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(sessionId);
    setCurrentMessages([]);

    return sessionId;
  };

  const loadSession = (sessionId) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setCurrentMessages(session.messages);
    }
  };

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      timestamp: new Date().toISOString(),
    };

    setCurrentMessages((prev) => [...prev, newMessage]);

    // Update session in chatSessions
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === currentSessionId) {
          const updatedMessages = [...session.messages, newMessage];
          // Update title based on first user message
          let title = session.title;
          if (title === "New Chat" && message.isUser) {
            title = message.text.substring(0, 50);
          }

          return {
            ...session,
            messages: updatedMessages,
            title,
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      })
    );
  };

  const deleteSession = (sessionId) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // If deleting current session, create new one
    if (sessionId === currentSessionId) {
      createNewSession();
    }
  };

  const clearAllSessions = () => {
    setChatSessions([]);
    localStorage.removeItem("gemini_chat_sessions");
    createNewSession();
  };

  const value = {
    chatSessions,
    currentSessionId,
    currentMessages,
    createNewSession,
    loadSession,
    addMessage,
    deleteSession,
    clearAllSessions,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
