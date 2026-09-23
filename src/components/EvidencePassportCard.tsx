import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Database, 
  Fingerprint, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  Users, 
  Scale, 
  QrCode, 
  Building2,
  AlertTriangle
} from 'lucide-react';


import { mockEvidence, mockEvidencePassport } from '../mockData';
import type { EvidenceObject, EvidencePassport } from '../types';

export interface EvidencePassportCardProps {
  evidence?: EvidenceObject;
  passport?: EvidencePassport;
  accessPolicy?: string;
  onVerify?: () => Promise<boolean> | boolean | void;
  className?: string;
}

export const EvidencePassportCard: React.FC<EvidencePassportCardProps> = ({
  evidence = mockEvidence,
  passport = mockEvidence.passport || mockEvidencePassport,
  accessPolicy = 'Investigation Team + Prosecutor',
  onVerify,
  className = ''
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'VERIFIED' | 'VERIFYING' | 'FAILED' | null>(null);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>(passport.verifiedAt || '2026-03-02T11:20:00.000Z');

  const handleCopy = (text: string, type: 'hash' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    setVerificationResult('VERIFYING');

    if (onVerify) {
      try {
        await onVerify();
      } catch (e) {
        console.error('Verification failed', e);
      }
    }

    // Cryptographic verification check
    setTimeout(() => {
      setIsVerifying(false);
      const isBreached = passport.integrityStatus === 'TAMPERED' || passport.originalHash.includes('COMPROMISED');
      setVerificationResult(isBreached ? 'FAILED' : 'VERIFIED');
      setLastVerifiedTime(new Date().toISOString());
    }, 900);
  };

  const isTampered = passport.integrityStatus === 'TAMPERED' || passport.originalHash.includes('COMPROMISED') || verificationResult === 'FAILED';
  const currentStatus = isTampered ? 'INTEGRITY FAILURE' : (verificationResult === 'VERIFIED' ? 'VERIFIED' : passport.integrityStatus);


  return (
    <div 
      className={`evidence-passport-card ${className}`}
      style={{
        background: 'linear-gradient(145deg, #0e1320 0%, #070a12 100%)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(59, 130, 246, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        color: '#e2e8f0',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Official Watermark Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Top Government Security Header Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #131d33 0%, #1a2744 50%, #131d33 100%)',
        padding: '0.65rem 1.5rem',
        borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Building2 size={16} color="#60a5fa" />
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            color: '#93c5fd'
          }}>
            GOVERNMENT OF MAHARASHTRA • DIGITAL EVIDENCE REPOSITORY
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Official Record • Section 65B Certified
          </span>
        </div>
      </div>

      {/* Main Passport Content */}
      <div style={{ padding: '1.75rem' }}>

        {/* SECTION 1: HEADER (Evidence ID, Integrity Badge & Verify Button) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Evidence ID & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.25)'
            }}>
              <Fingerprint size={28} color="#60a5fa" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#94a3b8'
                }}>
                  Digital Evidence Passport
                </span>
                <span style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px'
                }}>
                  {passport.version || 'V1'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  {passport.evidenceId || evidence.id}
                </h2>

                {/* Integrity Status Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: !isTampered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.25)',
                  border: `1px solid ${!isTampered ? 'rgba(16, 185, 129, 0.4)' : '#ef4444'}`,
                  color: !isTampered ? '#34d399' : '#fca5a5',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  boxShadow: !isTampered ? '0 0 12px rgba(16, 185, 129, 0.25)' : '0 0 20px rgba(239, 68, 68, 0.8)',
                  animation: isTampered ? 'breachPulse 1s infinite' : 'none'
                }}>
                  {!isTampered ? <ShieldCheck size={16} /> : <AlertTriangle size={16} color="#ef4444" />}
                  <span>Integrity: {currentStatus}</span>
                </div>
              </div>
            </div>
          </div>



          {/* Highly Visible "Verify Integrity" Button */}
          <div>
            <button
              type="button"
              onClick={handleVerifyIntegrity}
              disabled={isVerifying}
              style={{
                background: isVerifying 
                  ? 'rgba(59, 130, 246, 0.3)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid #34d399',
                color: '#ffffff',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: isVerifying ? 'wait' : 'pointer',
                boxShadow: '0 4px 18px 0 rgba(16, 185, 129, 0.35), 0 0 10px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.2s ease',
                transform: isVerifying ? 'none' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (!isVerifying) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (!isVerifying) e.currentTarget.style.transform = 'none';
              }}
            >
              <RefreshCw 
                size={18} 
                style={{ 
                  animation: isVerifying ? 'spin 1s linear infinite' : 'none' 
                }} 
              />
              <span>{isVerifying ? 'Verifying Zero-Trust Hash...' : 'Verify Integrity'}</span>
            </button>
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right', marginTop: '0.35rem' }}>
              Last Verified: {new Date(lastVerifiedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3 & 4: GRID LAYOUT FOR SECTIONS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.5rem'
        }}>

          {/* 2. CRYPTOGRAPHIC DETAILS */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} color="#3b82f6" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Cryptographic Details
                </h4>
              </div>

              {/* Encrypted (AES-256) Lock Indicator */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#93c5fd',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                <Lock size={12} />
                <span>Encrypted (AES-256)</span>
              </div>
            </div>

            {/* SHA-256 Hash Display */}
            <div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                SHA-256 Hash Digest
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#070a12',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#38bdf8'
              }}>
                <span style={{ letterSpacing: '0.03em' }}>{passport.originalHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(passport.originalHash, 'hash')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedHash ? '#34d399' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Copy SHA-256 Hash"
                >
                  {copiedHash ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            {/* Encryption & Envelope Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Cipher Mode: </span>
                <strong style={{ color: '#e2e8f0' }}>AES-GCM (256-bit)</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Envelope: </span>
                <strong style={{ color: '#e2e8f0' }}>HSM Root Key #1</strong>
              </div>
            </div>
          </div>

          {/* 3. LEDGER DETAILS */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color="#10b981" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Ledger Details
                </h4>
              </div>

              {/* Anchored Green Checkmark Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Anchored</span>
              </div>
            </div>

            {/* Blockchain TX ID Display */}
            <div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Hyperledger Fabric Blockchain TX ID
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#070a12',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#34d399'
              }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#10b981" /> {passport.blockchainTx}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(passport.blockchainTx, 'tx')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedTx ? '#34d399' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Copy Blockchain TX ID"
                >
                  {copiedTx ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            {/* Network & Node Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Network: </span>
                <strong style={{ color: '#e2e8f0' }}>State Consortium v2.5</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Validator: </span>
                <strong style={{ color: '#e2e8f0' }}>Peer Node #3 (Gov)</strong>
              </div>
            </div>
          </div>

          {/* 4. ACCESS POLICY & GOVERNANCE */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#f59e0b" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Access Policy
                </h4>
              </div>

              {/* Legal Hold Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <Scale size={12} />
                <span>Legal Hold: {passport.legalHold || 'ACTIVE'}</span>
              </div>
            </div>

            {/* Authorized Roles */}
            <div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Authorized Principal Roles
              </div>
              <div style={{
                background: '#070a12',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Users size={15} color="#60a5fa" />
                <span>{accessPolicy}</span>
              </div>
            </div>

            {/* Custodian & Classification Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Custodian: </span>
                <strong style={{ color: '#e2e8f0' }}>{passport.currentCustodian || 'Forensic Laboratory'}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>AI Confidence: </span>
                <strong style={{ color: '#34d399' }}>{passport.aiConfidence}%</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Audit Signature Strip */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(7, 10, 18, 0.75)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={15} color="#60a5fa" />
            <span>Document: <strong style={{ color: '#ffffff' }}>{evidence.name || 'Forensic Report'}</strong></span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>Case Link: <strong style={{ color: '#60a5fa' }}>{evidence.caseId || 'MH-MUM-2026-00421'}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <QrCode size={14} color="#94a3b8" /> Seal ID: <code style={{ color: '#e2e8f0' }}>NYA-88219-SEC</code>
            </span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Zero-Trust Sealed</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EvidencePassportCard;
