import { useEffect, useState } from 'react';
import { getCases, getDocuments } from '../utils/storageUtils';
import type {  Case, DocumentMetadata  } from '../types';
import { ShieldCheck, FolderOpen, FileText, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);

  useEffect(() => {
    setCases(getCases());
    setDocs(getDocuments());
  }, []);

  const stats = [
    { label: 'Total Cases', value: cases.length, icon: <FolderOpen size={24} color="var(--accent-primary)" /> },
    { label: 'Total Documents', value: docs.length, icon: <FileText size={24} color="var(--success)" /> },
    { label: 'Open Investigations', value: cases.filter(c => c.status === 'Open').length, icon: <AlertTriangle size={24} color="var(--warning)" /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <ShieldCheck size={24} color="var(--success)" />
          <h2>System Security Status</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          All active document repositories are currently protected by <strong>AES-GCM 256-bit encryption</strong> and verified against local cryptographic hashes.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
