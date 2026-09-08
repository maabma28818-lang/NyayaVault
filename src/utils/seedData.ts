import { setUsers, saveCase, getCases } from './storageUtils';
import type {  User, Case  } from '../types';

export const seedInitialData = () => {
  const existingCases = getCases();
  if (existingCases.length > 0) return; // Already seeded

  const demoUsers: User[] = [
    { id: 'u1', name: 'Inspector Raj', role: 'Investigator' },
    { id: 'u2', name: 'Judge Sharma', role: 'LegalAuthority' },
    { id: 'u3', name: 'System Admin', role: 'Admin' }
  ];

  setUsers(demoUsers);

  const demoCases: Case[] = [
    {
      id: 'c1',
      title: 'State vs. CyberSyndicate',
      description: 'Investigation into the 2026 centralized exchange hack.',
      status: 'Open',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      createdBy: 'u1'
    },
    {
      id: 'c2',
      title: 'Operation ShadowFall',
      description: 'Undercover operations seizing illegal contraband documents.',
      status: 'Closed',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      createdBy: 'u1'
    }
  ];

  demoCases.forEach(c => saveCase(c));
};
