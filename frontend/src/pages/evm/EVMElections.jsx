import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Vote, Clock, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';

export function EVMElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElections() {
      try {
        const res = await api.elections.list();
        setElections(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchElections();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          EVM Election Terminal Operations
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Monitor live institutional elections, active polling windows, and voter eligibility quotas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {elections.map((elec) => (
          <div
            key={elec.id}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  {elec.status}
                </span>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                  Dept: {elec.department}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                {elec.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {elec.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '0.78rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>Candidates: <strong style={{ color: '#0284c7' }}>{elec.candidates?.length || 0}</strong></span>
              <span>Ends: <strong>{new Date(elec.end_date).toLocaleDateString()}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EVMElections;
