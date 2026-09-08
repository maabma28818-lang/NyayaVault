import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Login = () => {
  const { users, login, user } = useAuth();
  const { logAction } = useAudit();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = (userId: string) => {
    login(userId);
    logAction('LOGIN', 'User logged into the system', userId);
  };

  return (
    <div className="layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="card animate-fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <Shield size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>NyayaVault</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Secure Digital Document Management System
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map(u => (
            <button 
              key={u.id} 
              className="btn-secondary" 
              onClick={() => handleLogin(u.id)}
              style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{u.name}</span>
              <span className="badge badge-neutral">{u.role}</span>
            </button>
          ))}
        </div>
        
        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Prototype MVP - SIH26190
        </p>
      </div>
    </div>
  );
};

export default Login;
