import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Case } from '../types';
import { getCases, saveCase } from '../utils/storageUtils';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import { Plus, Search, Edit3, X } from 'lucide-react';

const CasesList = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [search, setSearch] = useState('');
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Rename Modal State
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const { user } = useAuth();
  const { logAction } = useAudit();
  const navigate = useNavigate();

  const loadCases = () => {
    setCases(getCases());
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleOpenCreate = () => {
    setNewTitle('');
    setNewDescription('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (user?.role !== 'Investigator' && user?.role !== 'Admin') return;
    
    const newCase: Case = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDescription.trim() || 'No description provided.',
      status: 'Open',
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    saveCase(newCase);
    logAction('CREATE_CASE', `Created case "${newCase.title}" (${newCase.id})`);
    setIsCreateOpen(false);
    navigate(`/cases/${newCase.id}`);
  };

  const handleOpenRename = (c: Case) => {
    setEditingCase(c);
    setRenameTitle(c.title);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTitle.trim() || !editingCase) return;

    const updated: Case = { ...editingCase, title: renameTitle.trim() };
    saveCase(updated);
    logAction('CREATE_CASE', `Renamed case to "${updated.title}" (${updated.id})`);
    loadCases();
    setEditingCase(null);
  };

  const canManage = user?.role === 'Investigator' || user?.role === 'Admin';
  const filtered = cases.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Cases & Documents</h1>
        {canManage && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleOpenCreate}>
            <Plus size={18} /> New Case
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          className="input" 
          placeholder="Search cases..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', padding: 0 }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Case Title</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No cases found</td>
              </tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.title}</td>
                <td>
                  <span className={`badge ${c.status === 'Open' ? 'badge-warning' : 'badge-neutral'}`}>
                    {c.status}
                  </span>
                </td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="btn-secondary" onClick={() => navigate(`/cases/${c.id}`)}>
                      View Details
                    </button>
                    {canManage && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleOpenRename(c)}
                        title="Rename Case"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Edit3 size={14} /> Rename
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Case Modal */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Create New Investigation Case</h3>
              <button 
                onClick={() => setIsCreateOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Case Title <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g., Financial Fraud Investigation #402" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Case Description
                  </label>
                  <textarea 
                    className="input" 
                    placeholder="Enter case summary, jurisdiction, or relevant details..." 
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!newTitle.trim()}>
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Case Modal */}
      {editingCase && (
        <div className="modal-overlay" onClick={() => setEditingCase(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Rename Case</h3>
              <button 
                onClick={() => setEditingCase(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Case Title <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    value={renameTitle}
                    onChange={e => setRenameTitle(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditingCase(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!renameTitle.trim()}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesList;

