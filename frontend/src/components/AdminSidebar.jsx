import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Vote,
  UserCheck,
  ShieldAlert,
  FileCheck2,
  Box,
  Layers,
  ArrowLeftRight,
  GitFork,
  Network,
  Cpu,
  CheckCircle2,
  BarChart3,
  ScrollText,
  Sliders,
  UserPlus,
  Monitor,
  QrCode,
  Radio
} from 'lucide-react';

export function AdminSidebar() {
  const navSections = [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/students', label: 'Students Directory', icon: Users },
        { path: '/admin/evm-users', label: 'EVM Users / Kiosks', icon: Monitor },
        { path: '/admin/id-cards', label: 'Student ID Cards', icon: QrCode },
        { path: '/admin/verification', label: 'ID Verification', icon: FileCheck2 },
        { path: '/admin/elections', label: 'Elections', icon: Vote },
        { path: '/admin/candidates', label: 'Candidates', icon: UserPlus },
        { path: '/admin/voters', label: 'Voter Registry', icon: UserCheck },
      ]
    },
    {
      title: 'BFT AUDIT BLOCKCHAIN',
      items: [
        { path: '/admin/blockchain', label: 'Audit Explorer', icon: Box },
        { path: '/admin/blocks', label: 'Audit Block Ledger', icon: Layers },
        { path: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
        { path: '/admin/merkle-tree', label: 'SHA-3 Merkle Tree', icon: GitFork },
        { path: '/admin/network', label: 'BFT Multi-Witness Mesh', icon: Network },
        { path: '/admin/validation', label: 'Chain Integrity Auditor', icon: CheckCircle2 },
      ]
    },
    {
      title: 'SECURITY & RESULTS',
      items: [
        { path: '/admin/access-control', label: 'Campus Access Gateway', icon: Radio },
        { path: '/admin/results', label: 'Certified Results', icon: BarChart3 },
        { path: '/admin/security-events', label: 'Security Events', icon: ShieldAlert },
        { path: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
        { path: '/admin/settings', label: 'System Settings', icon: Sliders },
      ]
    }
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
      padding: '20px 14px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              paddingLeft: '10px'
            }}>
              {sec.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sec.items.map((item) => {
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
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#0284c7' : 'var(--text-secondary)',
                      background: isActive ? '#e0f2fe' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    <Icon size={16} strokeWidth={2.2} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Launch EVM Booth Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '12px',
          padding: '14px',
          color: '#ffffff',
          marginTop: '6px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🗳️</span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                EVM Polling Booth
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Hardware Ballot Unit
              </div>
            </div>
          </div>

          <a
            href="/evm-kiosk"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              marginTop: '4px',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.4)'
            }}
          >
            <span>Open Voting Kiosk ↗</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
