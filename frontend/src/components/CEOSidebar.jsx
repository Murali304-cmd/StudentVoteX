import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Crown,
  LayoutDashboard,
  Building2,
  Lock,
  Award,
  ShieldAlert,
  HardDrive,
  Vote,
  Users,
  LogOut,
  Radio,
  FileCheck2,
  Terminal,
  ExternalLink
} from 'lucide-react';

const ceoNavItems = [
  { path: '/ceo/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { path: '/admin/elections', label: 'All Digital Ballots', icon: Vote },
  { path: '/admin/students', label: 'Institutional Voters', icon: Users },
  { path: '/admin/blockchain', label: 'Blockchain Core & Nodes', icon: HardDrive },
  { path: '/admin/security-events', label: 'AI Fraud Radar', icon: ShieldAlert },
  { path: '/admin/results/1', label: 'Live Tally & IRV', icon: Award },
  { path: '/admin/audit-logs', label: 'Global Audit Trail', icon: FileCheck2 },
  { path: '/evm-kiosk', label: 'EVM Kiosk Portal ↗', icon: ExternalLink, isExternal: true },
];

export function CEOSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      overflowY: 'auto'
    }}>
      {/* CEO Executive Badge */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
          }}>
            <Crown size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#78350f', letterSpacing: '-0.01em' }}>
              Chief Election Officer
            </div>
            <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot-green" style={{ width: '6px', height: '6px' }}></span>
              Executive Commission
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.05em' }}>
          Executive Governance
        </div>

        {ceoNavItems.map((item) => {
          const Icon = item.icon;
          if (item.isExternal) {
            return (
              <a
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  color: '#d97706',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  background: '#fffbeb',
                  border: '1px dashed #fde68a',
                  marginTop: '8px'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 14px',
                borderRadius: '10px',
                color: isActive ? '#d97706' : 'var(--text-secondary)',
                background: isActive ? '#fef3c7' : 'transparent',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-secondary)' }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Signed in as: <strong style={{ color: 'var(--text-primary)' }}>{user?.full_name || 'Chief Election Officer'}</strong>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.78rem', padding: '6px', justifyContent: 'center' }}
        >
          <LogOut size={14} />
          <span>Exit Executive Suite</span>
        </button>
      </div>
    </aside>
  );
}
