'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RegisterRequest } from './api';

// ── Demo Mode ──
// In demo mode, useAuth() returns a fake user so the UI never
// redirects to login. When the MVP backend is ready, flip this
// flag to false and restore the original auth flow.
const DEMO_MODE = true;

const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@ware.studio',
  name: 'Rose Katz',
  created_at: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_MODE ? DEMO_USER : null);
  const [accessToken, setAccessToken] = useState<string | null>(
    DEMO_MODE ? 'demo-token' : null
  );
  const [isLoading, setIsLoading] = useState(!DEMO_MODE);

  useEffect(() => {
    if (DEMO_MODE) {
      // Skip all token/session restoration in demo mode
      setIsLoading(false);
      return;
    }

    // ── Real auth flow (preserved for MVP) ──
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      // In MVP mode, would call api.setAccessToken(storedToken) and fetch user
      setAccessToken(storedToken);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (_email: string, _password: string) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      setAccessToken('demo-token');
      return;
    }
    // MVP: call real API
    throw new Error('Real auth not configured. Set DEMO_MODE = false and wire up the backend.');
  };

  const register = async (_data: RegisterRequest) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      setAccessToken('demo-token');
      return;
    }
    throw new Error('Real auth not configured.');
  };

  const logout = () => {
    if (DEMO_MODE) {
      // In demo mode, just no-op (user stays "logged in")
      return;
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, register, logout, isLoading, isDemoMode: DEMO_MODE }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
