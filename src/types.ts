export type Role = 'Admin' | 'Investigator' | 'LegalAuthority';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'Closed';
  createdAt: string;
  createdBy: string; // User ID
  caseNumber?: string;
  jurisdiction?: string;
  investigatingOfficer?: string;
  department?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export type IntegrityStatus = 'VERIFIED' | 'TAMPERED' | 'PENDING' | 'CORRUPTED';
export type LegalHoldStatus = 'ACTIVE' | 'INACTIVE' | 'RELEASED';
export type EvidenceClassification = 
  | 'Forensic Evidence'
  | 'Digital Media'
  | 'Forensic Report'
  | 'Documentary Evidence'
  | 'Chain of Custody'
  | 'Ballistics & Physical';

export interface EvidencePassport {
  evidenceId: string;
  originalHash: string; // SHA-256
  classification: EvidenceClassification | string;
  aiConfidence: number; // e.g. 94 (representing 94%)
  version: string; // e.g. "V1"
  integrityStatus: IntegrityStatus;
  currentCustodian: string;
  blockchainTx: string; // e.g. "TX-982374"
  legalHold: LegalHoldStatus;
  timestamp?: string;
  verifiedAt?: string;
}

export interface EvidenceObject {
  id: string;
  caseId: string;
  name: string;
  title: string;
  type: string;
  size: number;
  passport: EvidencePassport;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  category?: string;
  tags?: string[];
  chainOfCustody?: Array<{
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    location: string;
    signature: string;
  }>;
}

export interface DocumentMetadata {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  uploadedBy: string; // User ID
  uploadedAt: string;
  version: number;
  previousVersionId: string | null;
  ivArray: number[]; // Store IV as standard array for serialization
  passport?: EvidencePassport;
}

export type AuditAction = 
  | 'LOGIN'
  | 'CREATE_CASE'
  | 'UPLOAD_DOC'
  | 'VIEW_DOC'
  | 'VERIFY_DOC'
  | 'VERIFY_FAILED'
  | 'CREATE_VERSION'
  | 'SHARE_DOCUMENT'
  | 'LEGAL_HOLD_UPDATE'
  | 'CUSTODIAN_TRANSFER';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditAction;
  details: string;
}

