import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';

export function EVMVerification() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerifications() {
      try {
        const res = await api.verification.list();
        setVerifications(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching verifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVerifications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.verification.update(id, { status });
      setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Student ID Verification & Smart Card Validation
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Inspect submitted institutional smart cards, match scores, and grant voting clearance.
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Student</th>
              <th style={{ padding: '14px 20px' }}>Extracted ID</th>
              <th style={{ padding: '14px 20px' }}>Document Hash</th>
              <th style={{ padding: '14px 20px' }}>Match Score</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                  {v.student_details?.full_name || 'Student'}
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 700 }}>
                  {v.extracted_id_number || 'ABC-ID'}
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                  {v.document_hash ? v.document_hash.substring(0, 16) + '...' : 'SHA-256 Valid'}
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#059669' }}>
                  {v.match_score}%
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: v.status === 'VERIFIED' ? '#d1fae5' : '#fef3c7',
                      color: v.status === 'VERIFIED' ? '#059669' : '#d97706'
                    }}
                  >
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {v.status !== 'VERIFIED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(v.id, 'VERIFIED')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid #10b981',
                          background: '#ecfdf5',
                          color: '#059669',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Approve ✓
                      </button>
                    )}
                    {v.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(v.id, 'REJECTED')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid #fecdd3',
                          background: '#fff1f2',
                          color: '#e11d48',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Reject ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMVerification;
