"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("gemini_token");

      if (storedToken) {
        try {
          // Verify token with API
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.user);
              setIsAuthenticated(true);
            } else {
              // Invalid token, clear storage
              localStorage.removeItem("gemini_token");
              localStorage.removeItem("gemini_user");
            }
          } else {
            // API error, clear storage
            localStorage.removeItem("gemini_token");
            localStorage.removeItem("gemini_user");
          }
        } catch (error) {
          console.error("Failed to verify token:", error);
          localStorage.removeItem("gemini_token");
          localStorage.removeItem("gemini_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);

        // Store token and user in localStorage
        localStorage.setItem("gemini_token", data.token);
        localStorage.setItem("gemini_user", JSON.stringify(data.user));

        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem("gemini_token");

      if (storedToken) {
        // Call logout API
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state and storage regardless of API response
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("gemini_token");
      localStorage.removeItem("gemini_user");
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
