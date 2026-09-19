import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, Clock, User, ShieldCheck } from 'lucide-react';

export function EVMAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.auditLogs.list();
        setLogs(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          System & Kiosk Audit Logs
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Cryptographically recorded operational events and administration actions.
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Action</th>
              <th style={{ padding: '14px 20px' }}>Actor</th>
              <th style={{ padding: '14px 20px' }}>Target</th>
              <th style={{ padding: '14px 20px' }}>Details</th>
              <th style={{ padding: '14px 20px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0284c7' }}>{log.action}</td>
                <td style={{ padding: '14px 20px', color: '#0f172a', fontWeight: 600 }}>{log.actor}</td>
                <td style={{ padding: '14px 20px', color: '#475569' }}>{log.target || 'System'}</td>
                <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.82rem' }}>{log.details}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.78rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMAuditLogs;
