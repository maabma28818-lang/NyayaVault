import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Edit3, 
  Lock, 
  X, 
  Cpu, 
  Check, 
  Hash, 
  Database,
  ArrowRight
} from 'lucide-react';
import { mockEvidence, mockEvidencePassport } from '../mockData';
import type { EvidenceObject, EvidencePassport } from '../types';


export interface IntelligentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (evidence: EvidenceObject) => void;
  targetCaseId?: string;
}

type IngestionStep = 'DROPZONE' | 'SCANNING_OCR' | 'AI_CLASSIFIED' | 'SUCCESS';

export const IntelligentUploadModal: React.FC<IntelligentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetCaseId = 'MH-MUM-2026-00421'
}) => {
  const [step, setStep] = useState<IngestionStep>('DROPZONE');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  
  // Correction Mode State
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);
  const [classification, setClassification] = useState<string>('Forensic Report');
  const [linkedCaseId, setLinkedCaseId] = useState<string>(targetCaseId || 'MH-MUM-2026-00421');
  const [confidenceScore, setConfidenceScore] = useState<number>(94);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('DROPZONE');
      setSelectedFile(null);
      setScanProgress(0);
      setIsCorrecting(false);
      setShowToast(false);
      setClassification('Forensic Report');
      setLinkedCaseId(targetCaseId || 'MH-MUM-2026-00421');
      setConfidenceScore(94);
    }
  }, [isOpen, targetCaseId]);

  // Handle Scan & OCR simulation (Step 2 -> Step 3 after 2 seconds)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let progressInterval: ReturnType<typeof setInterval>;

    if (step === 'SCANNING_OCR') {

      setScanProgress(10);
      const startTime = Date.now();
      const duration = 2000;

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
        setScanProgress(currentProgress);
      }, 50);

      timer = setTimeout(() => {
        clearInterval(progressInterval);
        setScanProgress(100);
        setStep('AI_CLASSIFIED');
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [step]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File | { name: string; size: number; type: string }) => {
    setSelectedFile({
      name: file.name,
      size: file.size || 2457600,
      type: file.type || 'application/pdf'
    });
    setStep('SCANNING_OCR');
  };

  const handleDemoFileSelect = () => {
    handleFileSelect({
      name: 'Forensic_Report.pdf',
      size: 2457600,
      type: 'application/pdf'
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmClassification = () => {
    const generatedPassport: EvidencePassport = {
      ...mockEvidencePassport,
      classification: classification,
      aiConfidence: confidenceScore,
      legalHold: 'ACTIVE',
      integrityStatus: 'VERIFIED',
      blockchainTx: 'TX-982374'
    };

    const evidenceObj: EvidenceObject = {
      ...mockEvidence,
      id: 'NV-EV-2026-000184',
      caseId: linkedCaseId,
      name: selectedFile?.name || 'Forensic_Report.pdf',
      title: classification,
      passport: generatedPassport
    };

    // Show toast
    setShowToast(true);
    setStep('SUCCESS');

    if (onSuccess) {
      onSuccess(evidenceObj);
    }

    // Auto-close modal after toast acknowledgement
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose}
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
          className="modal-content animate-fade-in"
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(145deg, #141622 0%, #0d0f18 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '640px',
            overflow: 'hidden',
            color: '#e2e8f0',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(20, 22, 34, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
              }}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#ffffff' }}>
                  AI Ingestion Pipeline
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Zero-Trust Cryptographic Evidence Ingestion
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                borderRadius: '8px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '1.75rem 1.5rem' }}>
            
            {/* STEP 1: INITIAL STATE (DRAG AND DROP) */}
            {step === 'DROPZONE' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: isDragOver ? '2px dashed #3b82f6' : '2px dashed rgba(59, 130, 246, 0.35)',
                    backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'rgba(20, 24, 38, 0.6)',
                    borderRadius: '12px',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.png,.jpg,.jpeg,.mp4,.wav,.docx,.json,.raw"
                  />

                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <UploadCloud size={28} color="#3b82f6" />
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    Drag and drop evidence file here
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', maxWidth: '380px', margin: '0 auto 1.25rem auto' }}>
                    Supports PDF, Disk Images, Forensic Memory Dumps, Video CCTV, Audio Recordings, and Digital Documents.
                  </p>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.5rem 1.25rem'
                    }}
                  >
                    <FileText size={16} /> Browse Local File
                  </button>
                </div>


                {/* Judge Demo Quick Action */}
                <div style={{
                  background: 'rgba(59, 130, 246, 0.06)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Cpu size={18} color="#60a5fa" />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#e2e8f0' }}>
                        Quick Simulation Preset
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Load sample: <code style={{ color: '#93c5fd' }}>Forensic_Report.pdf</code>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDemoFileSelect();
                    }}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid #3b82f6',
                      color: '#ffffff',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    Select "Forensic_Report.pdf" <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SECURITY SCAN & OCR STATE (2 SECONDS) */}
            {step === 'SCANNING_OCR' && (
              <div className="animate-fade-in" style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                {/* Circular Radar / Spinner */}
                <div style={{
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 1.5rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid rgba(59, 130, 246, 0.15)',
                    borderTopColor: '#3b82f6',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                  </style>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Lock size={26} color="#3b82f6" />
                  </div>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Running Malware Scan & OCR text extraction...
                </h4>
                
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Inspecting payload integrity for <strong style={{ color: '#e2e8f0' }}>{selectedFile?.name}</strong>
                </p>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scanProgress}%`,
                    background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                    transition: 'width 0.1s linear',
                    borderRadius: '9999px'
                  }} />
                </div>

                {/* Checklist sub-items */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  maxWidth: '440px',
                  margin: '0 auto',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={14} color="#10b981" /> Sandbox Sandbox Scan: Clean
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={14} color="#10b981" /> SHA-256 Digest Computed
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={14} color="#10b981" /> Neural OCR Buffer Ready
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={14} color="#3b82f6" /> AI Classification Engine Active
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 & 4: AI CLASSIFICATION & HUMAN CONFIRMATION */}
            {step === 'AI_CLASSIFIED' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* AI Prediction Card */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #3b82f6 0%, #10b981 100%)'
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#60a5fa',
                        background: 'rgba(59, 130, 246, 0.15)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        <Cpu size={12} /> AI Prediction Model v3.2
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                        {selectedFile?.name || 'Forensic_Report.pdf'}
                      </h4>
                    </div>

                    {/* Confidence Meter Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px'
                    }}>
                      <ShieldCheck size={16} color="#10b981" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
                        AI Confidence: {confidenceScore}%
                      </span>
                    </div>
                  </div>

                  {/* AI Metadata Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(20, 24, 38, 0.5)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {/* Document Type */}
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Extracted Document Type
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.15rem' }}>
                        {classification}
                      </div>
                    </div>

                    {/* Suggested Case Link */}
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Suggested Case Link
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#60a5fa', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Hash size={14} /> {linkedCaseId}
                      </div>
                    </div>

                    {/* AI Confidence Score */}
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Confidence Score
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981', marginTop: '0.15rem' }}>
                        {confidenceScore}% (High Assurance)
                      </div>
                    </div>

                    {/* Hash Digest */}
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Computed SHA-256
                      </div>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#cbd5e1', marginTop: '0.15rem' }}>
                        A9F82E8C3B...
                      </div>
                    </div>
                  </div>

                  {/* Manual Correction Fields (if clicked "Correct Classification") */}
                  {isCorrecting && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(30, 41, 59, 0.6)',
                      borderRadius: '8px',
                      border: '1px dashed #f59e0b',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Edit3 size={14} /> Human-In-The-Loop: Override Classification
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                            Document Type
                          </label>
                          <select
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                            className="input"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.825rem' }}
                          >
                            <option value="Forensic Report">Forensic Report</option>
                            <option value="Digital Media">Digital Media</option>
                            <option value="Forensic Evidence">Forensic Evidence</option>
                            <option value="Documentary Evidence">Documentary Evidence</option>
                            <option value="Chain of Custody Log">Chain of Custody Log</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                            Case ID Link
                          </label>
                          <input
                            type="text"
                            value={linkedCaseId}
                            onChange={(e) => setLinkedCaseId(e.target.value)}
                            className="input"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.825rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence Passport Preview Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.775rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={15} color="#3b82f6" />
                    <span>Target Passport: <strong style={{ color: '#e2e8f0' }}>NV-EV-2026-000184</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Ledger: TX-982374</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Hold: ACTIVE</span>
                  </div>
                </div>

                {/* Action Buttons: Confirm & Correct */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsCorrecting(!isCorrecting)}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Edit3 size={15} />
                    {isCorrecting ? 'Hide Override' : 'Correct Classification'}
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmClassification}
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.55rem 1.25rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Check size={16} /> Confirm AI Classification
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS STATE */}
            {step === 'SUCCESS' && (
              <div className="animate-fade-in" style={{ padding: '2rem 0', textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>
                  <Check size={32} color="#10b981" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                  Evidence Passport Generated
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Cryptographic passport anchored to blockchain record <code style={{ color: '#34d399' }}>TX-982374</code>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Global Success Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'linear-gradient(135deg, #141f2e 0%, #0b1522 100%)',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            zIndex: 10000,
            animation: 'fadeIn 0.3s ease-out',
            maxWidth: '400px'
          }}
        >
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              Evidence Passport Generated
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.1rem' }}>
              Passport: <span style={{ color: '#60a5fa' }}>NV-EV-2026-000184</span> | Case: <span style={{ color: '#e2e8f0' }}>{linkedCaseId}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IntelligentUploadModal;
