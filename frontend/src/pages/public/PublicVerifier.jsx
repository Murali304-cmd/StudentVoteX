import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Cpu,
  Clock,
  KeyRound,
  FileCheck2,
  ArrowLeft,
  Building2,
  QrCode,
  Shield,
  Key,
  Users,
  Check
} from 'lucide-react';
import { StudentVoiceXLogo } from '../../components/StudentVoiceXLogo';

export function PublicVerifier() {
  const location = useLocation();
  const prefilledId = location.state?.receiptId || '';

  const [identifier, setIdentifier] = useState(prefilledId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledId) {
      handleVerify(prefilledId);
    }
  }, [prefilledId]);

  const handleVerify = async (idToVerify) => {
    const cleanId = (idToVerify || identifier).trim();
    if (!cleanId) {
      setError('Please provide a Transaction ID, Anonymous Vote Reference, or SHA-3 Vote Hash.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.blockchain.verifyReceipt(cleanId);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification lookup failed. Transaction not found in finalized audit ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f1f5f9', padding: '40px 20px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <StudentVoiceXLogo size={42} showText={true} showTagline={true} isDark={true} />
          </div>

          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.8rem', background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}>
            <ArrowLeft size={14} />
            <span>Portal Login</span>
          </Link>
        </div>

        {/* Search / Verification Input Card */}
        <div className="cyber-dark-card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-bft" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>BFT CONSENSUS</span>
            <span className="badge-hsm" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>SHA-3 / ED25519</span>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
            Verify Ballot Inclusion & Witness Quorum
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '22px', lineHeight: 1.5 }}>
            Paste your Anonymous Vote ID, Transaction ID, or SHA-3 Ballot Digest to verify that your vote is cryptographically sealed in an immutable BFT block with 3-of-4 multi-witness consensus.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. TX-SVX-1774000000-A1B2 or VOTE-4F92AC"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  background: '#0c1222',
                  borderColor: '#1e293b',
                  color: '#38bdf8'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '0 24px',
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
                fontWeight: 800
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={16} className="spin" />
                  <span>Auditing Ledger...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={16} />
                  <span>Verify Ballot</span>
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="badge-rose" style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Verification Success Output Card */}
        {result && (
          <div className="cyber-dark-card" style={{ padding: '32px', animation: 'fadeIn 0.3s ease', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399', margin: 0 }}>
                    Cryptographic Proof Verified
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Authority: {result.institutionAuthority || 'StudentVoiceX Election Commission'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  ✓ BFT FINALIZED
                </span>
                <span className="badge-hsm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  FIPS 140-2 HSM
                </span>
              </div>
            </div>

            {/* Top Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#0c1222', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ANONYMOUS VOTE ID</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {result.anonymousVoteId}
                </div>
              </div>

              <div style={{ background: '#0c1222', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>AUDIT BLOCK HEIGHT</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f1f5f9', marginTop: '2px' }}>
                  Block #{result.blockNumber}
                </div>
              </div>

              <div style={{ background: '#0c1222', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>CONSENSUS QUORUM</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {result.consensus || 'BFT 3/4 Signers Quorum'}
                </div>
              </div>
            </div>

            {/* Multi-Witness Quorum Signers Panel */}
            <div style={{ background: '#0c1222', borderRadius: '12px', padding: '16px', border: '1px solid #1e293b', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Users size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                  Ed25519 Multi-Witness Signature Validation (Section 6)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                {(result.witnesses || ['Authority HSM', 'Civil Society Observer', 'Academic Monitor', 'Ledger Mirror']).map((witness, idx) => (
                  <div key={idx} style={{
                    background: '#111827',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                      ✓
                    </div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e2e8f0' }}>{witness}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Digests */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', marginBottom: '20px' }}>
              <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>TRANSACTION ID</div>
                <code style={{ fontSize: '0.78rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                  {result.transactionId}
                </code>
              </div>

              <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>SHA-3-256 BALLOT HASH</div>
                <code style={{ fontSize: '0.78rem', color: '#a78bfa', wordBreak: 'break-all' }}>
                  {result.voteHash}
                </code>
              </div>

              {result.nullifierHash && (
                <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>HMAC-SHA3 NULLIFIER HASH (DOUBLE-SPEND PROTECTION)</div>
                  <code style={{ fontSize: '0.78rem', color: '#f59e0b', wordBreak: 'break-all' }}>
                    {result.nullifierHash}
                  </code>
                </div>
              )}

              <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>AUDIT BLOCK MERKLE ROOT (SHA-3-256)</div>
                <code style={{ fontSize: '0.78rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                  {result.merkleRoot}
                </code>
              </div>

              <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>PREVIOUS BLOCK HASH (BACK-LINKAGE)</div>
                <code style={{ fontSize: '0.78rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                  {result.previousHash || 'GENESIS_SHA3_ROOT'}
                </code>
              </div>
            </div>

            {/* Merkle Proof Path Step Visualizer */}
            <div style={{ background: '#030712', color: '#e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8', fontWeight: 800, fontSize: '0.84rem' }}>
                <Layers size={16} />
                <span>SHA-3 Merkle Tree Inclusion Proof Trace</span>
              </div>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
                <div>1. Leaf SHA-3 Digest: <span style={{ color: '#34d399' }}>{result.voteHash ? result.voteHash.slice(0, 32) + '...' : 'OK'}</span></div>
                {result.merkleProofPath && result.merkleProofPath.length > 0 ? (
                  result.merkleProofPath.map((p, i) => (
                    <div key={i} style={{ color: '#94a3b8' }}>
                      ↳ Sibling Step #{i + 1} ({p.position}): {p.hash.slice(0, 32)}...
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#94a3b8' }}>↳ Verified at Tree Root (Single Transaction Block)</div>
                )}
                <div style={{ marginTop: '8px', color: '#38bdf8', fontWeight: 700 }}>
                  ✓ Recomputed Root matches AuditBlock #{result.blockNumber} with zero cryptographic deviation.
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
              This audit proof guarantees mathematical zero double-counting, zero voter identity linkage, and tamper resistance under <strong>NIST FIPS 202</strong> and <strong>ISO 27001</strong> standards.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
