import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StudentVoiceXLogo } from './StudentVoiceXLogo';
import {
  LayoutDashboard,
  Vote,
  Users,
  ShieldCheck,
  CheckSquare,
  BarChart3,
  AlertTriangle,
  Blocks,
  FileText,
  LogOut,
  Monitor,
  UserCheck
} from 'lucide-react';

export function EVMLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/evm/dashboard', icon: LayoutDashboard },
    { label: 'Elections', path: '/evm/elections', icon: Vote },
    { label: 'Candidates', path: '/evm/candidates', icon: Users },
    { label: 'Voters', path: '/evm/voters', icon: UserCheck },
    { label: 'Verification', path: '/evm/verification', icon: ShieldCheck },
    { label: 'Voting Sessions', path: '/evm/voting-sessions', icon: CheckSquare },
    { label: 'Results', path: '/evm/results', icon: BarChart3 },
    { label: 'Security Events', path: '/evm/security-events', icon: AlertTriangle },
    { label: 'Blockchain', path: '/evm/blockchain', icon: Blocks },
    { label: 'Audit Logs', path: '/evm/audit-logs', icon: FileText }
  ];

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        background: '#f8fafc',
        color: '#0f172a'
      }}
    >
      {/* Sidebar (No external scroll) */}
      <aside
        style={{
          width: '250px',
          height: '100vh',
          maxHeight: '100vh',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '18px 14px',
          flexShrink: 0,
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Logo */}
          <div style={{ padding: '0 6px 16px 6px', borderBottom: '1px solid #f1f5f9' }}>
            <StudentVoiceXLogo
              size={32}
              showText={true}
              showTagline={false}
              institutionLabel="ABC INSTITUTION"
              isDark={false}
            />
            <div
              style={{
                marginTop: '8px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#059669',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Monitor size={11} />
              <span>EVM KIOSK TERMINAL</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.12s ease',
                    color: isActive ? '#0284c7' : '#475569',
                    background: isActive ? '#e0f2fe' : 'transparent'
                  })}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '0 6px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.78rem'
              }}
            >
              EVM
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user?.full_name || 'EVM Terminal'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                Station Online
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#e11d48',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Zero Unwanted Page Scrolling) */}
      <main
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          padding: '24px 32px',
          overflowY: 'auto'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default EVMLayout;
