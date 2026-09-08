import React, { createContext, useContext } from 'react';
import type {  AuditAction, AuditLog  } from '../types';
import { logAudit as saveAuditLog } from '../utils/storageUtils';
import { useAuth } from './AuthContext';

interface AuditContextType {
  logAction: (action: AuditAction, details: string, overrideUserId?: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const logAction = (action: AuditAction, details: string, overrideUserId?: string) => {
    const activeUserId = overrideUserId || user?.id;
    if (!activeUserId) return;
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: activeUserId,
      action,
      details
    };
    saveAuditLog(log);
  };

  return (
    <AuditContext.Provider value={{ logAction }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAudit must be used within an AuditProvider');
  return context;
};
