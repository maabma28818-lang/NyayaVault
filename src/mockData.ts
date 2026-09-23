import type { Case, EvidenceObject, EvidencePassport } from './types';

/**
 * Mock Case Object
 * Case ID: "MH-MUM-2026-00421"
 */
export const mockCase: Case = {
  id: 'MH-MUM-2026-00421',
  caseNumber: 'MH-MUM-2026-00421',
  title: 'State of Maharashtra vs. CyberSyndicate Apex',
  description: 'Multi-jurisdictional investigation into zero-day financial infrastructure compromise and illegal data exfiltration.',
  status: 'Open',
  createdAt: '2026-02-14T09:30:00.000Z',
  createdBy: 'u1',
  jurisdiction: 'Mumbai Cyber Crime Branch - Special Operations',
  investigatingOfficer: 'Senior Inspector Rajesh Kadam',
  department: 'Cyber Forensics & Digital Intelligence Unit',
  priority: 'Critical'
};

/**
 * Evidence Passport for the Forensic Report
 */
export const mockEvidencePassport: EvidencePassport = {
  evidenceId: 'NV-EV-2026-000184',
  originalHash: 'A9F82E8C3B...', // SHA-256 (also: A9F82E8C3B7142E9D843F6A5B9C2D0E1F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9)
  classification: 'Forensic Evidence',
  aiConfidence: 94, // AI Confidence: 94%
  version: 'V1',
  integrityStatus: 'VERIFIED',
  currentCustodian: 'Forensic Laboratory',
  blockchainTx: 'TX-982374',
  legalHold: 'ACTIVE',
  timestamp: '2026-03-01T14:45:00.000Z',
  verifiedAt: '2026-03-02T11:20:00.000Z'
};

/**
 * Mock Evidence Object representing "Forensic Report"
 * Encapsulating the Evidence Passport and full chain of custody
 */
export const mockEvidence: EvidenceObject = {
  id: 'NV-EV-2026-000184',
  caseId: 'MH-MUM-2026-00421',
  name: 'Forensic_Report_Apex_Storage_Dump_v1.pdf',
  title: 'Forensic Report',
  type: 'application/pdf',
  size: 2457600, // 2.4 MB
  description: 'Cryptographic digital forensic analysis and memory dump extraction report from targeted server nodes.',
  category: 'Forensic Evidence',
  uploadedBy: 'u1',
  uploadedAt: '2026-03-01T14:45:00.000Z',
  tags: ['Forensics', 'Memory Dump', 'Zero-Trust', 'Hardware Token', 'Chain-of-Custody'],
  passport: mockEvidencePassport,
  chainOfCustody: [
    {
      id: 'coc-1',
      timestamp: '2026-03-01T14:45:00.000Z',
      action: 'EVIDENCE_SEIZED_AND_INGESTED',
      actor: 'Sr. Inspector Rajesh Kadam (Badge #4829)',
      location: 'Cyber Forensic Cell, Mumbai',
      signature: '0x8f2d91...a14e'
    },
    {
      id: 'coc-2',
      timestamp: '2026-03-01T16:10:00.000Z',
      action: 'CRYPTOGRAPHIC_PASSPORT_GENERATED',
      actor: 'NyayaVault Hardware Security Module (HSM-01)',
      location: 'Zero-Trust Secure Enclave',
      signature: '0x3c7a91...e8b4'
    },
    {
      id: 'coc-3',
      timestamp: '2026-03-02T11:20:00.000Z',
      action: 'TRANSFERRED_TO_CUSTODIAN',
      actor: 'Chief Forensics Examiner Dr. V. Sen',
      location: 'Central Forensic Laboratory',
      signature: '0x19fa44...67dc'
    },
    {
      id: 'coc-4',
      timestamp: '2026-03-02T11:25:00.000Z',
      action: 'BLOCKCHAIN_LEDGER_ANCHORED',
      actor: 'Hyperledger Fabric Validator Node #3',
      location: 'State Law Enforcement Ledger',
      signature: 'TX-982374'
    }
  ]
};

/**
 * Additional mock datasets for dashboard consumption
 */
export const mockCases: Case[] = [
  mockCase,
  {
    id: 'MH-PUN-2026-00109',
    caseNumber: 'MH-PUN-2026-00109',
    title: 'Operation ShadowFall - Encrypted Comms Takedown',
    description: 'Intercepted and archived communications from compromised covert channel endpoints.',
    status: 'Open',
    createdAt: '2026-02-28T10:15:00.000Z',
    createdBy: 'u1',
    jurisdiction: 'Pune Cyber Division',
    investigatingOfficer: 'Inspector Amit Verma',
    department: 'Special Operations Task Force',
    priority: 'High'
  },
  {
    id: 'DL-NDLS-2025-00892',
    caseNumber: 'DL-NDLS-2025-00892',
    title: 'State vs. DarkVector Financial Syndicate',
    description: 'Digital ledger falsification and insider trading forensic investigation.',
    status: 'Closed',
    createdAt: '2025-11-10T16:40:00.000Z',
    createdBy: 'u2',
    jurisdiction: 'New Delhi Special Cell',
    investigatingOfficer: 'ACP Neha Mehra',
    department: 'Economic Offenses Wing',
    priority: 'Medium'
  }
];

export const mockEvidenceList: EvidenceObject[] = [
  mockEvidence,
  {
    id: 'NV-EV-2026-000185',
    caseId: 'MH-MUM-2026-00421',
    name: 'CCTV_ServerRoom_Access_Log_0214.mp4',
    title: 'Server Room Security Footage',
    type: 'video/mp4',
    size: 45097152, // 43 MB
    description: 'Surveillance video capture corresponding to unauthorized physical perimeter breach.',
    category: 'Digital Media',
    uploadedBy: 'u1',
    uploadedAt: '2026-03-02T08:30:00.000Z',
    tags: ['CCTV', 'Physical Breach', 'Video Evidence'],
    passport: {
      evidenceId: 'NV-EV-2026-000185',
      originalHash: 'B8C7E6D5F4...',
      classification: 'Digital Media',
      aiConfidence: 98,
      version: 'V1',
      integrityStatus: 'VERIFIED',
      currentCustodian: 'Forensic Laboratory',
      blockchainTx: 'TX-982410',
      legalHold: 'ACTIVE',
      timestamp: '2026-03-02T08:30:00.000Z',
      verifiedAt: '2026-03-02T08:35:00.000Z'
    }
  }
];

export default {
  mockCase,
  mockEvidencePassport,
  mockEvidence,
  mockCases,
  mockEvidenceList
};
