import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useInstitution } from '../context/InstitutionContext';
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
  Radio,
  Sun,
  Moon,
  Sparkles,
  Sliders
} from 'lucide-react';
import { StudentVoiceXLogo } from './StudentVoiceXLogo';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const { theme, isDark, toggleTheme, bgMode } = useTheme();
  const { institutionName, shortName } = useInstitution();
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
      background: 'var(--bg-surface-translucent)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      {/* Brand & Organization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to={role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StudentVoiceXLogo
            size={34}
            showText={true}
            showTagline={true}
            institutionLabel={institutionName ? institutionName.toUpperCase() : null}
            isDark={isDark}
          />
          <span className={`badge ${role === 'ADMIN' ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', padding: '2px 8px', fontWeight: 700, marginLeft: '4px' }}>
            {role === 'ADMIN' ? 'Admin Portal' : 'Student Chamber'}
          </span>
        </Link>
      </div>

      {/* Middle Telemetry Chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.06)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>BFT Consensus Height #{stats?.blockchainHeight || 42}</span>
        </div>
      </div>

      {/* User Session & Logout & Theme Toggle & Portal Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Portal Settings Shortcut */}
        <Link
          to={role === 'ADMIN' ? '/admin/settings' : '/student/settings'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          title="Portal Preferences & Institutional Settings"
        >
          <Sliders size={16} />
        </Link>

        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)',
            border: '1px solid var(--border-subtle)',
            color: isDark ? '#38bdf8' : '#0284c7',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={isDark ? 'Switch to Light Glass Mode' : 'Switch to Dark Cyber Mode'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.full_name || user.username}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <span className={`badge ${role === 'ADMIN' ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: 800 }}>
                  {role === 'ADMIN' ? 'System Administrator' : (user.student_id || 'Student Voter')}
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
