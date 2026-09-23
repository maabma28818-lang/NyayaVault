import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileArchive, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  Flame, 
  FileText, 
  Database, 
  X, 
  RotateCcw,
  Building2,
  Radio,
  FileCheck,
  Scale
} from 'lucide-react';
import { EvidencePassportCard } from './EvidencePassportCard';
import { CustodyTimeline } from './CustodyTimeline';
import type { CustodyEvent } from './CustodyTimeline';
import { mockEvidence, mockEvidencePassport } from '../mockData';
import type { EvidenceObject, EvidencePassport } from '../types';


export interface VerificationDemoProps {
  evidence?: EvidenceObject;
  className?: string;
}

const initialTimelineEvents: CustodyEvent[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Created & Sealed',
    actor: 'Investigating Officer (Sr. Inspector Rajesh Kadam)',
    timestamp: '12 Sept 2026, 10:32 AM',
    status: 'Validated',
    blockchainTx: 'TX-982370',
    description: 'Cryptographic envelope sealed with SHA-256 digest & tamper-evident HSM token signature.',
    location: 'Cyber Crime Branch, Mumbai'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Transferred',
    actor: 'Transit Custody Officer',
    transferFlow: 'Investigating Unit → Forensic Lab',
    timestamp: '12 Sept 2026, 14:00 PM',
    status: 'Validated',
    blockchainTx: 'TX-982372',
    description: 'Secure physical & digital transit initiated with dual-factor hardware token validation.',
    location: 'Transit Division'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Accepted',
    actor: 'Forensic Lab (Chief Examiner Dr. V. Sen)',
    timestamp: '13 Sept 2026, 09:15 AM',
    status: 'Validated',
    blockchainTx: 'TX-982374',
    description: 'Physical & digital parity check validated. Memory dump analysis completed and indexed.',
    location: 'Central Forensic Science Laboratory'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Transferred (Pending Acceptance)',
    actor: 'Forensic Lab → Public Prosecutor Office',
    transferFlow: 'Forensic Lab → Prosecutor',
    timestamp: 'Pending Handshake',
    status: 'Active',
    isCurrentActive: true,
    description: 'Evidence transfer dispatch initiated. Awaiting Public Prosecutor cryptographic acceptance key.',
    location: 'High Court Legal Vault'
  }
];

export const VerificationDemo: React.FC<VerificationDemoProps> = ({
  evidence = mockEvidence,
  className = ''
}) => {
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileProgress, setCompileProgress] = useState<number>(0);
  const [showCourtPackageModal, setShowCourtPackageModal] = useState<boolean>(false);

  // Dynamic Passport state based on tampering
  const currentHash = isTampered ? 'E7C90B12F4... (COMPROMISED)' : 'A9F82E8C3B...';

  const dynamicPassport: EvidencePassport = {
    ...mockEvidencePassport,
    originalHash: currentHash,
    integrityStatus: isTampered ? 'TAMPERED' : 'VERIFIED',
    legalHold: 'ACTIVE'
  };


  const dynamicEvidence: EvidenceObject = {
    ...evidence,
    passport: dynamicPassport
  };

  // Timeline events dynamically updated when tampering is triggered
  const timelineEvents: CustodyEvent[] = isTampered
    ? [
        ...initialTimelineEvents,
        {
          id: 'step-tamper-alert',
          stepNumber: 5,
          title: 'UNAUTHORIZED MODIFICATION DETECTED - LEGAL HOLD TRIGGERED',
          actor: 'Zero-Trust Sentinel & Security Enclave Automated Alert',
          timestamp: 'Just now (Incident Alarm)',
          status: 'Active',
          isCurrentActive: true,
          blockchainTx: 'TX-SEC-BREACH-982490',
          description: 'CRITICAL INTEGRITY FAILURE: Local SHA-256 digest mismatch against Hyperledger block TX-982374. Automated evidence lockdown initiated.',
          location: 'State Zero-Trust Forensic Enclave'
        }
      ]
    : initialTimelineEvents;

  // ACTION 1: Simulate External Tampering
  const handleSimulateTampering = () => {
    setIsTampered(true);
  };

  // Reset to original validated state
  const handleResetDemo = () => {
    setIsTampered(false);
    setShowCourtPackageModal(false);
    setIsCompiling(false);
    setCompileProgress(0);
  };

  // ACTION 2: Generate Court Package
  const handleGenerateCourtPackage = () => {
    if (isTampered) {
      alert('SECURITY ALERT: Cannot compile court package while evidence is under active integrity failure.');
      return;
    }

    setIsCompiling(true);
    setCompileProgress(15);

    const interval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setCompileProgress(100);
      setIsCompiling(false);
      setShowCourtPackageModal(true);
    }, 1500);
  };

  const handleDownloadZip = () => {
    // Generate a mock download file for court presentation
    const manifestContent = JSON.stringify({
      evidenceId: evidence.id,
      caseId: evidence.caseId,
      classification: "Forensic Report",
      originalHash: "A9F82E8C3B7651D8E9F1A4B7D2C0E8F9A1B2C3D4E5F60718293A4B5C6D7E8F90",
      encryption: "AES-GCM-256",
      blockchainTx: "TX-982374",
      ledgerConsensus: "Hyperledger Fabric v2.5 State Consortium",
      section65BCertificate: "Certified by Central Forensic Laboratory under Section 65B Indian Evidence Act",
      timestamp: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Court_Package_${evidence.id}_Section65B_Manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`verification-demo-container ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* SIH Video Pitch Action Control Bar */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #13192b 0%, #0c101c 100%)',
          border: isTampered ? '2px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          boxShadow: isTampered 
            ? '0 0 35px rgba(239, 68, 68, 0.35), 0 10px 25px rgba(0, 0, 0, 0.6)' 
            : '0 0 25px rgba(59, 130, 246, 0.2), 0 10px 25px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left: Pitch Presentation Mode Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: isTampered 
              ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            padding: '0.65rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isTampered ? '0 0 15px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(59, 130, 246, 0.4)'
          }}>
            {isTampered ? <ShieldAlert size={24} color="#ffffff" /> : <Radio size={24} color="#ffffff" />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                SIH Live Verification & Tamper Simulation Console
              </h3>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: isTampered ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                color: isTampered ? '#f87171' : '#60a5fa',
                border: `1px solid ${isTampered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px'
              }}>
                Pitch Mode Active
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Simulate zero-trust tamper detection and compile Section 65B certified legal court packages.
            </p>
          </div>
        </div>

        {/* Right: Primary Pitch Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* ACTION 1: Simulate External Tampering (Red) */}
          <button
            type="button"
            onClick={handleSimulateTampering}
            disabled={isTampered}
            style={{
              background: isTampered 
                ? 'rgba(239, 68, 68, 0.2)' 
                : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              border: isTampered ? '1px solid #ef4444' : '1px solid #f87171',
              color: '#ffffff',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: isTampered ? 'not-allowed' : 'pointer',
              boxShadow: isTampered ? 'none' : '0 4px 18px rgba(239, 68, 68, 0.4), 0 0 10px rgba(239, 68, 68, 0.2)',
              transition: 'all 0.2s ease',
              opacity: isTampered ? 0.75 : 1
            }}
          >
            <Flame size={18} />
            <span>Simulate External Tampering</span>
          </button>

          {/* ACTION 2: Generate Court Package (Blue) */}
          <button
            type="button"
            onClick={handleGenerateCourtPackage}
            disabled={isCompiling || isTampered}
            style={{
              background: isTampered 
                ? 'rgba(100, 116, 139, 0.2)' 
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: isTampered ? '1px solid #475569' : '1px solid #60a5fa',
              color: isTampered ? '#94a3b8' : '#ffffff',
              padding: '0.7rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: (isCompiling || isTampered) ? 'not-allowed' : 'pointer',
              boxShadow: isTampered ? 'none' : '0 4px 18px rgba(59, 130, 246, 0.4), 0 0 10px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {isCompiling ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Compiling Package...</span>
              </>
            ) : (
              <>
                <FileArchive size={18} />
                <span>Generate Court Package</span>
              </>
            )}
          </button>

          {/* Reset Demo Button */}
          {isTampered && (
            <button
              type="button"
              onClick={handleResetDemo}
              className="btn-secondary"
              style={{
                padding: '0.7rem 1rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              title="Restore original integrity state"
            >
              <RotateCcw size={15} /> Reset Demo
            </button>
          )}
        </div>
      </div>

      {/* Flashing Red Breach Alert Banner when Tampering is Active */}
      {isTampered && (
        <div 
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.3) 0%, rgba(127, 29, 29, 0.5) 100%)',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
            animation: 'breachPulse 1.5s infinite'
          }}
        >
          <style>
            {`
              @keyframes breachPulse {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
                50% { box-shadow: 0 0 25px 5px rgba(239, 68, 68, 0.4); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
              }
              @keyframes redFlash {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(0.98); }
              }
            `}
          </style>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.3)',
              padding: '0.6rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 4s linear infinite'
            }}>
              <AlertTriangle size={24} color="#fca5a5" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fecaca', letterSpacing: '0.02em' }}>
                SECURITY BREACH DETECTED: UNAUTHORIZED MODIFICATION DETECTED
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '0.15rem' }}>
                SHA-256 Mismatch: <code style={{ textDecoration: 'line-through', opacity: 0.8 }}>A9F82E8C3B...</code> → <strong style={{ color: '#ffffff' }}>E7C90B12F4...</strong> • Automated Legal Hold Activated.
              </div>
            </div>
          </div>

          <div style={{
            background: '#ef4444',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.75rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)'
          }}>
            LEGAL HOLD TRIGGERED
          </div>
        </div>
      )}

      {/* Loading State Banner when Generating Court Package */}
      {isCompiling && (
        <div 
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid #3b82f6',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <RefreshCw size={22} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Compiling Provenance, Signatures, and Hashes...
            </h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Aggregating Section 65B Indian Evidence Act certificates, Hyperledger block proofs, and AES-256 envelope manifests.
          </p>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
            margin: '0 auto'
          }}>
            <div style={{
              height: '100%',
              width: `${compileProgress}%`,
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
              transition: 'width 0.3s ease',
              borderRadius: '9999px'
            }} />
          </div>
        </div>
      )}

      {/* Interactive Evidence Passport Card (Live Red Flashing when Tampered) */}
      <div style={{ position: 'relative' }}>
        {isTampered && (
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 10,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: '2px solid #ffffff',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.9)',
            animation: 'redFlash 1s infinite',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} />
            <span>INTEGRITY FAILURE</span>
          </div>
        )}

        <EvidencePassportCard 
          evidence={dynamicEvidence}
          passport={dynamicPassport}
          accessPolicy="Investigation Team + Prosecutor"
        />
      </div>

      {/* Interactive Chain of Custody Timeline (With Appended Alert when Tampered) */}
      <CustodyTimeline 
        evidenceId={evidence.id}
        caseId={evidence.caseId}
        events={timelineEvents}
      />

      {/* ACTION 2 SUCCESS MODAL: Court Package ZIP Download */}
      {showCourtPackageModal && (
        <div 
          className="modal-overlay animate-fade-in" 
          onClick={() => setShowCourtPackageModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 12, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #131a2e 0%, #0c101c 100%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.25)',
              overflow: 'hidden',
              color: '#e2e8f0'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(20, 26, 44, 0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
                }}>
                  <CheckCircle2 size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    Court Package Compiled Successfully
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Section 65B Compliant Forensic Evidence Bundle
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setShowCourtPackageModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.4rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* ZIP File Card Preview */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '0.85rem',
                    borderRadius: '10px'
                  }}>
                    <FileArchive size={32} color="#60a5fa" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                      Court_Package_{evidence.id}.zip
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      4.8 MB • Encrypted Zero-Trust Archive • SHA-256 Verified
                    </div>
                  </div>
                </div>

                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  READY
                </span>
              </div>

              {/* Package Manifest Breakdown */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  Package Contents (Documents + Verification Manifest + Ledger Proofs)
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  background: 'rgba(10, 15, 26, 0.6)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {/* File 1: Documents */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={15} color="#60a5fa" />
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>1. Documents Payload:</span>
                      <span style={{ color: '#94a3b8' }}>Forensic_Report_Apex_Storage_Dump_v1.pdf</span>
                    </div>
                    <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontFamily: 'monospace' }}>AES-256</span>
                  </div>

                  {/* File 2: Verification Manifest */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={15} color="#34d399" />
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>2. Verification Manifest:</span>
                      <span style={{ color: '#94a3b8' }}>Section65B_Certificate_Manifest.json</span>
                    </div>
                    <span style={{ color: '#34d399', fontSize: '0.75rem', fontFamily: 'monospace' }}>SHA-256</span>
                  </div>

                  {/* File 3: Ledger Proofs */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Database size={15} color="#a78bfa" />
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>3. Ledger Proofs:</span>
                      <span style={{ color: '#94a3b8' }}>Hyperledger_Consensus_Receipt_TX982374.p7b</span>
                    </div>
                    <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontFamily: 'monospace' }}>Merkle Proof</span>
                  </div>

                  {/* File 4: Signed Custody Log */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Scale size={15} color="#fbbf24" />
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>4. Custody Audit Trail:</span>
                      <span style={{ color: '#94a3b8' }}>Signed_Chain_of_Custody_Certificate.pdf</span>
                    </div>
                    <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontFamily: 'monospace' }}>HSM Signed</span>
                  </div>
                </div>
              </div>

              {/* Legal Admissibility Disclaimer */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.775rem',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <Building2 size={18} />
                <span>
                  This court package satisfies Indian Evidence Act Section 65B legal admissibility requirements with cryptographic tamper-evidence proofs.
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              background: 'rgba(20, 26, 44, 0.4)'
            }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowCourtPackageModal(false)}
              >
                Close
              </button>

              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleDownloadZip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Download size={16} />
                Download Court Package (.zip)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerificationDemo;
