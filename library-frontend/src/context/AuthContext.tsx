"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded: any = jwtDecode(storedToken);
          // Check expiration
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setToken(storedToken);
            setUser({
              userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
              email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
              role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            });
          }
        } catch (error) {
          logout();
        }
      }
    }
  }, []);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    // Decode token to get user info if not provided
    const decoded: any = jwtDecode(newToken);
    setUser({
        userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    });

    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
