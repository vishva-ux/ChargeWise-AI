import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, role?: 'User' | 'Admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('chargewise_user');
    return saved ? JSON.parse(saved) : {
      id: '22222222-2222-2222-2222-222222222222',
      fullName: 'Alex Mercer',
      email: 'alex.mercer@gmail.com',
      role: 'User',
      vehicleModel: 'Hyundai Ioniq 5',
      batteryCapacityKwh: 77,
      preferredConnector: 'CCS2'
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('chargewise_token') || 'demo-jwt-token');

  const login = (email: string, role: 'User' | 'Admin' = 'User') => {
    const newUser: UserProfile = {
      id: role === 'Admin' ? '11111111-1111-1111-1111-111111111111' : '22222222-2222-2222-2222-222222222222',
      fullName: role === 'Admin' ? 'Admin Supervisor' : 'Alex Mercer',
      email,
      role,
      vehicleModel: 'Tesla Model Y',
      batteryCapacityKwh: 75,
      preferredConnector: 'CCS2'
    };
    setUser(newUser);
    setToken('demo-jwt-token-12345');
    localStorage.setItem('chargewise_user', JSON.stringify(newUser));
    localStorage.setItem('chargewise_token', 'demo-jwt-token-12345');
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
