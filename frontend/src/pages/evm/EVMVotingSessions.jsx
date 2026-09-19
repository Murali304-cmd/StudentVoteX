import React, { useState } from 'react';
import { CheckSquare, Monitor, Shield, Activity, RefreshCw } from 'lucide-react';

export function EVMVotingSessions() {
  const [sessions] = useState([
    { id: 'SESS-2026-091A', terminal: 'EVM Terminal #01', studentRef: 'STU***001', status: 'COMPLETED', time: '2 mins ago', blockRef: '#1048' },
    { id: 'SESS-2026-092B', terminal: 'EVM Terminal #01', studentRef: 'STU***002', status: 'COMPLETED', time: '8 mins ago', blockRef: '#1047' },
    { id: 'SESS-2026-093C', terminal: 'EVM Terminal #02', studentRef: 'STU***005', status: 'ACTIVE', time: 'In Progress', blockRef: 'Pending' },
    { id: 'SESS-2026-094D', terminal: 'EVM Terminal #01', studentRef: 'STU***006', status: 'COMPLETED', time: '18 mins ago', blockRef: '#1045' },
    { id: 'SESS-2026-095E', terminal: 'EVM Kiosk Web', studentRef: 'STU***007', status: 'COMPLETED', time: '24 mins ago', blockRef: '#1044' }
  ]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Live Kiosk Voting Sessions
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Real-time session monitoring with zero identity exposure (anonymized session tokens).
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Session ID</th>
              <th style={{ padding: '14px 20px' }}>Terminal</th>
              <th style={{ padding: '14px 20px' }}>Anonymized Voter Token</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Timestamp</th>
              <th style={{ padding: '14px 20px' }}>Block Reference</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{s.id}</td>
                <td style={{ padding: '14px 20px', color: '#475569' }}>{s.terminal}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 700 }}>{s.studentRef}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: s.status === 'COMPLETED' ? '#d1fae5' : '#e0f2fe',
                      color: s.status === 'COMPLETED' ? '#059669' : '#0284c7'
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#64748b' }}>{s.time}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#7c3aed', fontWeight: 700 }}>{s.blockRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMVotingSessions;
