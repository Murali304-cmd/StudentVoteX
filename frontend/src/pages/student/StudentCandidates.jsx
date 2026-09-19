import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Users, Star, ArrowLeft, Check, Sparkles, Scale, Info, X } from 'lucide-react';

export function StudentCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.elections.get(id || 1);
        setElection(res.data);
        setCandidates(res.data?.candidates || []);
      } catch (err) {
        console.error('Error fetching election candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleCompare = (cand) => {
    if (compareList.some((c) => c.id === cand.id)) {
      setCompareList(compareList.filter((c) => c.id !== cand.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], cand]);
      } else {
        setCompareList([...compareList, cand]);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/student/elections')}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontWeight: 700
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {election?.title || 'Election Candidates'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
              Official candidate profiles, election symbols, and policy manifestos.
            </p>
          </div>
        </div>

        {/* Compare Button */}
        {compareList.length === 2 && (
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Scale size={16} />
            <span>Compare 2 Candidates</span>
          </button>
        )}
      </div>

      {/* Candidates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {candidates.map((c) => {
          const isComparing = compareList.some((item) => item.id === c.id);
          return (
            <div
              key={c.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                {/* Candidate Photo & Official Symbol */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
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
                    APPROVED
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {c.name}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', marginBottom: '4px' }}>
                  {c.position || 'Candidate'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                  {c.department} • {c.year}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {c.biography || c.manifesto}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(c)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(c)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: isComparing ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    background: isComparing ? '#e0f2fe' : '#ffffff',
                    color: isComparing ? '#0284c7' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isComparing ? '✓ Comparing' : 'Compare'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Modal */}
      {selectedProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedProfile(null)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}
              >
                {selectedProfile.election_symbol || '★'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedProfile.name}
                </h2>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>
                  {selectedProfile.position} • {selectedProfile.department}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                About Candidate
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {selectedProfile.biography || selectedProfile.manifesto}
              </p>
            </div>

            <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Candidate Priorities
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                {selectedProfile.priorities || '• Student welfare\n• Academic representation\n• Innovation labs'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedProfile(null);
                navigate(`/student/voting/${election?.id || id}`);
              }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Select Candidate in Ballot →
            </button>
          </div>
        </div>
      )}

      {/* Candidate Comparison Modal */}
      {showCompareModal && compareList.length === 2 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setShowCompareModal(false)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Candidate Comparison
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {compareList.map((c) => (
                <div key={c.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{c.election_symbol}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{c.name}</h3>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0284c7', marginBottom: '12px' }}>{c.position}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>{c.department} • {c.year}</div>

                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                    <strong>Biography:</strong>
                    <p style={{ margin: '4px 0 0 0' }}>{c.biography || c.manifesto}</p>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                    <strong>Priorities:</strong>
                    <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>{c.priorities}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentCandidates;
