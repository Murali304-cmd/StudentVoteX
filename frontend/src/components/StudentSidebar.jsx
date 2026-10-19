import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  QrCode,
  FileCheck2,
  Vote,
  Users,
  Award,
  Activity,
  Bell,
  User,
  ShieldCheck,
  Radio,
  Lock,
  ChevronRight,
  Sparkles,
  FilePlus2,
  PlayCircle,
  SearchCheck,
  MapPin,
  MessageSquareQuote,
  Sliders,
  Crown
} from 'lucide-react';

export function StudentSidebar() {
  const { user } = useAuth();

  const navGroups = [
    {
      groupTitle: 'STUDENT VOTER HUB',
      items: [
        { path: '/student/dashboard', label: 'Voter Dashboard', icon: LayoutDashboard },
        { path: '/student/representative', label: 'Department Rep & Roster', icon: Crown, badge: user?.is_representative ? 'DR' : 'HUB', isNew: true },
        { path: '/student/section', label: 'Class & Section Portal', icon: Building2, badge: `Sec ${user?.section || 'A'}` },
        { path: '/student/booth-radar', label: 'EVM Booth Radar & Map', icon: MapPin, isNew: true },
        { path: '/student/nomination', label: 'Run for Office', icon: FilePlus2, isNew: true },
        { path: '/student/id', label: 'My Smart ID Card', icon: QrCode },
        { path: '/student/id-verification', label: 'ID Verification & OCR', icon: FileCheck2 }
      ]
    },
    {
      groupTitle: 'BALLOTS & CANDIDATES',
      items: [
        { path: '/student/elections', label: 'Active Elections', icon: Vote },
        { path: '/student/candidates', label: 'Candidate Manifestos', icon: Users },
        { path: '/student/townhall', label: 'Democratic Townhall & AMA', icon: MessageSquareQuote, isNew: true },
        { path: '/student/practice-booth', label: 'Practice Ballot Sandbox', icon: PlayCircle, isNew: true },
        { path: '/student/certificates', label: 'Official Certificates', icon: Award }
      ]
    },
    {
      groupTitle: 'VERIFICATION & SECURITY',
      items: [
        { path: '/student/receipt-audit', label: 'Receipt & Merkle Audit', icon: SearchCheck, isNew: true },
        { path: '/student/status', label: 'Turnout & Ledger Status', icon: Activity },
        { path: '/student/notifications', label: 'Priority Alerts', icon: Bell },
        { path: '/student/profile', label: 'Student Profile & Face', icon: User },
        { path: '/student/settings', label: 'Preferences & Security', icon: Sliders }
      ]
    }
  ];

  return (
    <aside style={{
      width: '275px',
      minWidth: '275px',
      background: 'var(--bg-surface-translucent)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-subtle)',
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      position: 'sticky',
      top: '64px',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '20px',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      <div>
        {/* Student Mini Profile Card */}
        <div style={{
          padding: '14px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.05rem',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
            flexShrink: 0
          }}>
            {user?.full_name?.charAt(0) || 'S'}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.full_name || 'Student Voter'}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px',
                background: '#0284c7',
                color: '#ffffff'
              }}>
                Sec {user?.section || 'A'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {user?.student_id || 'STU2026001'}
              </span>
            </div>
          </div>
        </div>

        {/* Enter Chamber Fast CTA */}
        <NavLink
          to="/student/voting-session"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '0.84rem',
            fontWeight: 800,
            marginBottom: '18px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e'
            }} />
            <span>Voting Chamber</span>
          </div>
          <ChevronRight size={15} />
        </NavLink>

        {/* Navigation Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navGroups.map((group) => (
            <div key={group.groupTitle}>
              <div style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '6px',
                paddingLeft: '10px'
              }}>
                {group.groupTitle}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: isActive ? 800 : 500,
                        color: isActive ? '#0284c7' : 'var(--text-secondary)',
                        background: isActive ? 'var(--cyan-light)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={17} strokeWidth={2.2} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#0284c7',
                          color: '#ffffff'
                        }}>
                          {item.badge}
                        </span>
                      )}

                      {item.isNew && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          NEW
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Environment Box */}
      <div style={{
        padding: '12px',
        background: 'var(--bg-surface-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.72rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          <Lock size={12} color="#0284c7" />
          <span>Section 5 AEAD Privacy</span>
        </div>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Ballots cryptographically unlink student identity via zero-knowledge ephemeral tokens.
        </div>
      </div>
    </aside>
  );
}

export default StudentSidebar;
