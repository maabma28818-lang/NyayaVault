import { setUsers, saveCase, getCases, saveDocumentMetadata, getDocuments, saveEncryptedFile, getEncryptedFile, logAudit, getAuditLogs } from './storageUtils';
import { encryptFile, generateHash } from './cryptoUtils';
import type { User } from '../types';
import { mockCases, mockEvidence } from '../mockData';

export const seedInitialData = async () => {
  const existingCases = getCases();
  if (existingCases.length === 0) {
    const demoUsers: User[] = [
      { id: 'u1', name: 'Inspector Raj', role: 'Investigator' },
      { id: 'u2', name: 'Judge Sharma', role: 'LegalAuthority' },
      { id: 'u3', name: 'System Admin', role: 'Admin' }
    ];

    setUsers(demoUsers);

    // Seed default cases including MH-MUM-2026-00421
    mockCases.forEach(c => saveCase(c));
  }

  // Seed default evidence document and encrypted file if not exists
  const existingDocs = getDocuments();
  if (existingDocs.length === 0) {
    try {
      const sampleText = "CONFIDENTIAL DIGITAL FORENSIC ANALYSIS REPORT\nTarget: CyberSyndicate Apex Server Node #4\nSHA-256 Verified Payload: A9F82E8C3B...";
      const sampleBuffer = new TextEncoder().encode(sampleText).buffer as ArrayBuffer;
      const hash = await generateHash(sampleBuffer);
      const { encryptedBlob, iv } = await encryptFile(sampleBuffer);

      await saveEncryptedFile(mockEvidence.id, encryptedBlob);

      saveDocumentMetadata({
        id: mockEvidence.id,
        caseId: mockEvidence.caseId,
        name: mockEvidence.name,
        type: mockEvidence.type,
        size: mockEvidence.size,
        hash: hash,
        uploadedBy: mockEvidence.uploadedBy,
        uploadedAt: mockEvidence.uploadedAt,
        version: 1,
        previousVersionId: null,
        ivArray: Array.from(iv),
        passport: {
          ...mockEvidence.passport,
          originalHash: hash
        }
      });
    } catch (e) {
      console.warn('Initial file encryption seeding failed, using fallback metadata', e);
      saveDocumentMetadata({
        id: mockEvidence.id,
        caseId: mockEvidence.caseId,
        name: mockEvidence.name,
        type: mockEvidence.type,
        size: mockEvidence.size,
        hash: mockEvidence.passport.originalHash,
        uploadedBy: mockEvidence.uploadedBy,
        uploadedAt: mockEvidence.uploadedAt,
        version: 1,
        previousVersionId: null,
        ivArray: [12, 45, 78, 23, 89, 101, 214, 53, 90, 11, 44, 76],
        passport: mockEvidence.passport
      });
    }
  } else {
    // If doc exists but blob missing in IndexedDB, ensure blob is created
    const existingBlob = await getEncryptedFile(mockEvidence.id);
    if (!existingBlob) {
      try {
        const sampleText = "CONFIDENTIAL DIGITAL FORENSIC ANALYSIS REPORT\nTarget: CyberSyndicate Apex Server Node #4\nSHA-256 Verified Payload: A9F82E8C3B...";
        const sampleBuffer = new TextEncoder().encode(sampleText).buffer as ArrayBuffer;
        const { encryptedBlob } = await encryptFile(sampleBuffer);
        await saveEncryptedFile(mockEvidence.id, encryptedBlob);
      } catch (e) {
        console.warn('Fallback blob creation skipped', e);
      }
    }
  }

  // Seed initial audit trail logs if empty
  const existingAuditLogs = getAuditLogs();
  if (existingAuditLogs.length === 0) {
    const demoAuditLogs = [
      {
        id: 'audit-001',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        userId: 'u3',
        action: 'LOGIN' as const,
        details: 'System Administrator initialized NyayaVault HSM secure key enclave and verified Hyperledger consortium connectivity.'
      },
      {
        id: 'audit-002',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        userId: 'u1',
        action: 'CREATE_CASE' as const,
        details: 'Created case MH-MUM-2026-00421 (State of Maharashtra vs. CyberSyndicate Apex)'
      },
      {
        id: 'audit-003',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        userId: 'u1',
        action: 'UPLOAD_DOC' as const,
        details: 'AI Ingested "Forensic Report" - Generated Evidence Passport NV-EV-2026-000184 (Hash: A9F82E8C3B...)'
      },
      {
        id: 'audit-004',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: 'u2',
        action: 'VIEW_DOC' as const,
        details: 'Judge Sharma inspected Evidence Passport NV-EV-2026-000184 with read-only judicial provenance verification.'
      },
      {
        id: 'audit-005',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        userId: 'u1',
        action: 'VERIFY_DOC' as const,
        details: 'Cryptographic SHA-256 hash verified against Hyperledger block TX-982374. Zero-Trust integrity confirmed.'
      }
    ];

    demoAuditLogs.forEach(log => logAudit(log));
  }
};
