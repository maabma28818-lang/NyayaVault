import { useEffect, useState } from 'react';
import { getCases, getDocuments, saveDocumentMetadata } from '../utils/storageUtils';
import type { Case, DocumentMetadata, EvidenceObject } from '../types';
import { ShieldCheck, FolderOpen, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import { IntelligentUploadModal } from '../components/IntelligentUploadModal';
import { VerificationDemo } from '../components/VerificationDemo';
import { mockEvidence } from '../mockData';

const Dashboard = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);


  const refreshData = () => {
    setCases(getCases());
    setDocs(getDocuments());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = [
    { label: 'Total Cases', value: cases.length, icon: <FolderOpen size={24} color="var(--accent-primary)" /> },
    { label: 'Total Evidence Objects', value: docs.length, icon: <FileText size={24} color="var(--success)" /> },
    { label: 'Open Investigations', value: cases.filter(c => c.status === 'Open').length, icon: <AlertTriangle size={24} color="var(--warning)" /> },
  ];

  const handleEvidenceCreated = (evidence: EvidenceObject) => {
    saveDocumentMetadata({
      id: evidence.id,
      caseId: evidence.caseId,
      name: evidence.name,
      type: evidence.type,
      size: evidence.size,
      hash: evidence.passport.originalHash,
      uploadedBy: evidence.uploadedBy,
      uploadedAt: evidence.uploadedAt,
      version: 1,
      previousVersionId: null,
      ivArray: [12, 45, 78, 23, 89, 101, 214, 53, 90, 11, 44, 76],
      passport: evidence.passport
    });
    refreshData();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Law Enforcement Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Zero-Trust Evidence Repository & Cryptographic Passport Management
          </p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setIsIngestModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
            padding: '0.65rem 1.25rem',
            fontSize: '0.9rem'
          }}
        >
          <Sparkles size={18} />
          AI Ingest Evidence
        </button>
      </div>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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

      {/* Live SIH Verification & Court Package Pitch Stage */}
      <div style={{ marginBottom: '2rem' }}>
        <VerificationDemo 
          evidence={mockEvidence}
        />
      </div>




      {/* System Security Status */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <ShieldCheck size={24} color="var(--success)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Zero-Trust Security & Chain of Custody Status</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          All active document repositories are cryptographically protected by <strong>AES-GCM 256-bit envelope encryption</strong>. Every digital ingestion generates an unforgeable <strong>Evidence Passport</strong> anchored with immutable SHA-256 integrity digests and blockchain transaction receipts.
        </p>
      </div>

      {/* Intelligent Upload Modal */}
      <IntelligentUploadModal 
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onSuccess={handleEvidenceCreated}
        targetCaseId="MH-MUM-2026-00421"
      />
    </div>
  );
};

export default Dashboard;

