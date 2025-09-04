"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Redirect logic
      if (isAuthenticated && pathname === "/") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  const login = (username: string) => {
    localStorage.setItem("authToken", "mock-jwt-token");
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = async () => {
    setIsLoading(true);

    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUsername("");
    setIsAuthenticated(false);
    router.push("/");

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
