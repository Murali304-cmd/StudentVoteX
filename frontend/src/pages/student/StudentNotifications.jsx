import React, { useState } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export function StudentNotifications() {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Institutional Voting Session Open',
      message: 'Student Council General Election 2026 is officially open for ballots. Cast your vote before 25 Sep 2026.',
      time: '2 hours ago',
      type: 'ELECTION',
      icon: <Bell size={18} color="#0284c7" />
    },
    {
      id: 2,
      title: 'Identity Verification Complete',
      message: 'Your ABC Institution student smart card verification was successfully approved with 99.6% biometric match.',
      time: '1 day ago',
      type: 'VERIFICATION',
      icon: <ShieldCheck size={18} color="#059669" />
    },
    {
      id: 3,
      title: 'Welcome to StudentVoiceX',
      message: 'Your educational permissioned blockchain voting profile has been initialized.',
      time: '2 days ago',
      type: 'SYSTEM',
      icon: <CheckCircle2 size={18} color="#7c3aed" />
    }
  ]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Notifications & Election Alerts
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Official institutional announcements, voting alerts, and credential verification updates.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {n.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {n.title}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentNotifications;
