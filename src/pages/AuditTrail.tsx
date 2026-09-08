import { useEffect, useState } from 'react';
import { getAuditLogs, getUsers } from '../utils/storageUtils';
import type {  AuditLog, User  } from '../types';
import { Clock } from 'lucide-react';

const AuditTrail = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Audit logs are stored chronologically
    setLogs(getAuditLogs().reverse()); // Show newest first
    setUsers(getUsers());
  }, []);

  const getUserName = (id: string) => {
    return users.find(u => u.id === id)?.name || 'Unknown User';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Clock size={32} color="var(--accent-primary)" />
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Append-only Audit Trail — Prototype</h1>
          <p style={{ color: 'var(--text-muted)' }}>Cryptographically secured chronological event log.</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No audit events recorded yet.</td>
              </tr>
            )}
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${
                    log.action.includes('FAILED') ? 'badge-danger' : 
                    log.action.includes('VERIFY') ? 'badge-success' : 
                    'badge-neutral'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{getUserName(log.userId)}</td>
                <td style={{ color: 'var(--text-primary)' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;
