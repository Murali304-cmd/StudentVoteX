import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export function EVMSecurityEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.securityEvents.list();
        setEvents(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching security events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Kiosk Telemetry & Security Events
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Real-time proctoring telemetry, tab switches, and fullscreen session events.
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Severity</th>
              <th style={{ padding: '14px 20px' }}>Event Type</th>
              <th style={{ padding: '14px 20px' }}>Student</th>
              <th style={{ padding: '14px 20px' }}>Details</th>
              <th style={{ padding: '14px 20px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background:
                        ev.severity === 'HIGH' || ev.severity === 'CRITICAL'
                          ? '#fff1f2'
                          : ev.severity === 'MEDIUM'
                          ? '#fef3c7'
                          : '#f0fdf4',
                      color:
                        ev.severity === 'HIGH' || ev.severity === 'CRITICAL'
                          ? '#e11d48'
                          : ev.severity === 'MEDIUM'
                          ? '#d97706'
                          : '#16a34a'
                    }}
                  >
                    {ev.severity}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{ev.event_type}</td>
                <td style={{ padding: '14px 20px', color: '#0284c7', fontWeight: 600 }}>{ev.student_name || ev.student_id || 'Anonymous'}</td>
                <td style={{ padding: '14px 20px', color: '#475569', fontSize: '0.82rem' }}>{ev.details}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.78rem' }}>
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMSecurityEvents;
