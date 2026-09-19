import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Star, CheckCircle, Shield } from 'lucide-react';

export function EVMCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const res = await api.candidates.list();
        setCandidates(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Approved Candidate Verification & Manifestos
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Official candidate rosters, approved symbols, and priority declarations for ABC Institution elections.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {candidates.map((c) => (
          <div
            key={c.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Header with symbol and position */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    border: '1.5px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}
                >
                  {c.election_symbol || '★'}
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0'
                  }}
                >
                  {c.status || 'APPROVED'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                {c.name}
              </h3>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7', marginBottom: '8px' }}>
                {c.position || 'President Candidate'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                {c.department} • {c.year}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <strong>Priorities:</strong>
                <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>{c.priorities || c.manifesto}</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.74rem', color: '#94a3b8' }}>
              Election: {c.election_title || 'Student Council 2026'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EVMCandidates;
