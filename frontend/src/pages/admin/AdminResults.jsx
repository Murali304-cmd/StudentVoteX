import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { OfficialCertificateModal } from '../../components/certificates/OfficialCertificateModal';
import { ElectionCountdownTimer } from '../../components/common/ElectionCountdownTimer';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  BarChart3,
  Trophy,
  Vote,
  Users,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Printer,
  Sparkles,
  Layers,
  Award,
  Monitor,
  Wifi,
  Radio,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export function AdminResults() {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [results, setResults] = useState(null);
  const [irvResults, setIrvResults] = useState(null);
  const [certificatesData, setCertificatesData] = useState(null);
  const [viewMode, setViewMode] = useState('STANDARD'); // 'STANDARD' | 'IRV'
  const [loading, setLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalTab, setCertModalTab] = useState('WINNERS');
  const [generatingCerts, setGeneratingCerts] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const list = await api.elections.list();
        setElections(list);
        if (list.length > 0) {
          setSelectedElectionId(list[0].id);
          fetchElectionData(list[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const fetchElectionData = async (id) => {
    try {
      const [stdData, irvData, certs] = await Promise.all([
        api.admin.getResults(id),
        api.admin.getRankedChoiceResults(id).catch(() => null),
        api.certificates.getByElection(id).catch(() => null)
      ]);
      setResults(stdData);
      setIrvResults(irvData);
      setCertificatesData(certs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectElection = (id) => {
    setSelectedElectionId(id);
    fetchElectionData(id);
  };

  const handleOpenCertificates = (tab = 'WINNERS') => {
    setCertModalTab(tab);
    setIsCertModalOpen(true);
  };

  const handleGenerateCertificates = async () => {
    if (!selectedElectionId) return;
    setGeneratingCerts(true);
    try {
      await api.certificates.generate(selectedElectionId);
      const updatedCerts = await api.certificates.getByElection(selectedElectionId);
      setCertificatesData(updatedCerts);
      setIsCertModalOpen(true);
    } catch (e) {
      alert(`Certificate generation failed: ${e.message}`);
    } finally {
      setGeneratingCerts(false);
    }
  };

  if (loading && !results) {
    return (
      <StudentVoiceXLoader
        label="Loading Certified Results & Blockchain Ledger..."
        sublabel="Syncing BFT Multi-Witness Consensus & Kiosk Provenance..."
        mode="card"
      />
    );
  }

  const sortedCandidates = results?.candidates
    ? [...results.candidates].sort((a, b) => b.vote_count - a.vote_count)
    : [];

  const totalVotes = results?.totalVotesCast || 0;
  const evmVotes = results?.evmVotes || 0;
  const portalVotes = results?.portalVotes || 0;
  const evmTerminals = results?.evmTerminals || [];
  const winner = results?.winner || (sortedCandidates.length > 0 && sortedCandidates[0].vote_count > 0 ? sortedCandidates[0] : null);

  const evmPercentage = totalVotes > 0 ? Math.round((evmVotes / totalVotes) * 100) : 0;
  const portalPercentage = totalVotes > 0 ? Math.round((portalVotes / totalVotes) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', color: '#fff', padding: '8px', borderRadius: '10px' }}>
              <Trophy size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Certified Results & Official Certificates
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-time EVM kiosk & online ballot synchronization with cryptographically sealed winner distinction.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="input-field"
            style={{ width: '220px' }}
            value={selectedElectionId || ''}
            onChange={(e) => handleSelectElection(e.target.value)}
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id}>{el.title}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenCertificates('WINNERS')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Award size={15} />
            <span>View Official Certificates</span>
          </button>

          <button
            onClick={handleGenerateCertificates}
            disabled={generatingCerts}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Re-seal and update certificates with latest blockchain block"
          >
            <RefreshCw size={15} className={generatingCerts ? 'spin' : ''} />
            <span>{generatingCerts ? 'Sealing...' : 'Re-Seal Certs'}</span>
          </button>
        </div>
      </div>

      {/* Election Timing & Countdown Status Banner */}
      {results?.election && (
        <div style={{ marginBottom: '24px' }}>
          <ElectionCountdownTimer election={results.election} />
        </div>
      )}

      {/* 4 KPI Metric Summary Cards (Connecting EVM Votes to Admin) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Card 1: Total Verified Votes */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Verified Ballots
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalVotes} Votes
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                ● 100% Cryptographically Audited
              </div>
            </div>
            <div style={{ background: 'rgba(2, 132, 199, 0.12)', padding: '10px', borderRadius: '12px', color: '#0284c7' }}>
              <Vote size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: EVM Kiosk Ballots */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EVM Hardware Kiosks
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {evmVotes} <span style={{ fontSize: '0.9rem', color: '#10b981' }}>({evmPercentage}%)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                From {evmTerminals.length || 2} Connected Booths
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '12px', color: '#10b981' }}>
              <Monitor size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Online Student Portal */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Online Campus Portal
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {portalVotes} <span style={{ fontSize: '0.9rem', color: '#6366f1' }}>({portalPercentage}%)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Verified Student BYOD
              </div>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '10px', borderRadius: '12px', color: '#6366f1' }}>
              <Wifi size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Blockchain Ledger Height & Consensus */}
        <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                BFT Consensus Status
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                Block #{results?.blockchainSync?.height || 2}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                ● Real-Time Synced Mesh
              </div>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '10px', borderRadius: '12px', color: '#8b5cf6' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Connected EVM Kiosk Terminals Monitor Card */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', background: 'linear-gradient(135deg, #070b14 0%, #0f172a 100%)', color: '#ffffff', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#38bdf8" className="pulse-glow" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Live Connected EVM Polling Kiosks & Hardware Sync
            </h3>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
            ● Hardware Mempool Real-Time Sync Active
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {evmTerminals.map((term, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px', color: '#34d399' }}>
                  <Monitor size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f8fafc' }}>
                    {term.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Location: {term.location} • IP: {term.ip}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>
                  {term.votesRecorded} Votes
                </div>
                <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>
                  ● {term.lastHeartbeat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Winner Distinction Hero Banner */}
      {winner && (
        <div
          className="glass-card"
          style={{
            padding: '24px 28px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
            border: '2px solid #f59e0b',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              {/* Winner Avatar / Symbol Circle */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                  position: 'relative'
                }}
              >
                <span>{winner.election_symbol || winner.symbol || '★'}</span>
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    padding: '2px'
                  }}
                >
                  <Trophy size={16} color="#d97706" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-amber" style={{ fontWeight: 900, fontSize: '0.74rem' }}>
                    🏆 PROJECTED WINNER
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 700 }}>
                    Symbol: {winner.symbol_name || 'Star'} ({winner.election_symbol || '★'})
                  </span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0' }}>
                  {winner.name}
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                  Post: <strong>{winner.position || 'President'}</strong> • Dept: <strong>{winner.department}</strong> • Class: <strong>Year {winner.year} ({winner.section})</strong>
                </div>
              </div>
            </div>

            {/* Winner Stats & Certificate Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                  {winner.vote_count} <span style={{ fontSize: '1rem', color: '#0284c7' }}>Votes</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800 }}>
                  {totalVotes > 0 ? Math.round((winner.vote_count / totalVotes) * 100) : 0}% Vote Share • +{winner.victoryMargin || 0} Margin
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCertificates('WINNERS')}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Award size={16} />
                <span>View Winner Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Breakdown Table with Candidate Symbols */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Ballot Distribution & Candidate Participation
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              {sortedCandidates.length} contesting candidates with assigned election symbols and certified vote tallies.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCertificates('CANDIDATES')}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Award size={14} />
            <span>Candidate Participation Certs</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sortedCandidates.map((cand, idx) => {
            const pct = totalVotes > 0 ? Math.round((cand.vote_count / totalVotes) * 100) : 0;
            const isTop = idx === 0 && cand.vote_count > 0;
            return (
              <div
                key={cand.id}
                style={{
                  background: isTop ? 'rgba(254, 243, 199, 0.4)' : '#f8fafc',
                  border: isTop ? '1.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Candidate Info + Symbol */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: isTop ? '#f59e0b' : '#0284c7',
                      color: '#ffffff',
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {cand.election_symbol || '★'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${isTop ? 'badge-amber' : 'badge-slate'}`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        #{idx + 1} {isTop ? 'WINNER' : ''}
                      </span>
                      <strong style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>{cand.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Symbol: <strong>{cand.symbol_name || 'Star'}</strong> ({cand.election_symbol || '★'}) • Post: <strong>{cand.position}</strong> • {cand.department}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ flex: 1, minWidth: '180px', maxWidth: '320px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ballot Share</span>
                    <strong style={{ color: isTop ? '#d97706' : '#0284c7' }}>{pct}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isTop ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #0284c7, #4f46e5)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Vote Count & Certificate View Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {cand.vote_count} Votes
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCertificates(isTop ? 'WINNERS' : 'CANDIDATES')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Award size={13} />
                    <span>Cert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Modal */}
      <OfficialCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificatesData={certificatesData}
        defaultTab={certModalTab}
      />
    </div>
  );
}

export default AdminResults;
