import React, { createContext, useContext, useState, useEffect } from 'react';
import type {  User  } from '../types';
import { getUsers } from '../utils/storageUtils';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    setUsersList(getUsers());
  }, []);

  const login = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) setUser(found);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
