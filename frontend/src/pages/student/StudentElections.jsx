import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Vote,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  Camera,
  Layers,
  Sparkles,
  Globe
} from 'lucide-react';

export function StudentElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'MY_DEPT', 'CAMPUS'
  const { user } = useAuth();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const list = await api.elections.list();
        setElections(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const isVerified = user?.verification_status === 'VERIFIED';
  const studentDept = user?.department || 'Information Technology';

  const filteredElections = elections.filter((el) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'MY_DEPT') return el.department?.toLowerCase() === studentDept.toLowerCase() || (el.department === 'ALL' && false);
    if (filterTab === 'CAMPUS') return el.department === 'ALL';
    return true;
  });

  return (
    <div>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-indigo">
              <Building2 size={12} />
              <span>{studentDept}</span>
            </span>
            <span className="badge badge-emerald">
              <ShieldCheck size={12} />
              <span>Verified Voter</span>
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Digital Elections Portal
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Review official ballot candidates for your academic department and campus-wide bodies.
          </p>
        </div>

        {/* Filter Segment Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '0.78rem',
          fontWeight: 700
        }}>
          <button
            type="button"
            onClick={() => setFilterTab('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filterTab === 'ALL' ? '#ffffff' : 'transparent',
              color: filterTab === 'ALL' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              boxShadow: filterTab === 'ALL' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            All Ballots ({elections.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('MY_DEPT')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filterTab === 'MY_DEPT' ? '#ffffff' : 'transparent',
              color: filterTab === 'MY_DEPT' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              boxShadow: filterTab === 'MY_DEPT' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏢 {studentDept}
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('CAMPUS')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filterTab === 'CAMPUS' ? '#ffffff' : 'transparent',
              color: filterTab === 'CAMPUS' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              boxShadow: filterTab === 'CAMPUS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🌐 Campus-Wide
          </button>
        </div>
      </div>

      {/* Elections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
          <StudentVoiceXLoader
            mode="card"
            label="Loading Available Campus Elections..."
            sublabel="Checking Voter Eligibility Matrix & Ballot Signatures..."
          />
        ) : filteredElections.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <Layers size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              No Elections Under This Category
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Switch filter tabs above to view all campus or departmental elections.
            </p>
          </div>
        ) : filteredElections.map((el) => {
          const isCommon = el.department === 'ALL';
          return (
            <div key={el.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-emerald">ACTIVE BALLOT</span>
                    <span className={`badge ${isCommon ? 'badge-purple' : 'badge-cyan'}`} style={{ fontWeight: 800 }}>
                      {isCommon ? '🌐 Campus-Wide Common' : `🏢 Dept: ${el.department}`}
                    </span>
                    <span className="badge badge-indigo">ABC Institution</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {el.title}
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {el.description}
                  </p>
                </div>

                <Link
                  to="/student/voting-session"
                  className="btn btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                >
                  <Vote size={18} />
                  <span>Launch Voting Chamber</span>
                </Link>
              </div>

              {/* Candidate Preview Cards */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Nominated Candidates ({el.candidates?.length || 0})
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {el.candidates?.map((c) => (
                    <div key={c.id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                          {c.name}
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>{c.symbol || '🗳️'}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.department} • Year {c.year} ({c.section})
                      </div>
                      {c.manifesto && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.3 }}>
                          "{c.manifesto.slice(0, 80)}..."
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
