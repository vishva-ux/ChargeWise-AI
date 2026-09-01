import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';

// ── Built-in demo credentials ──────────────────────────────────
export const DEMO_CREDENTIALS = [
  { username: 'user',  password: 'user',     role: 'User'  as const },
  { username: 'user',  password: 'user123',  role: 'User'  as const },
  { username: 'admin', password: 'admin123', role: 'Admin' as const },
];
// ───────────────────────────────────────────────────────────────

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('chargewise_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('chargewise_token') || null
  );

  const login = (username: string, password: string): { success: boolean; error?: string } => {
    const match = DEMO_CREDENTIALS.find(
      (c) => c.username === username.trim().toLowerCase() && c.password === password
    );

    if (!match) {
      return { success: false, error: 'Invalid username or password.' };
    }

    const newUser: UserProfile = {
      id: match.role === 'Admin' ? '11111111-1111-1111-1111-111111111111' : '22222222-2222-2222-2222-222222222222',
      fullName: match.role === 'Admin' ? 'Admin' : 'User',
      email: `${match.username}@chargewise.ai`,
      role: match.role,
      vehicleModel: 'EV Vehicle',
      batteryCapacityKwh: 75,
      preferredConnector: 'CCS2'
    };

    setUser(newUser);
    setToken('demo-jwt-token-12345');
    localStorage.setItem('chargewise_user', JSON.stringify(newUser));
    localStorage.setItem('chargewise_token', 'demo-jwt-token-12345');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('chargewise_user');
    localStorage.removeItem('chargewise_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
