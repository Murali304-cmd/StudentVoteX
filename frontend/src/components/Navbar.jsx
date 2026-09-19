import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Layers, 
  LogOut, 
  User, 
  Activity, 
  CheckCircle2, 
  Building2,
  Lock,
  Radio
} from 'lucide-react';
import { StudentVoiceXLogo } from './StudentVoiceXLogo';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ blockchainHeight: 2, totalTransactions: 3 });

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const data = await api.blockchain.getStats();
        if (mounted) setStats(data);
      } catch (e) {
        // silent fallback
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Brand & Organization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to={role === 'CEO' ? '/ceo/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StudentVoiceXLogo size={34} showText={true} showTagline={true} />
          <span className={`badge ${role === 'CEO' ? 'badge-amber' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', padding: '2px 8px', fontWeight: 700, marginLeft: '4px' }}>
            {role === 'CEO' ? 'CEO Suite' : role === 'ADMIN' ? 'Admin Portal' : 'Student Chamber'}
          </span>
        </Link>
      </div>


      {/* User Session & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.full_name || user.username}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <span className={`badge ${role === 'CEO' ? 'badge-amber' : role === 'ADMIN' ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: 800 }}>
                  {role === 'CEO' ? '👑 Chief Election Officer' : role === 'ADMIN' ? 'System Administrator' : (user.student_id || 'Student Voter')}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
            <Lock size={15} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
