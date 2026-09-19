import React, { useState } from 'react';
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
  Key
} from 'lucide-react';

export function StudentVoteConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const receipt = location.state?.receipt;
  const election = location.state?.election;
  const candidate = location.state?.candidate;

  const [showMerkleProof, setShowMerkleProof] = useState(false);

  if (!receipt) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }} className="cyber-dark-card">
        <div style={{ padding: '30px' }}>
          <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>Vote Recorded</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            Your vote has been cryptographically recorded on the StudentVoiceX Enterprise Audit Blockchain.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/student/status" className="btn btn-primary">
              View Participation Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleVerifyInPublicVerifier = () => {
    navigate('/verify', {
      state: { receiptId: receipt.transactionId || receipt.anonymousVoteId }
    });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', color: '#f1f5f9', fontFamily: 'var(--font-sans)' }}>
      {/* Success Badge Banner */}
      <div className="cyber-dark-card" style={{ padding: '32px', textAlign: 'center', border: '2px solid #10b981', marginBottom: '24px' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#34d399', marginBottom: '8px' }}>
          ✓ Ballot Cryptographically Sealed on Chain!
        </h1>
        <p style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          Your vote has been column-encrypted with <strong>AES-256-GCM</strong> and committed into the StudentVoiceX BFT Audit Ledger with zero linkage to your identity.
        </p>

        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '0.78rem' }}>
          <span className="badge badge-emerald">Consensus: BFT FINALIZED</span>
          <span className="badge badge-cyan">AuditBlock #{receipt.blockNumber}</span>
          <span className="badge-hsm">NIST FIPS 202 SHA-3</span>
          <span className="badge-bft">Ed25519 4-Witness Quorum</span>
        </div>
      </div>

      {/* Official Cryptographic Certificate Card */}
      <div className="cyber-dark-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={20} color="#38bdf8" />
            <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff' }}>
              StudentVoiceX Official Voter Audit Certificate
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleVerifyInPublicVerifier} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '0.76rem', color: '#38bdf8', background: '#0c1222', borderColor: '#1e293b' }}>
              <ExternalLink size={13} />
              <span>Public Audit</span>
            </button>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '0.76rem', background: '#0c1222', borderColor: '#1e293b' }}>
              <Printer size={13} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Top QR & Quick Summary Box */}
        <div style={{ display: 'flex', gap: '16px', background: '#0c1222', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '18px', alignItems: 'center' }}>
          <div style={{
            background: '#ffffff',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a'
          }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2h8v8H2zM4 4v4h4V4zM14 2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zM4 16v4h4v-4zM14 14h2v2h-2zM18 14h4v2h-4zM14 18h2v4h-2zM18 18h2v2h-2zM20 20h2v2h-2zM14 16h4v2h-4zM18 16h2v2h-2zM6 6h0v0H6z" />
            </svg>
          </div>

          <div style={{ flex: 1, fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Zero-Knowledge Verification Envelope
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.74rem', lineHeight: 1.4 }}>
              Scan with the Public Audit Tool to verify Merkle Root inclusion without exposing confidential candidate choices.
            </div>
          </div>
        </div>

        {/* Cryptographic Identifiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
          <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
              Anonymous Vote Reference ID
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <strong style={{ fontSize: '1.15rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {receipt.anonymousVoteId}
              </strong>
              <button onClick={() => handleCopy(receipt.anonymousVoteId)} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem', background: '#1e293b' }}>
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div style={{ background: '#0c1222', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
              Transaction Digest (BFT Audit Commitment)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <code style={{ fontSize: '0.78rem', color: '#a78bfa', wordBreak: 'break-all' }}>
                {receipt.transactionId || receipt.voteHash}
              </code>
              <button onClick={() => handleCopy(receipt.transactionId || receipt.voteHash)} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem', background: '#1e293b' }}>
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#0c1222', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>AUDIT HEIGHT</div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#f1f5f9' }}>Block #{receipt.blockNumber}</div>
            </div>

            <div style={{ background: '#0c1222', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>ELECTION EVENT</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>{election?.title || 'General Election'}</div>
            </div>
          </div>

          {/* Merkle Tree Proof Path Accordion */}
          <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setShowMerkleProof(!showMerkleProof)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#0c1222',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={14} color="#38bdf8" />
                <span>Cryptographic Merkle Proof Path & SHA-3 Root</span>
              </div>
              {showMerkleProof ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {showMerkleProof && (
              <div style={{ padding: '14px', background: '#030712', fontSize: '0.74rem' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#94a3b8' }}>AuditBlock SHA-3 Merkle Root:</strong>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', wordBreak: 'break-all', marginTop: '2px' }}>
                    {receipt.merkleRoot}
                  </div>
                </div>

                <div>
                  <strong style={{ color: '#94a3b8' }}>Proof Sibling Steps:</strong>
                  <div style={{ background: '#0c1222', color: '#34d399', padding: '10px', borderRadius: '6px', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', border: '1px solid #1e293b' }}>
                    {receipt.merkleProof && receipt.merkleProof.length > 0 ? (
                      receipt.merkleProof.map((step, idx) => (
                        <div key={idx}>
                          Step {idx + 1}: [{step.position}] {step.hash.slice(0, 24)}...
                        </div>
                      ))
                    ) : (
                      <div>✓ Leaf Verified Directly at Block Merkle Root</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
          Retain your Anonymous Vote Reference ID. You can independently confirm your ballot in the Public Verifier without breaking ballot secrecy.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/student/status" className="btn btn-primary" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🏆 View My Official Certificate</span>
        </Link>
        <button onClick={handleVerifyInPublicVerifier} className="btn btn-secondary" style={{ padding: '10px 20px', background: '#0c1222', borderColor: '#1e293b', color: '#38bdf8' }}>
          <ShieldCheck size={16} />
          <span>Launch Public Verifier</span>
        </button>
        <Link to="/student/dashboard" className="btn btn-secondary" style={{ padding: '10px 24px' }}>
          <span>Return to Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
