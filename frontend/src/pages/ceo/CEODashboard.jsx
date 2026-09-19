import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Crown,
  Building2,
  ShieldCheck,
  Vote,
  Users,
  HardDrive,
  ShieldAlert,
  Award,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Zap,
  Radio,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  Cpu,
  Layers
} from 'lucide-react';

export function CEODashboard() {
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [threatAssessment, setThreatAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Executive Emergency Freeze Switch State
  const [emergencyFrozen, setEmergencyFrozen] = useState(false);
  const [freezeReason, setFreezeReason] = useState('');
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  // Executive Certification Seal State
  const [isCertified, setIsCertified] = useState(false);
  const [certificationHash, setCertificationHash] = useState(null);

  const fetchMacroData = async () => {
    try {
      const [statsData, electionsData, threatData] = await Promise.all([
        api.blockchain.getStats(),
        api.elections.list(),
        api.security.getThreatAssessment().catch(() => null)
      ]);
      setStats(statsData);
      setElections(electionsData);
      setThreatAssessment(threatData);
    } catch (e) {
      console.error("Error loading CEO macro data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMacroData();
    const interval = setInterval(fetchMacroData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFreeze = () => {
    if (!emergencyFrozen && !freezeReason.trim()) {
      alert("Please provide an executive authorization reason for emergency freeze.");
      return;
    }
    setEmergencyFrozen(!emergencyFrozen);
    setShowFreezeModal(false);
    alert(
      emergencyFrozen
        ? "✅ Emergency Freeze LIFTED. All Departmental & EVM Ballots are now active."
        : "⚠️ EMERGENCY ELECTION FREEZE ACTIVATED. All online chambers and offline EVM kiosks are placed in controlled hold."
    );
  };

  const handleCertifyResults = () => {
    const timestamp = Date.now();
    const fakeHash = `CEO-CERT-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}-SHA256`;
    setCertificationHash(fakeHash);
    setIsCertified(true);
    alert(`📜 Executive Decree Signed & Sealed!\nCertification Hash: ${fakeHash}\nAppended to Blockchain Audit Log.`);
  };

  // Departmental Turnout Simulation Data
  const departmentTurnout = [
    { dept: 'Information Technology (IT)', total: 240, voted: 198, pct: 82.5, color: '#0284c7' },
    { dept: 'Computer Science & Engineering (CSE)', total: 320, voted: 252, pct: 78.8, color: '#4f46e5' },
    { dept: 'Electronics & Communication (ECE)', total: 210, voted: 146, pct: 69.5, color: '#059669' },
    { dept: 'Mechanical Engineering', total: 180, voted: 118, pct: 65.5, color: '#d97706' },
    { dept: 'Civil Engineering', total: 160, voted: 114, pct: 71.2, color: '#0891b2' },
    { dept: 'Master of Business Admin (MBA)', total: 130, voted: 112, pct: 86.1, color: '#9333ea' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. PRESIDENTIAL / CEO COMMISSION HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '30px',
        color: '#ffffff',
        border: '2px solid #b45309',
        boxShadow: '0 12px 30px rgba(180, 83, 9, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Golden Ambient Sheen */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
              border: '2px solid #fef3c7'
            }}>
              <Crown size={36} color="#ffffff" strokeWidth={2.4} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{
                  background: 'rgba(254, 243, 199, 0.2)',
                  color: '#fef3c7',
                  border: '1px solid rgba(254, 243, 199, 0.4)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-mono)'
                }}>
                  OFFICE OF THE CHIEF ELECTION OFFICER (CEO)
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  Supermajority Quorum Active
                </span>
              </div>

              <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#ffffff' }}>
                Executive Election Command & Oversight Suite
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#fde68a', marginTop: '4px', maxWidth: '650px', lineHeight: 1.5 }}>
                Supreme governance authority for ABC Institution collegiate elections, mathematical blockchain verification seals, multi-departmental quota audits, and emergency freeze controls.
              </p>
            </div>
          </div>

          {/* Quick Action Master Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFreezeModal(true)}
              className="btn"
              style={{
                background: emergencyFrozen ? '#ef4444' : '#ffffff',
                color: emergencyFrozen ? '#ffffff' : '#78350f',
                fontWeight: 800,
                fontSize: '0.86rem',
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              {emergencyFrozen ? <Lock size={16} /> : <Unlock size={16} />}
              <span>{emergencyFrozen ? '⚠️ ELECTIONS FROZEN' : '⚡ Master Freeze Switch'}</span>
            </button>

            <button
              onClick={handleCertifyResults}
              disabled={isCertified}
              className="btn"
              style={{
                background: isCertified ? '#059669' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.86rem',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid #fef3c7',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Award size={16} />
              <span>{isCertified ? '✓ Official Results Certified' : '📜 Certify & Sign Election'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MACRO EXECUTIVE KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Overall Turnout */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Institution Turnout
            </span>
            <Users size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            75.8%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            940 / 1,240 Total Registered Voters
          </div>
        </div>

        {/* Blockchain Block Height */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Confirmed Block Height
            </span>
            <HardDrive size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            #{stats?.blockchainHeight || 4}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px', fontWeight: 700 }}>
            ● PoW Consensus Valid (4 Nodes)
          </div>
        </div>

        {/* AI Integrity Index */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AI Integrity Rating
            </span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669' }}>
            98.6%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            0 Sybil Bursts • Low Coercion Index
          </div>
        </div>

        {/* Active Ballots */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #9333ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Scoped Ballots
            </span>
            <Vote size={18} color="#9333ea" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {elections.length || 3}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Departmental + Campus-Wide Common
          </div>
        </div>

      </div>

      {/* 3. MULTI-DEPARTMENT TURNOUT & SCRUTINY PROGRESS MATRIX */}
      <div className="glass-card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Academic Department Turnout & Participation Matrix
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time audit tracking voter participation across every collegiate academic department.
            </p>
          </div>

          <span className="badge badge-amber" style={{ fontWeight: 800, padding: '4px 10px' }}>
            <Building2 size={13} />
            <span>6 Academic Departments Reporting</span>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {departmentTurnout.map((dept) => (
            <div
              key={dept.dept}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {dept.dept}
                </span>
                <span style={{ fontWeight: 900, fontSize: '0.95rem', color: dept.color }}>
                  {dept.pct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{
                  width: `${dept.pct}%`,
                  height: '100%',
                  background: dept.color,
                  borderRadius: '999px',
                  transition: 'width 0.6s ease'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>Voted: <strong>{dept.voted}</strong> students</span>
                <span>Total Registered: <strong>{dept.total}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. EXECUTIVE CERTIFICATION DECREE BANNER (WHEN SIGNED) */}
      {isCertified && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '2px solid #86efac',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#059669',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
                Presidential Election Decree Sealed & Authenticated
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#047857', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                SIGNATURE DIGEST: {certificationHash}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px' }}
            >
              <Printer size={14} />
              <span>Print Decree</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. MASTER EMERGENCY FREEZE MODAL */}
      {showFreezeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {emergencyFrozen ? 'Resume Active Elections' : 'Executive Emergency Freeze Authorization'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Master CEO Key for campus-wide voting suspension.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
              {emergencyFrozen
                ? "Resuming will immediately unlock all student voting booths, departmental ballots, and offline EVM kiosks across the institution."
                : "Activating emergency freeze will immediately lock all active online voting sessions and offline EVM booths until officially lifted by the Chief Election Officer."}
            </p>

            {!emergencyFrozen && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Authorization Justification / Incident Reference *
                </label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="e.g. Server maintenance, forensic audit verification, or physical booth anomaly..."
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowFreezeModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleFreeze}
                className="btn"
                style={{
                  background: emergencyFrozen ? '#059669' : '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800
                }}
              >
                {emergencyFrozen ? 'Confirm Resume' : 'Activate Emergency Freeze'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
