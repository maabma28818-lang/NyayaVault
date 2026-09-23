
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Folder, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert color="var(--accent-primary)" size={28} />
          <h2 style={{ fontSize: '1.25rem' }}>NyayaVault</h2>
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink 
            to="/cases" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
              border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
            })}
          >
            <Folder size={20} /> Cases & Documents
          </NavLink>

          <NavLink 
            to="/audit" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
              border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
            })}
          >
            <ShieldAlert size={20} /> Audit Trail
          </NavLink>
        </nav>



        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div style={{ color: 'var(--text-muted)' }}>
            SIH26190 Prototype — Secure Document Management
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-neutral">{user?.role}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border-strong)' }}>
              <UserIcon size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '0.875rem' }}>{user?.name}</span>
            </div>
          </div>
        </header>
        
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
