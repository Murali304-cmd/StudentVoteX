import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Vote,
  Search,
  Filter,
  Check,
  CheckCheck,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SECTION' | 'ELECTION' | 'SECURITY'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.student.getNotifications(user?.student_id || user?.username);
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      } else {
        // Fallback default notifications
        const sec = user?.section || 'A';
        const dept = user?.department || 'Information Technology';
        setNotifications([
          {
            id: 1,
            title: `Section ${sec} Polling Chamber Open`,
            message: `Official polling for Section ${sec} (${dept}) is active at Kiosk-01 (Tech Block Room 201). Cast your vote before 12:00 PM.`,
            notification_type: 'SECTION',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            link: '/student/voting-session'
          },
          {
            id: 2,
            title: 'Smart Card Verification Approved',
            message: `Your student digital smart credential was validated with SHA-256 document seal. Authorized for Section ${sec} voter roster.`,
            notification_type: 'SECURITY',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            link: '/student/id'
          },
          {
            id: 3,
            title: 'Student Council General Election 2026',
            message: 'All campus ballots are open for voting today from 09:00 AM to 12:00 PM. Compare candidate manifestos now.',
            notification_type: 'ELECTION',
            is_read: false,
            created_at: new Date(Date.now() - 7200000).toISOString(),
            link: '/student/elections'
          },
          {
            id: 4,
            title: 'Section Turnout Milestone Reached',
            message: `Section ${sec} has achieved 84.4% voter turnout, leading the intra-department participation leaderboard!`,
            notification_type: 'SECTION',
            is_read: false,
            created_at: new Date(Date.now() - 1800000).toISOString(),
            link: '/student/section'
          }
        ]);
      }
    } catch (err) {
      console.warn("Using sample notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.student.markNotificationRead(id, user?.student_id);
    } catch (e) {
      // ignore
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    try {
      await api.student.markAllNotificationsRead(user?.student_id);
    } catch (e) {
      // ignore
    }
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifs = notifications.filter(n => {
    const matchSearch = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        n.message?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;

    if (activeTab === 'SECTION') return n.notification_type?.includes('SECTION');
    if (activeTab === 'ELECTION') return n.notification_type?.includes('ELECTION');
    if (activeTab === 'SECURITY') return n.notification_type?.includes('SECURITY') || n.notification_type?.includes('VERIF');
    return true;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            <Bell size={15} />
            <span>Campus &amp; Section Bulletins</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Notifications &amp; Priority Alerts
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Official announcements, voting session deadlines, and Section {user?.section || 'A'} updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {[
            { key: 'ALL', label: 'All Alerts' },
            { key: 'SECTION', label: `Section ${user?.section || 'A'}` },
            { key: 'ELECTION', label: 'Elections' },
            { key: 'SECURITY', label: 'Security' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? '#0284c7' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: activeTab === tab.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifs.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '16px' }}>
            <Bell size={36} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
            <div style={{ fontWeight: 700, color: '#0f172a' }}>No notifications found</div>
            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>All caught up! No active bulletins for this category.</div>
          </div>
        ) : (
          filteredNotifs.map(n => {
            const isSection = n.notification_type?.includes('SECTION');
            const isElection = n.notification_type?.includes('ELECTION');

            return (
              <div
                key={n.id}
                style={{
                  background: n.is_read ? '#ffffff' : '#f0f9ff',
                  border: n.is_read ? '1px solid #e2e8f0' : '1.5px solid #bae6fd',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: isSection ? '#e0f2fe' : isElection ? '#dcfce7' : '#ede9fe',
                  color: isSection ? '#0284c7' : isElection ? '#15803d' : '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isSection ? <Building2 size={20} /> : isElection ? <Vote size={20} /> : <ShieldCheck size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {n.title}
                      </h3>
                      {!n.is_read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                      )}
                    </div>

                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '6px 0 10px 0' }}>
                    {n.message}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {n.link && (
                      <Link
                        to={n.link}
                        style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}

                    {!n.is_read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(n.id)}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default StudentNotifications;
