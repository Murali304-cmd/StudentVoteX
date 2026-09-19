import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileCheck2,
  Vote,
  ShieldCheck,
  Receipt,
  Activity,
  QrCode,
  Bell
} from 'lucide-react';

export function StudentSidebar() {
  const navItems = [
    { path: '/student/dashboard', label: 'Voter Dashboard', icon: LayoutDashboard },
    { path: '/student/id', label: 'My ID Card', icon: QrCode },
    { path: '/student/id-verification', label: 'ID Verification', icon: FileCheck2 },
    { path: '/student/elections', label: 'Active Elections', icon: Vote },
    { path: '/student/status', label: 'Voting Status', icon: Activity },
    { path: '/student/notifications', label: 'Notifications', icon: Bell },
    { path: '/student/profile', label: 'Student Profile', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid var(--border-subtle)',
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      position: 'sticky',
      top: '64px',
      padding: '24px 14px'
    }}>
      <div style={{
        fontSize: '0.68rem',
        fontWeight: 800,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        marginBottom: '12px',
        paddingLeft: '10px'
      }}>
        STUDENT VOTER PORTAL
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '9px',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0284c7' : 'var(--text-secondary)',
                background: isActive ? '#e0f2fe' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div style={{ marginTop: '30px', padding: '14px', background: '#f1f5f9', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Controlled Environment
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Voting occurs in fullscreen mode with browser session monitoring and cryptographic privacy protection.
        </div>
      </div>
    </aside>
  );
}
