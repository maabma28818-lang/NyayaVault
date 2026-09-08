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
}

export type AuditAction = 
  | 'LOGIN'
  | 'CREATE_CASE'
  | 'UPLOAD_DOC'
  | 'VIEW_DOC'
  | 'VERIFY_DOC'
  | 'VERIFY_FAILED'
  | 'CREATE_VERSION'
  | 'SHARE_DOCUMENT';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditAction;
  details: string;
}
