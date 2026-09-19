import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart3, PieChart, CheckCircle2, Trophy, Users } from 'lucide-react';

export function EVMResults() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await api.elections.list();
        setElections(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Election Tally & Audit Results
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Aggregated vote totals verified against the immutable blockchain ledger.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {elections.map((elec) => {
          const totalVotes = elec.candidates?.reduce((acc, c) => acc + (c.vote_count || 0), 0) || 0;
          return (
            <div
              key={elec.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {elec.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Status: <strong style={{ color: '#0284c7' }}>{elec.status}</strong> • Total Verified Ballots: <strong>{totalVotes}</strong>
                  </div>
                </div>
              </div>

              {/* Candidate Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {elec.candidates?.map((c) => {
                  const pct = totalVotes > 0 ? Math.round(((c.vote_count || 0) / totalVotes) * 100) : 0;
                  return (
                    <div key={c.id} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{c.election_symbol || '★'}</span>
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{c.name}</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({c.position || 'Candidate'})</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7' }}>
                          {c.vote_count || 0} votes ({pct}%)
                        </div>
                      </div>

                      {/* Bar */}
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #0284c7 0%, #4f46e5 100%)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EVMResults;
