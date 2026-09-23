import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCases, saveCase, getDocumentsForCase, saveDocumentMetadata, saveEncryptedFile, getEncryptedFile, tamperWithFile } from '../utils/storageUtils';
import { generateHash, encryptFile, decryptFile } from '../utils/cryptoUtils';
import type { Case, DocumentMetadata, EvidenceObject } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import { Upload, ShieldCheck, ShieldAlert, FileText, Bug, X, Share2, Eye, Edit3, Check, Sparkles } from 'lucide-react';
import { IntelligentUploadModal } from '../components/IntelligentUploadModal';
import { VerificationDemo } from '../components/VerificationDemo';





const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logAction } = useAudit();
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Case Rename state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  
  // Verification states map: docId -> 'verified' | 'failed' | null
  const [verifyStatus, setVerifyStatus] = useState<Record<string, 'verified' | 'failed' | null>>({});

  // Modal states
  const [viewDoc, setViewDoc] = useState<DocumentMetadata | null>(null);
  const [shareDoc, setShareDoc] = useState<DocumentMetadata | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [isAiIngestOpen, setIsAiIngestOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (id) {
      const allCases = getCases();
      const found = allCases.find(c => c.id === id);
      if (found) {
        setCaseData(found);
        setDocs(getDocumentsForCase(id));
      } else {
        navigate('/cases');
      }
    }
  }, [id, navigate]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNewVersionForId?: string) => {
    const canUpload = user?.role === 'Investigator' || user?.role === 'Admin';
    if (!canUpload) return;
    
    const file = e.target.files?.[0];
    if (!file || !caseData || !user) return;
    
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // 1. Generate real SHA-256 Hash
      const hash = await generateHash(arrayBuffer);
      
      // 2. Encrypt with AES-GCM
      const { encryptedBlob, iv } = await encryptFile(arrayBuffer);
      
      const newDocId = crypto.randomUUID();
      
      // Determine versioning
      let version = 1;
      let previousVersionId = null;
      
      if (isNewVersionForId) {
        const prevDoc = docs.find(d => d.id === isNewVersionForId);
        if (prevDoc) {
          version = prevDoc.version + 1;
          previousVersionId = prevDoc.id;
        }
      }

      const docMeta: DocumentMetadata = {
        id: newDocId,
        caseId: caseData.id,
        name: file.name,
        type: file.type,
        size: file.size,
        hash,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
        version,
        previousVersionId,
        ivArray: Array.from(iv)
      };

      // 3. Save to IndexedDB and LocalStorage
      await saveEncryptedFile(newDocId, encryptedBlob);
      saveDocumentMetadata(docMeta);
      
      setDocs(getDocumentsForCase(caseData.id));
      
      if (isNewVersionForId) {
        logAction('CREATE_VERSION', `Uploaded version ${version} of document ${docMeta.name} (Hash: ${hash})`);
      } else {
        logAction('UPLOAD_DOC', `Uploaded document ${docMeta.name} (Hash: ${hash})`);
      }

    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to process document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVerify = async (doc: DocumentMetadata) => {
    if (!user) return;
    
    try {
      const encryptedBlob = await getEncryptedFile(doc.id);
      if (!encryptedBlob) throw new Error('File not found in local storage.');

      const iv = new Uint8Array(doc.ivArray);
      
      // Decrypt
      const decryptedBuffer = await decryptFile(encryptedBlob, iv);
      
      // Recalculate hash
      const recalculatedHash = await generateHash(decryptedBuffer);
      
      // Compare
      if (recalculatedHash === doc.hash) {
        setVerifyStatus(prev => ({ ...prev, [doc.id]: 'verified' }));
        logAction('VERIFY_DOC', `Verified integrity of document ${doc.name}`);
      } else {
        setVerifyStatus(prev => ({ ...prev, [doc.id]: 'failed' }));
        logAction('VERIFY_FAILED', `INTEGRITY COMPROMISED: Document ${doc.name} failed hash verification`);
      }
    } catch (err) {
      console.error('Verification error', err);
      setVerifyStatus(prev => ({ ...prev, [doc.id]: 'failed' }));
      logAction('VERIFY_FAILED', `INTEGRITY COMPROMISED: Document ${doc.name} decryption or verification failed`);
    }
  };

  const handleSimulateTamper = async (docId: string) => {
    await tamperWithFile(docId);
    alert('Simulated tampering by corrupting the local file blob in IndexedDB.');
    // Reset verification status so user can verify again
    setVerifyStatus(prev => ({ ...prev, [docId]: null }));
  };

  const handleView = async (doc: DocumentMetadata) => {
    logAction('VIEW_DOC', `Viewed document ${doc.name}`);
    setViewDoc(doc);
    setDocPreviewUrl(null);
    try {
      const encryptedBlob = await getEncryptedFile(doc.id);
      if (encryptedBlob) {
        const iv = new Uint8Array(doc.ivArray);
        const decryptedBuffer = await decryptFile(encryptedBlob, iv);
        
        // Try preview for images and pdf
        if (doc.type.startsWith('image/') || doc.type === 'application/pdf') {
          const blob = new Blob([decryptedBuffer], { type: doc.type });
          setDocPreviewUrl(URL.createObjectURL(blob));
        }
      }
    } catch (e) {
      console.error("Preview failed", e);
    }
  };

  const handleOpenShare = (doc: DocumentMetadata) => {
    setShareSuccess(false);
    setShareDoc(doc);
  };
  
  const handleShareSubmit = () => {
    if (shareDoc) {
      logAction('SHARE_DOCUMENT', `Shared document ${shareDoc.name}`);
      setShareSuccess(true);
    }
  };

  const handleSaveTitle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editedTitle.trim() || !caseData) return;
    const updated: Case = { ...caseData, title: editedTitle.trim() };
    saveCase(updated);
    setCaseData(updated);
    logAction('CREATE_CASE', `Renamed case to "${updated.title}" (${updated.id})`);
    setIsEditingTitle(false);
  };

  const canUpload = user?.role === 'Investigator' || user?.role === 'Admin';
  
  if (!caseData) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          {isEditingTitle ? (
            <form onSubmit={handleSaveTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" 
                className="input" 
                value={editedTitle} 
                onChange={e => setEditedTitle(e.target.value)} 
                style={{ fontSize: '1.25rem', fontWeight: 600, padding: '0.4rem 0.75rem', width: '360px' }}
                autoFocus
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={16} /> Save
              </button>
              <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }} onClick={() => setIsEditingTitle(false)}>
                <X size={16} /> Cancel
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ margin: 0 }}>{caseData.title}</h1>
              {canUpload && (
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => { setIsEditingTitle(true); setEditedTitle(caseData.title); }}
                  title="Rename Case"
                >
                  <Edit3 size={14} /> Rename
                </button>
              )}
            </div>
          )}
          <p style={{ color: 'var(--text-muted)' }}>{caseData.description}</p>
        </div>
        <span className={`badge ${caseData.status === 'Open' ? 'badge-warning' : 'badge-neutral'}`}>
          {caseData.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2>Evidence & Documents</h2>
            {canUpload && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => handleUpload(e)} />
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsAiIngestOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}
                >
                  <Sparkles size={16} /> AI Ingest Pipeline
                </button>
                <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Processing...' : <><Upload size={16} style={{ display: 'inline', marginRight: '0.5rem' }} /> Upload Evidence</>}
                </button>
              </div>
            )}
          </div>


          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Hash / Integrity Anchor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No documents uploaded yet.</td>
                  </tr>
                )}
                {docs.map(doc => {
                  const status = verifyStatus[doc.id];
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FileText size={20} color="var(--text-muted)" />
                          <div>
                            <div style={{ fontWeight: 500 }}>{doc.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              v{doc.version} • {Math.round(doc.size / 1024)} KB
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="blockchain-anchor" style={{ padding: '0.5rem', margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          <span style={{ color: 'var(--text-muted)' }}>SHA-256: </span>
                          <span title={doc.hash}>{doc.hash.substring(0, 16)}...</span>
                          <div style={{ color: 'var(--success)', marginTop: '0.25rem', fontSize: '0.7rem' }}>Blockchain Anchored (Prototype)</div>
                        </div>
                        {status === 'verified' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <ShieldCheck size={16} /> VERIFIED
                          </div>
                        )}
                        {status === 'failed' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <ShieldAlert size={16} /> TAMPERING DETECTED
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <button className="btn-secondary" onClick={() => handleVerify(doc)}>
                            Verify Hash
                          </button>
                          <button className="btn-secondary" onClick={() => handleView(doc)}>
                            <Eye size={16} /> View
                          </button>
                          <button className="btn-secondary" onClick={() => handleOpenShare(doc)}>
                            <Share2 size={16} /> Share
                          </button>
                          {canUpload && (
                            <label className="btn-secondary" style={{ textAlign: 'center', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem' }}>
                              New Version
                              <input type="file" style={{ display: 'none' }} onChange={e => handleUpload(e, doc.id)} />
                            </label>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Controls Sidebar */}
        <div>
          <div className="demo-controls">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '1rem' }}>
              <Bug size={20} /> Controls
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {docs.map(doc => (
                <button key={`tamper-${doc.id}`} className="btn-danger" onClick={() => handleSimulateTamper(doc.id)} style={{ textAlign: 'left' }}>
                  Simulate Tampering: {doc.name} (v{doc.version})
                </button>
              ))}
              {docs.length === 0 && (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upload a document to enable tampering simulation.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIH Video Pitch Verification & Tamper Simulation Console */}
      <div style={{ marginTop: '2.5rem' }}>
        <VerificationDemo 
          evidence={{
            id: docs[0]?.id || "NV-EV-2026-000184",
            caseId: caseData.id,
            name: docs[0]?.name || "Forensic_Report_Apex_Storage_Dump_v1.pdf",
            title: "Forensic Report",
            type: docs[0]?.type || "application/pdf",
            size: docs[0]?.size || 2457600,
            uploadedBy: docs[0]?.uploadedBy || user?.id || "u1",
            uploadedAt: docs[0]?.uploadedAt || "2026-03-01T14:45:00.000Z",
            passport: docs[0]?.passport || {
              evidenceId: docs[0]?.id || "NV-EV-2026-000184",
              originalHash: docs[0]?.hash || "A9F82E8C3B...",
              classification: "Forensic Evidence",
              aiConfidence: 94,
              version: `V${docs[0]?.version || 1}`,
              integrityStatus: "VERIFIED",
              currentCustodian: "Forensic Laboratory",
              blockchainTx: "TX-982374",
              legalHold: "ACTIVE"
            }
          }}
        />
      </div>



      {/* View Document Modal */}
      {viewDoc && (
        <div className="modal-overlay" onClick={() => setViewDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Document Details</h2>
              <button onClick={() => setViewDoc(null)}><X size={24} color="var(--text-muted)" /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Name</div>
                  <div style={{ fontWeight: 600 }}>{viewDoc.name} (v{viewDoc.version})</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type</div>
                    <div>{viewDoc.type || 'Unknown'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Size</div>
                    <div>{Math.round(viewDoc.size / 1024)} KB</div>
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Uploaded Timestamp</div>
                  <div>{new Date(viewDoc.uploadedAt).toLocaleString()}</div>
                </div>
                <div className="blockchain-anchor" style={{ marginTop: '0.5rem' }}>
                  <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>Blockchain Integrity Anchor — Prototype</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>SHA-256: {viewDoc.hash}</div>
                </div>
              </div>

              {docPreviewUrl ? (
                <div className="document-preview-box" style={{ padding: 0 }}>
                  {viewDoc.type === 'application/pdf' ? (
                    <iframe src={docPreviewUrl} width="100%" height="100%" style={{ border: 'none', borderRadius: '8px' }} title="Document Preview" />
                  ) : (
                    <img src={docPreviewUrl} alt="Document preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
              ) : (
                <div className="document-preview-box">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={48} opacity={0.5} />
                    <span>Secure Preview Not Available for this File Type</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Document Modal */}
      {shareDoc && (
        <div className="modal-overlay" onClick={() => setShareDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Controlled Document Sharing</h2>
              <button onClick={() => setShareDoc(null)}><X size={24} color="var(--text-muted)" /></button>
            </div>
            <div className="modal-body">
              {shareSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: 'var(--success)' }}>Document Shared Securely</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Access has been granted. This action was recorded in the Audit Trail.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Document</div>
                    <div style={{ fontWeight: 600 }}>{shareDoc.name} (v{shareDoc.version})</div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Select Recipient Role</label>
                    <select className="input" style={{ width: '100%', appearance: 'none', cursor: 'pointer' }}>
                      <option>Legal Authority</option>
                      <option>External Auditor</option>
                      <option>Defense Counsel</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Permission Level</label>
                    <select className="input" style={{ width: '100%', appearance: 'none', cursor: 'pointer' }} disabled>
                      <option>View Only (Restricted)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            {!shareSuccess && (
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShareDoc(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleShareSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={16} /> Grant Access
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intelligent Upload Modal */}
      {caseData && (
        <IntelligentUploadModal 
          isOpen={isAiIngestOpen}
          onClose={() => setIsAiIngestOpen(false)}
          targetCaseId={caseData.id}
          onSuccess={(evidence: EvidenceObject) => {
            const newDocMeta: DocumentMetadata = {
              id: evidence.id,
              caseId: caseData.id,
              name: evidence.name,
              type: evidence.type,
              size: evidence.size,
              hash: evidence.passport.originalHash,
              uploadedBy: user?.id || 'u1',
              uploadedAt: new Date().toISOString(),
              version: 1,
              previousVersionId: null,
              ivArray: [12, 45, 78, 23, 89, 101, 214, 53, 90, 11, 44, 76],
              passport: evidence.passport
            };
            saveDocumentMetadata(newDocMeta);
            logAction('UPLOAD_DOC', `AI Ingested "${evidence.title}" with Evidence Passport ${evidence.passport.evidenceId}`);
            setDocs(getDocumentsForCase(caseData.id));
          }}
        />
      )}
    </div>
  );
};

export default CaseDetail;

