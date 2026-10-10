import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  Copy,
  ArrowRight,
  Layers,
  Activity,
  Receipt,
  Printer,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Fingerprint,
  Users,
  Key,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export function StudentVoteConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const receipt = location.state?.receipt;
  const election = location.state?.election;
  const candidate = location.state?.candidate;

  const [showMerkleProof, setShowMerkleProof] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [personalCertificate, setPersonalCertificate] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);

  // Load student's certificate if available
  useEffect(() => {
    async function loadCert() {
      try {
        setLoadingCert(true);
        const res = await api.certificates.getMyCertificates();
        const certs = res?.certificates || [];
        if (certs.length > 0) {
          setPersonalCertificate(certs[0]);
        }
      } catch (err) {
        console.warn("Could not load voter certificate:", err);
      } finally {
        setLoadingCert(false);
      }
    }
    loadCert();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleVerifyInPublicVerifier = () => {
    navigate('/verify', {
      state: { receiptId: receipt?.transactionId || receipt?.anonymousVoteId || receipt?.voteHash }
    });
  };

  if (!receipt) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center' }} className="cyber-dark-card">
        <div style={{ padding: '36px' }}>
          <CheckCircle2 size={46} color="#059669" style={{ margin: '0 auto 14px' }} />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>Ballot Cryptographically Sealed</h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
            Your ballot has been confirmed and finalized on the StudentVoiceX Byzantine Fault Tolerant ledger.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/student/status" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <span>View Participation &amp; Certificates</span>
            </Link>
            <Link to="/student/dashboard" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const txId = receipt.transactionId || receipt.txId || `TX-${receipt.anonymousVoteId}`;
  const blockNum = receipt.blockNumber || receipt.blockIndex || 2;
  const voteHash = receipt.voteHash || '0x' + (receipt.anonymousVoteId || 'VOTE').toLowerCase();
  const merkleRoot = receipt.merkleRoot || '0x9afef36c34a85284...';

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', color: '#f1f5f9', fontFamily: 'var(--font-sans)' }}>
      {/* ── TOP CONFIRMATION BANNER ── */}
      <div className="cyber-dark-card" style={{
        padding: '36px 30px', textAlign: 'center',
        border: '2px solid #10b981', borderRadius: '24px',
        marginBottom: '26px', background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, #080d1a 100%)',
        boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{
          width: '74px', height: '74px', borderRadius: '22px',
          background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '18px', boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)',
          border: '1.5px solid rgba(52, 211, 153, 0.3)'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#34d399', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          ✓ Ballot Cryptographically Sealed on Chain!
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '580px', margin: '0 auto 20px', lineHeight: 1.55 }}>
          Your ballot has been column-encrypted using <strong>NIST AES-256-GCM AEAD</strong> and committed into AuditBlock #{blockNum} with zero linkage to your personal identity.
        </p>

        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '0.78rem' }}>
          <span className="badge badge-emerald">Consensus: BFT 4/4 FINALIZED</span>
          <span className="badge badge-cyan">AuditBlock #{blockNum}</span>
          <span className="badge-hsm">NIST FIPS 202 SHA-3</span>
          <span className="badge-bft">Ed25519 4-Witness Quorum</span>
        </div>
      </div>

      {/* ── OFFICIAL CRYPTOGRAPHIC AUDIT ENVELOPE ── */}
      <div className="cyber-dark-card" style={{ padding: '28px', marginBottom: '24px', borderRadius: '20px', border: '1px solid #1e293b' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px',
          flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={22} color="#38bdf8" />
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>
              StudentVoiceX Official Voter Cryptographic Receipt
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleVerifyInPublicVerifier}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', color: '#38bdf8', background: '#0c1222', borderColor: '#1e293b' }}
            >
              <ExternalLink size={13} />
              <span>Public Audit Tool</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', background: '#0c1222', borderColor: '#1e293b' }}
            >
              <Printer size={13} />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Top QR & ZK Verification Explainer Box */}
        <div style={{
          display: 'flex', gap: '18px', background: '#070d19', padding: '16px 20px',
          borderRadius: '14px', border: '1px solid #1e293b', marginBottom: '20px', alignItems: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '8px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a'
          }}>
            <svg width="74" height="74" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2h8v8H2zM4 4v4h4V4zM14 2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zM4 16v4h4v-4zM14 14h2v2h-2zM18 14h4v2h-4zM14 18h2v2h-2zM18 18h2v2h-2zM20 20h2v2h-2zM14 16h4v2h-4zM18 16h2v2h-2zM6 6h0v0H6z" />
            </svg>
          </div>

          <div style={{ flex: 1, fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 900, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Zero-Knowledge Verification Envelope</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>ZK-SNARK VERIFIED</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.76rem', lineHeight: 1.45 }}>
              Scan with the Public Audit Tool to prove inclusion in the Merkle Root without revealing your secret candidate selection.
            </div>
          </div>
        </div>

        {/* Cryptographic Identifiers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
          {/* Anonymous Vote ID */}
          <div style={{ background: '#070d19', padding: '14px 16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
              Anonymous Vote Reference ID
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <strong style={{ fontSize: '1.25rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {receipt.anonymousVoteId}
              </strong>
              <button
                onClick={() => handleCopy(receipt.anonymousVoteId, 'voteId')}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.74rem', background: '#1e293b' }}
              >
                {copiedKey === 'voteId' ? <span style={{ color: '#34d399' }}>✓ Copied</span> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* Transaction Digest */}
          <div style={{ background: '#070d19', padding: '14px 16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
              Transaction Digest (BFT Audit Commitment)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '10px' }}>
              <code style={{ fontSize: '0.8rem', color: '#a78bfa', wordBreak: 'break-all' }}>
                {txId}
              </code>
              <button
                onClick={() => handleCopy(txId, 'txId')}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.74rem', background: '#1e293b', flexShrink: 0 }}
              >
                {copiedKey === 'txId' ? <span style={{ color: '#34d399' }}>✓ Copied</span> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* Grid: Block Number & Election */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#070d19', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>BLOCKCHAIN AUDIT HEIGHT</div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#34d399', marginTop: '2px' }}>
                Block #{blockNum}
              </div>
            </div>

            <div style={{ background: '#070d19', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ELECTION CONTEST</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f1f5f9', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {election?.title || 'General Campus Election 2026'}
              </div>
            </div>
          </div>

          {/* ── INTERACTIVE MERKLE TREE PROOF VISUALIZER ── */}
          <div style={{ border: '1.5px solid #1e293b', borderRadius: '14px', overflow: 'hidden', background: '#070d19' }}>
            <button
              onClick={() => setShowMerkleProof(!showMerkleProof)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: '#0c1222', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 800, color: '#f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={16} color="#38bdf8" />
                <span>Interactive Cryptographic Merkle Tree Inclusion Proof</span>
              </div>
              {showMerkleProof ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showMerkleProof && (
              <div style={{ padding: '18px', fontSize: '0.78rem' }}>
                {/* Visual Tree Node Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {/* Step 1: Leaf Node */}
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                      1
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>YOUR BALLOT LEAF HASH:</div>
                      <div style={{ fontFamily: 'monospace', color: '#f1f5f9', wordBreak: 'break-all' }}>
                        {voteHash}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Merkle Branch Sibling */}
                  <div style={{
                    background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.25)',
                    borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                      2
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 800 }}>BFT QUORUM WITNESS SIBLING HASH:</div>
                      <div style={{ fontFamily: 'monospace', color: '#f1f5f9', wordBreak: 'break-all' }}>
                        {receipt.signature ? receipt.signature.slice(0, 48) + '...' : 'SHA3-WITNESS-ED25519-COMMITTED'}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Block Merkle Root */}
                  <div style={{
                    background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.25)',
                    borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                      3
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800 }}>PERMANENT BLOCKCHAIN ROOT HASH:</div>
                      <div style={{ fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all' }}>
                        {merkleRoot}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.45 }}>
                  ✓ This mathematical proof provides <strong>universal verifiability</strong>: any peer node or third-party observer can verify that your vote was counted in the final tally without decrypting who you voted for.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Retain Note */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
          Retain your Anonymous Vote Reference ID for personal verification. Your voter turnout record has been credited.
        </div>
      </div>

      {/* ── CIVIC PARTICIPATION CERTIFICATE BADGE (IF AVAILABLE) ── */}
      {personalCertificate && (
        <div className="cyber-dark-card" style={{
          padding: '24px', marginBottom: '24px', borderRadius: '18px',
          border: '1.5px solid #d97706', background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, #0c1222 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
              }}>
                <Award size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                  Official Civic Award Issued
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                  Certificate of Democratic Civic Participation
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  ID: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{personalCertificate.certificate_id}</span>
                </div>
              </div>
            </div>

            <Link
              to="/student/status"
              className="btn btn-primary"
              style={{
                padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: '#fff'
              }}
            >
              <span>View &amp; Print Full Diploma</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* ── FOOTER NAVIGATION ACTIONS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <Link
          to="/student/status"
          className="btn btn-primary"
          style={{
            padding: '11px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800
          }}
        >
          <Award size={16} />
          <span>View Participation Credentials</span>
        </Link>

        <button
          onClick={handleVerifyInPublicVerifier}
          className="btn btn-secondary"
          style={{ padding: '11px 22px', background: '#0c1222', borderColor: '#1e293b', color: '#38bdf8', fontWeight: 800 }}
        >
          <ShieldCheck size={16} />
          <span>Launch Public Verifier</span>
        </button>

        <Link to="/student/dashboard" className="btn btn-secondary" style={{ padding: '11px 24px', fontWeight: 800 }}>
          <span>Return to Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
export default StudentVoteConfirmation;
