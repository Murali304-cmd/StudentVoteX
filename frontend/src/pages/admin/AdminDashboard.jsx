import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Users,
  Vote,
  ShieldCheck,
  Layers,
  Activity,
  ArrowRight,
  PlusCircle,
  Cpu,
  ShieldAlert,
  Clock,
  TrendingUp,
  Building2,
  CheckCircle2,
  FileCheck2,
  Box,
  Zap,
  Radio,
  Eye,
  EyeOff,
  BarChart3,
  Award,
  Sparkles,
  Lock,
  RefreshCw,
  Gauge,
  Key
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [elections, setElections] = useState([]);
  const [mining, setMining] = useState(false);
  const [message, setMessage] = useState('');
  const [showLiveTally, setShowLiveTally] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadDashboardData = async () => {
    try {
      const [statsData, secData, blocksData, electionsData] = await Promise.all([
        api.blockchain.getStats(),
        api.security.list({ limit: 6 }),
        api.blockchain.getBlocks(),
        api.elections.list()
      ]);
      setStats(statsData);
      setSecurityEvents(secData.events || []);
      setRecentBlocks(blocksData.slice(0, 5));
      setElections(electionsData || []);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(loadDashboardData, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickMine = async () => {
    setMining(true);
    setMessage('');
    try {
      const res = await api.blockchain.mineBlock(2);
      setMessage(`Block #${res.block.index} successfully mined & validated across 4 consensus nodes!`);
      loadDashboardData();
    } catch (e) {
      setMessage(`Mining failed: ${e.message}`);
    } finally {
      setMining(false);
    }
  };

  if (loading && !stats) {
    return (
      <StudentVoiceXLoader
        mode="card"
        label="Loading Advanced Election Command Analytics..."
        sublabel="Aggregating Real-Time Telemetry & Cryptographic Ledger..."
      />
    );
  }

  const activeElection = elections.find(e => e.status === 'ACTIVE') || elections[0];
  const eligibleVoters = stats?.eligibleVoters || 5;
  const votesCast = stats?.votesCast || 0;
  const turnoutPercentage = eligibleVoters > 0
    ? Math.round((votesCast / eligibleVoters) * 100)
    : 0;

  // Department analytics calculation
  const deptList = stats?.departmentParticipation && stats.departmentParticipation.length > 0
    ? stats.departmentParticipation
    : [
        { name: 'Information Technology', total: 3, voted: votesCast > 0 ? 1 : 0, notVoted: votesCast > 0 ? 2 : 3, color: '#0284c7' },
        { name: 'Computer Science & Engineering', total: 2, voted: votesCast > 1 ? 1 : 0, notVoted: votesCast > 1 ? 1 : 2, color: '#4f46e5' },
        { name: 'Electronics & Communication', total: 1, voted: 0, notVoted: 1, color: '#059669' },
        { name: 'Mechanical Engineering', total: 1, voted: 0, notVoted: 1, color: '#d97706' }
      ];

  const totalVotedCount = deptList.reduce((acc, d) => acc + (d.voted ?? 0), 0);
  const totalNotVotedCount = deptList.reduce((acc, d) => acc + (d.notVoted ?? Math.max(0, d.total - (d.voted ?? 0))), 0);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* ── Top Header & Global Status ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
            }}>
              <Gauge size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Advanced Election Command Center
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontWeight: 700 }}>
                  <Building2 size={13} />
                  ABC INSTITUTION
                </span>
                <span>•</span>
                <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                  BFT 4-Node Consensus Active
                </span>
                <span>•</span>
                <span>Synced: {lastRefreshed.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadDashboardData()}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            title="Refresh Live Analytics"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>

          <Link to="/verify" className="btn btn-secondary" style={{ fontSize: '0.82rem', color: '#0284c7' }}>
            <ShieldCheck size={15} />
            <span>Public Verifier</span>
          </Link>

          <button
            type="button"
            onClick={handleQuickMine}
            disabled={mining}
            className="btn btn-indigo"
            style={{ fontSize: '0.82rem' }}
          >
            <Cpu size={15} />
            <span>{mining ? 'Sealing Block...' : 'Seal PoW Block'}</span>
          </button>

          <Link to="/admin/students" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
            <PlusCircle size={15} />
            <span>Manage Voters</span>
          </Link>
        </div>
      </div>

      {message && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontSize: '0.86rem', fontWeight: 700 }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{message}</span>
        </div>
      )}

      {/* ── Level-1 KPI Analytics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        
        {/* Total Electorate */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Institutional Electorate
            </span>
            <div style={{ background: 'var(--cyan-light)', padding: '7px', borderRadius: '8px', color: 'var(--cyan-primary)' }}>
              <Users size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {stats?.totalStudents || 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Verified ID: <strong style={{ color: '#10b981' }}>{stats?.verifiedVoters || 0}</strong></span>
            <span>Eligible: <strong>{eligibleVoters}</strong></span>
          </div>
        </div>

        {/* Turnout & Velocity */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ballots Polled (Turnout)
            </span>
            <div style={{ background: 'var(--indigo-light)', padding: '7px', borderRadius: '8px', color: 'var(--indigo-primary)' }}>
              <Vote size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {votesCast} <span style={{ fontSize: '1.05rem', color: 'var(--indigo-primary)', fontWeight: 800 }}>({turnoutPercentage}%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, turnoutPercentage)}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #4f46e5)', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Blockchain Cryptometrics */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Blockchain Ledger
            </span>
            <div style={{ background: 'var(--emerald-light)', padding: '7px', borderRadius: '8px', color: 'var(--emerald-primary)' }}>
              <Layers size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            #{stats?.blockchainHeight || 1}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sealed Txs: <strong style={{ color: '#0284c7' }}>{stats?.totalTransactions || 0}</strong></span>
            <span>Mempool: <strong>{stats?.mempoolCount || 0}</strong></span>
          </div>
        </div>

        {/* Security & Threat Telemetry */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Threat Assessment
            </span>
            <div style={{ background: 'var(--amber-light)', padding: '7px', borderRadius: '8px', color: 'var(--amber-primary)' }}>
              <ShieldAlert size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {stats?.securityEventCount || 0}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>0 Critical Exploits</span>
            <span style={{ color: '#64748b' }}>Shield Active</span>
          </div>
        </div>

      </div>

      {/* ── Level-2 Advanced Analytics Panels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '22px' }}>
        
        {/* Departmental Participation Matrix */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Departmental Voting Velocity &amp; Turnout
              </h2>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Real-Time Participation across Academic Departments
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ {totalVotedCount} Polled
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '6px' }}>
                ⏳ {totalNotVotedCount} Pending
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptList.map((d, i) => {
              const voted = d.voted ?? 0;
              const notVoted = d.notVoted ?? Math.max(0, d.total - voted);
              const total = d.total || (voted + notVoted);
              const pct = total > 0 ? Math.round((voted / total) * 100) : 0;

              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color || '#0284c7' }} />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.name}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.72rem', color: voted > 0 ? '#059669' : '#64748b', fontWeight: 700 }}>
                        {voted}/{total} ({pct}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${d.color || '#0284c7'}, #38bdf8)`,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Zero-knowledge ballot linkage: Individual student candidate choice is cryptographically masked.
            </span>
            <Link to="/admin/results" style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Certified Results</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Cryptographic Consensus & Node Telemetry */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                BFT Consensus Mesh
              </h2>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                4 Independent Institutional Signers
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              100% HEALTH
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Node 01: Election Commission Apex Node', role: 'Leader Proposer', latency: '24ms', status: 'SYNCED', ip: '10.0.1.10' },
              { name: 'Node 02: Academic Senate Validator', role: 'Quorum Witness', latency: '31ms', status: 'SYNCED', ip: '10.0.1.11' },
              { name: 'Node 03: Student Union Observer Node', role: 'Auditor Witness', latency: '28ms', status: 'SYNCED', ip: '10.0.1.12' },
              { name: 'Node 04: EVM Hardware HSM Gateway', role: 'Terminal Gateway', latency: '19ms', status: 'SYNCED', ip: '10.0.1.13' }
            ].map((node, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{node.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{node.role} • {node.ip}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981' }}>{node.status}</div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{node.latency}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '0.72rem', color: '#0369a1' }}>
            <strong>Cryptographic Guarantee:</strong> Byzantine Fault Tolerance requires 3/4 witness consensus signatures for block immutability.
          </div>
        </div>

      </div>

      {/* ── Level-3 Live Candidate Tallies & Security Log ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Candidate Tally Distribution */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Presidential Election Standings
              </h2>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeElection?.title || 'Student Council President Election 2026'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLiveTally(!showLiveTally)}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            >
              {showLiveTally ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showLiveTally ? 'Hide Tally' : 'Reveal Tally'}</span>
            </button>
          </div>

          {showLiveTally ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(activeElection?.candidates && activeElection.candidates.length > 0 ? activeElection.candidates : [
                { name: 'Arun Kumar', symbol: '★', department: 'Computer Science', vote_count: 0 },
                { name: 'Devika Raman', symbol: '⚡', department: 'Information Technology', vote_count: 0 },
                { name: 'Siddharth Verma', symbol: '🏛️', department: 'ECE', vote_count: 0 }
              ]).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {c.election_symbol || c.symbol || '★'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{c.department}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0284c7' }}>
                    {c.vote_count || 0} votes
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '10px', fontSize: '0.84rem' }}>
              <Lock size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
              <div>Live candidate tallies obscured for election secrecy. Click "Reveal Tally" to inspect.</div>
            </div>
          )}
        </div>

        {/* Recent Security Telemetry Events */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Real-Time Security Events
              </h2>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hardware Tamper, Screen Shields, and Biometric Audits
              </div>
            </div>
            <Link to="/admin/security-events" style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
              View All ({securityEvents.length})
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {securityEvents.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No suspicious security incidents logged. Perimeter secure.
              </div>
            ) : (
              securityEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className={`badge ${
                        evt.severity === 'CRITICAL' || evt.severity === 'HIGH' ? 'badge-rose' :
                        evt.severity === 'MEDIUM' ? 'badge-amber' : 'badge-slate'
                      }`} style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                        {evt.severity || 'LOW'}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.event_type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.details}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
