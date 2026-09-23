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
      // Check session storage first for active session in current tab
      const sessionUser = sessionStorage.getItem('nv_current_user');
      if (sessionUser) return JSON.parse(sessionUser);
      return null;
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
      setUser(found);
      sessionStorage.setItem('nv_current_user', JSON.stringify(found));
      localStorage.setItem('nv_current_user', JSON.stringify(found));
    }
  };

  const logout = () => {
    sessionStorage.removeItem('nv_current_user');
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
