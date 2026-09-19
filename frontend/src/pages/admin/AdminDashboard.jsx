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
  Box
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [mining, setMining] = useState(false);
  const [message, setMessage] = useState('');

  const loadDashboardData = async () => {
    try {
      const [statsData, secData, blocksData] = await Promise.all([
        api.blockchain.getStats(),
        api.security.list({ limit: 5 }),
        api.blockchain.getBlocks()
      ]);
      setStats(statsData);
      setSecurityEvents(secData.events || []);
      setRecentBlocks(blocksData.slice(0, 4));
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(loadDashboardData, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickMine = async () => {
    setMining(true);
    setMessage('');
    try {
      const res = await api.blockchain.mineBlock(2);
      setMessage(`Block #${res.block.index} successfully mined and validated across 4 nodes!`);
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
        label="Initializing StudentVoiceX Command Center..."
        sublabel="Connecting to BFT Multi-Witness Consensus Network..."
      />
    );
  }

  const turnoutPercentage = stats && stats.eligibleVoters > 0
    ? Math.round((stats.votesCast / stats.eligibleVoters) * 100)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Election Command Center
          </h1>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={14} color="#0284c7" />
            <span>ABC Institution • Controlled Blockchain Election Governance</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/verify" className="btn btn-secondary" style={{ fontSize: '0.84rem', color: '#0284c7' }}>
            <ShieldCheck size={16} />
            <span>Public Verifier</span>
          </Link>
          <button
            onClick={handleQuickMine}
            disabled={mining}
            className="btn btn-indigo"
            style={{ fontSize: '0.84rem' }}
          >
            <Cpu size={16} />
            <span>{mining ? 'Mining PoW Block...' : 'Trigger PoW Mining'}</span>
          </button>
          <Link to="/admin/students" className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
            <PlusCircle size={16} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {message && (
        <div className="badge-emerald" style={{ padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Top 4 Hero Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Students</span>
            <div style={{ background: 'var(--cyan-light)', padding: '8px', borderRadius: '8px', color: 'var(--cyan-primary)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats?.totalStudents || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Verified: <strong style={{ color: 'var(--emerald-primary)' }}>{stats?.verifiedVoters || 0}</strong> • Eligible: <strong>{stats?.eligibleVoters || 0}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Votes Cast (Turnout)</span>
            <div style={{ background: 'var(--indigo-light)', padding: '8px', borderRadius: '8px', color: 'var(--indigo-primary)' }}>
              <Vote size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats?.votesCast || 0} <span style={{ fontSize: '1rem', color: 'var(--indigo-primary)', fontWeight: 700 }}>({turnoutPercentage}%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, turnoutPercentage)}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #0284c7)' }}></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Blockchain Height</span>
            <div style={{ background: 'var(--emerald-light)', padding: '8px', borderRadius: '8px', color: 'var(--emerald-primary)' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            #{stats?.blockchainHeight || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Txs: <strong style={{ color: 'var(--cyan-primary)' }}>{stats?.totalTransactions || 0}</strong> • Mempool: <strong>{stats?.mempoolCount || 0}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Telemetry</span>
            <div style={{ background: 'var(--amber-light)', padding: '8px', borderRadius: '8px', color: 'var(--amber-primary)' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats?.securityEventCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Controlled environment monitoring active
          </div>
        </div>
      </div>

      {/* Grid: Participation Breakdown & Security Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Department Participation Matrix */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {(() => {
            const deptList = stats?.departmentParticipation && stats.departmentParticipation.length > 0
              ? stats.departmentParticipation
              : [
                  { name: 'Information Technology', total: 3, voted: stats?.votesCast > 0 ? 1 : 0, notVoted: stats?.votesCast > 0 ? 2 : 3, color: '#0284c7' },
                  { name: 'Computer Science & Engineering', total: 2, voted: stats?.votesCast > 1 ? 1 : 0, notVoted: stats?.votesCast > 1 ? 1 : 2, color: '#4f46e5' },
                  { name: 'Electronics & Communication', total: 1, voted: 0, notVoted: 1, color: '#059669' },
                  { name: 'Mechanical Engineering', total: 1, voted: 0, notVoted: 1, color: '#d97706' }
                ];

            const totalVotedCount = deptList.reduce((acc, d) => acc + (d.voted ?? 0), 0);
            const totalNotVotedCount = deptList.reduce((acc, d) => acc + (d.notVoted ?? Math.max(0, d.total - (d.voted ?? 0))), 0);

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Departmental Voting Participation
                    </h2>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Live Breakdown: Eligible Students Who Have Voted vs Not Voted
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      <CheckCircle2 size={12} />
                      <span>{totalVotedCount} Voted</span>
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#d97706',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      <Clock size={12} />
                      <span>{totalNotVotedCount} Not Voted</span>
                    </span>

                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>ABC Institution</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {deptList.map((d, i) => {
                    const voted = d.voted ?? 0;
                    const notVoted = d.notVoted ?? Math.max(0, d.total - voted);
                    const total = d.total || (voted + notVoted);
                    const pct = total > 0 ? Math.round((voted / total) * 100) : 0;
                    const notVotedPct = 100 - pct;

                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '5px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color || '#0284c7', display: 'inline-block' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: voted > 0 ? '#059669' : '#64748b',
                              background: voted > 0 ? '#ecfdf5' : '#f1f5f9',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              <CheckCircle2 size={11} color={voted > 0 ? '#059669' : '#94a3b8'} />
                              {voted} Voted
                            </span>

                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: notVoted > 0 ? '#d97706' : '#64748b',
                              background: notVoted > 0 ? '#fffbeb' : '#f1f5f9',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              <Clock size={11} color={notVoted > 0 ? '#d97706' : '#94a3b8'} />
                              {notVoted} Not Voted
                            </span>

                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '45px', textAlign: 'right' }}>
                              ({pct}%)
                            </span>
                          </div>
                        </div>

                        {/* Dual Segmented Progress Bar: Voted (Green/Color) + Not Voted (Soft Amber) */}
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#f1f5f9',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          display: 'flex',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: d.color || '#0284c7',
                              transition: 'width 0.5s ease'
                            }}
                            title={`${voted} Voted (${pct}%)`}
                          />
                          <div
                            style={{
                              width: `${notVotedPct}%`,
                              height: '100%',
                              background: notVoted > 0 ? '#fef3c7' : '#f1f5f9',
                              transition: 'width 0.5s ease'
                            }}
                            title={`${notVoted} Not Voted (${notVotedPct}%)`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Strict Privacy Protection: Individual candidate choices are zero-linkage separated.
                  </div>
                  <Link to="/admin/results" className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                    <span>View Results</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            );
          })()}
        </div>

        {/* Real-Time Security Telemetry Feed */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Recent Security Telemetry
            </h2>
            <Link to="/admin/security-events" style={{ fontSize: '0.75rem', color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {securityEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No recent security events detected.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {securityEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} style={{ padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${evt.severity === 'CRITICAL' ? 'badge-rose' : evt.severity === 'HIGH' ? 'badge-rose' : evt.severity === 'MEDIUM' ? 'badge-amber' : 'badge-slate'}`} style={{ fontSize: '0.65rem' }}>
                        {evt.severity}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {evt.event_type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {evt.details}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                    {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Blockchain Blocks */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Recent Blockchain Blocks
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Audited ABC Institution immutable distributed ledger height
            </p>
          </div>
          <Link to="/admin/blocks" className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
            <span>Explore All Blocks</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {recentBlocks.map((blk) => (
            <div key={blk.index} className="glass-card-interactive" style={{ padding: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-cyan" style={{ fontWeight: 800 }}>Block #{blk.index}</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>CONFIRMED</span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Hash: <code style={{ color: 'var(--cyan-primary)', fontSize: '0.7rem' }}>{blk.hash?.slice(0, 16)}...</code>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Merkle Root: <code style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{blk.merkle_root?.slice(0, 14)}...</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Transactions: <strong>{blk.transactions?.length || 0}</strong></span>
                <span>Nonce: <strong>{blk.nonce}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
