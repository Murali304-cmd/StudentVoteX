import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Users,
  Star,
  ArrowLeft,
  Check,
  Sparkles,
  Scale,
  Info,
  X,
  Search,
  Filter,
  Bookmark,
  Award,
  Vote,
  ExternalLink,
  Building2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'MY_SECTION' | 'BOOKMARKED'
  const [search, setSearch] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studentvoicex_bookmarked_candidates') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (id) {
          const res = await api.elections.get(id);
          const electionData = res?.data || res;
          setElection(electionData);
          setCandidates(electionData?.candidates || []);
        } else {
          const candList = await api.candidates.list();
          setCandidates(Array.isArray(candList) ? candList : candList?.results || []);
          const elList = await api.elections.list();
          if (Array.isArray(elList) && elList.length > 0) {
            setElection(elList[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleBookmark = (candId) => {
    const next = bookmarkedIds.includes(candId)
      ? bookmarkedIds.filter(i => i !== candId)
      : [...bookmarkedIds, candId];
    setBookmarkedIds(next);
    localStorage.setItem('studentvoicex_bookmarked_candidates', JSON.stringify(next));
  };

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

  const filteredCandidates = candidates.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                        c.position?.toLowerCase().includes(search.toLowerCase()) ||
                        c.department?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (filterTab === 'MY_SECTION') {
      return c.section?.toLowerCase() === (user?.section || 'A').toLowerCase();
    }
    if (filterTab === 'BOOKMARKED') {
      return bookmarkedIds.includes(c.id);
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
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
            <span>Ballots</span>
          </button>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {election?.title || 'Official Election Candidates'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
              Review candidate policies, election symbols, and side-by-side comparison matrices.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/student/nomination"
            className="btn btn-secondary"
            style={{ padding: '9px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Award size={15} />
            <span>File Candidacy</span>
          </Link>

          {compareList.length === 2 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Scale size={16} />
              <span>Compare 2 Candidates ({compareList[0].name.split(' ')[0]} vs {compareList[1].name.split(' ')[0]})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {[
            { key: 'ALL', label: `All Candidates (${candidates.length})` },
            { key: 'MY_SECTION', label: `Section ${user?.section || 'A'} Nominees` },
            { key: 'BOOKMARKED', label: `Shortlisted (${bookmarkedIds.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: filterTab === tab.key ? '#ffffff' : 'transparent',
                color: filterTab === tab.key ? '#0284c7' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: filterTab === tab.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search candidates, symbols, or positions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Candidates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCandidates.map((c) => {
          const isComparing = compareList.some((item) => item.id === c.id);
          const isBookmarked = bookmarkedIds.includes(c.id);

          return (
            <div
              key={c.id}
              className="glass-card"
              style={{
                background: '#ffffff',
                border: isComparing ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '22px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Candidate Photo & Official Symbol */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.7rem',
                      fontWeight: 900,
                      boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    {c.symbol_image ? (
                      <img src={c.symbol_image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      c.election_symbol || '★'
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(c.id)}
                      title={isBookmarked ? 'Remove shortlist' : 'Shortlist candidate'}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: isBookmarked ? '#fef3c7' : '#f8fafc',
                        color: isBookmarked ? '#b45309' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      <Bookmark size={14} fill={isBookmarked ? '#b45309' : 'none'} />
                    </button>

                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: '#e0f2fe',
                      color: '#0369a1'
                    }}>
                      Sec {c.section || user?.section || 'A'}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {c.name}
                </h3>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0284c7', marginBottom: '4px' }}>
                  {c.position || 'Class Representative'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '12px' }}>
                  {c.department} &middot; Year {c.year}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.manifesto || c.biography || 'Dedicated to representing student interests and ensuring open communication with collegiate governance.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(c)}
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '9px', justifyContent: 'center' }}
                >
                  Manifesto
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(c)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: isComparing ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: isComparing ? '#e0f2fe' : '#ffffff',
                    color: isComparing ? '#0284c7' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isComparing ? '✓ Comparing' : 'Compare'}
                </button>

                <Link
                  to="/student/voting-session"
                  className="btn btn-primary"
                  style={{ padding: '9px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Vote size={14} />
                  <span>Vote</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Modal */}
      {selectedProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900
                }}>
                  {selectedProfile.election_symbol || '★'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedProfile.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 800 }}>
                    {selectedProfile.position} &middot; Section {selectedProfile.section || user?.section || 'A'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Official Policy Manifesto
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                {selectedProfile.manifesto || selectedProfile.biography || 'Pledging dedicated class leadership.'}
              </div>
            </div>

            {selectedProfile.priorities && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Key Priorities
                </div>
                <pre style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#475569', fontFamily: 'inherit', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {selectedProfile.priorities}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
              >
                Close
              </button>
              <Link
                to="/student/voting-session"
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem', justifyContent: 'center' }}
              >
                Proceed to Vote
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side 2-Candidate Comparison Modal */}
      {showCompareModal && compareList.length === 2 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '820px', padding: '28px', background: '#ffffff', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Side-by-Side Candidate Comparison Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {compareList.map((cand) => (
                <div key={cand.id} style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {cand.election_symbol || '★'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        {cand.name}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700 }}>
                        {cand.position} &middot; Section {cand.section || user?.section || 'A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong>Manifesto:</strong> {cand.manifesto || cand.biography || 'Committed to representing students.'}
                  </div>

                  {cand.priorities && (
                    <div style={{ fontSize: '0.76rem', color: '#334155', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong>Priorities:</strong>
                      <pre style={{ margin: '4px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                        {cand.priorities}
                      </pre>
                    </div>
                  )}

                  <Link
                    to="/student/voting-session"
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '9px', justifyContent: 'center' }}
                  >
                    Vote for {cand.name.split(' ')[0]}
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 20px' }}
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentCandidates;
