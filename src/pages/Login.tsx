import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Scale, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const { users, login, user } = useAuth();
  const { logAction } = useAudit();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/cases');
    }
  }, [user, navigate]);


  const handleLogin = (userId: string) => {
    login(userId);
    logAction('LOGIN', 'User authenticated into Zero-Trust Enclave', userId);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Investigator': return <UserCheck size={18} color="#60a5fa" />;
      case 'LegalAuthority': return <Scale size={18} color="#fbbf24" />;
      case 'Admin': return <ShieldAlert size={18} color="#f87171" />;
      default: return <ShieldCheck size={18} color="#34d399" />;
    }
  };

  return (
    <div className="layout" style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at 50% 30%, rgba(20, 24, 38, 1) 0%, rgba(10, 10, 12, 1) 100%)' }}>
      <div className="card animate-fade-in" style={{ width: '440px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '2px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        }}>
          <ShieldCheck size={32} color="#3b82f6" />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          NyayaVault
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Zero-Trust Digital Document Management System
        </p>

        <div style={{ textAlign: 'left', marginBottom: '0.75rem', fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
          Select Authority Role to Authenticate:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {users.map(u => (
            <button 
              key={u.id} 
              className="btn-secondary" 
              onClick={() => handleLogin(u.id)}
              style={{
                padding: '0.9rem 1.15rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(20, 26, 44, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                  {getRoleIcon(u.role)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${
                  u.role === 'Investigator' ? 'badge-neutral' :
                  u.role === 'LegalAuthority' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {u.role}
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </div>
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '2rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.06)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)', fontSize: '0.75rem', color: '#94a3b8' }}>
          Smart India Hackathon SIH26190 Prototype Enclave
        </div>
      </div>
    </div>
  );
};

export default Login;

