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
  const [users, setUsersList] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nv_current_user');
      if (saved) return JSON.parse(saved);
      // Only default on very first visit before any explicit logout
      const isLoggedOut = sessionStorage.getItem('nv_logged_out');
      if (isLoggedOut === 'true') return null;
      const initialUsers = getUsers();
      return initialUsers[0] || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const loadedUsers = getUsers();
    setUsersList(loadedUsers);
  }, []);

  const login = (userId: string) => {
    const currentUsers = users.length > 0 ? users : getUsers();
    const found = currentUsers.find(u => u.id === userId);
    if (found) {
      sessionStorage.removeItem('nv_logged_out');
      setUser(found);
      localStorage.setItem('nv_current_user', JSON.stringify(found));
    }
  };

  const logout = () => {
    sessionStorage.setItem('nv_logged_out', 'true');
    localStorage.removeItem('nv_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users: users.length > 0 ? users : getUsers() }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
