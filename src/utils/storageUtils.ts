import localforage from 'localforage';
import type {  User, Case, DocumentMetadata, AuditLog  } from '../types';

// Initialize IndexedDB instances
const fileStorage = localforage.createInstance({
  name: 'NyayaVault',
  storeName: 'encrypted_files'
});

// Helper for localStorage with type safety
const getLocal = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setLocal = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Users ---
export const getUsers = (): User[] => getLocal<User[]>('nv_users', []);
export const setUsers = (users: User[]) => setLocal('nv_users', users);

// --- Cases ---
export const getCases = (): Case[] => getLocal<Case[]>('nv_cases', []);
export const saveCase = (newCase: Case) => {
  const cases = getCases();
  const existingIndex = cases.findIndex(c => c.id === newCase.id);
  if (existingIndex >= 0) {
    cases[existingIndex] = newCase;
  } else {
    cases.push(newCase);
  }
  setLocal('nv_cases', cases);
};

// --- Documents (Metadata) ---
export const getDocuments = (): DocumentMetadata[] => getLocal<DocumentMetadata[]>('nv_docs', []);
export const saveDocumentMetadata = (doc: DocumentMetadata) => {
  const docs = getDocuments();
  const existingIndex = docs.findIndex(d => d.id === doc.id);
  if (existingIndex >= 0) {
    docs[existingIndex] = doc;
  } else {
    docs.push(doc);
  }
  setLocal('nv_docs', docs);
};

export const getDocumentsForCase = (caseId: string): DocumentMetadata[] => {
  return getDocuments().filter(d => d.caseId === caseId);
};

// --- Files (IndexedDB) ---
export const saveEncryptedFile = async (id: string, encryptedBlob: Blob) => {
  await fileStorage.setItem(id, encryptedBlob);
};

export const getEncryptedFile = async (id: string): Promise<Blob | null> => {
  return await fileStorage.getItem<Blob>(id);
};

// Demo Control: Tamper with file
export const tamperWithFile = async (id: string) => {
  const blob = await getEncryptedFile(id);
  if (blob) {
    // Append some garbage data to corrupt the blob slightly
    const tamperedBlob = new Blob([blob, new Uint8Array([0, 1, 2, 3])]);
    await fileStorage.setItem(id, tamperedBlob);
  }
};

// --- Audit Trail ---
export const getAuditLogs = (): AuditLog[] => getLocal<AuditLog[]>('nv_audit', []);
export const logAudit = (log: AuditLog) => {
  const logs = getAuditLogs();
  logs.push(log); // Append only
  setLocal('nv_audit', logs);
};
