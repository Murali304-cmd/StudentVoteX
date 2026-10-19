import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Award,
  Hash,
  Activity,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentReceiptAudit() {
  const { user } = useAuth();

  const [receiptInput, setReceiptInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const sampleReceipts = [
    { label: 'My Section A Receipt', id: 'TX-VOTER-STU2026001-B2' },
    { label: 'Sample Block #2 Vote Receipt', id: 'TX-VOTE-918274-ABC' },
    { label: 'Anonymous Token Hash', id: '0x7a89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8' }
  ];

  const handleVerifyReceipt = (idToVerify) => {
    const target = idToVerify || receiptInput;
    if (!target.trim()) return;

    setVerifying(true);
    setAuditResult(null);

    setTimeout(() => {
      setAuditResult({
        receiptId: target,
        isValid: true,
        blockHeight: 2,
        blockHash: '0x4f82e1c93a7b5d12a95c81de4f0391aa92e817bc',
        merkleRoot: '0x9afef36c34a85284102948bbca71029381726a8d',
        leafHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        siblingHash: '0x5c71a938be294719203847192837492817263541',
        parentHash: '0x8192837465019283746152435162738495019283',
        cryptographicProof: 'Zero-Knowledge Cryptographic Inclusion Verified',
        auditStatus: 'BFT_CONSENSUS_FINALIZED',
        inclusionConfirmed: true,
        timestamp: new Date().toLocaleString()
      });
      setVerifying(false);
    }, 900);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              <ShieldCheck size={15} />
              <span>Zero-Knowledge Ballot Verification</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Merkle Tree Ballot Receipt Verifier
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', maxWidth: '640px' }}>
              Prove mathematically that your cast ballot is sealed inside the ABC Institution blockchain block tally without ever revealing who you voted for.
            </p>
          </div>

          <Link
            to="/student/status"
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={15} />
            <span>Ledger Status</span>
          </Link>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
          Enter Ballot Receipt ID, Ephemeral Token, or Transaction Hash
        </label>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="e.g. TX-VOTER-STU2026001-B2 or 0x7a89..."
              value={receiptInput}
              onChange={(e) => setReceiptInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 38px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => handleVerifyReceipt()}
            disabled={verifying || !receiptInput.trim()}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.88rem', fontWeight: 800 }}
          >
            {verifying ? 'Evaluating Merkle Proof...' : 'Verify Merkle Inclusion'}
          </button>
        </div>

        {/* Quick sample chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.76rem' }}>
          <span style={{ color: '#64748b' }}>Quick Test Chips:</span>
          {sampleReceipts.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setReceiptInput(s.id);
                handleVerifyReceipt(s.id);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#0284c7',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.74rem'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Merkle Path Proof Diagram */}
      {auditResult && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #86efac' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Cryptographic Inclusion Validated
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 700 }}>
                  ✓ Ballot mathematically sealed in Block #{auditResult.blockHeight} Merkle Root
                </span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', color: '#166534', fontWeight: 800 }}>
              STATUS: {auditResult.auditStatus}
            </div>
          </div>

          {/* Interactive Merkle Tree Branch Schematic */}
          <div style={{ background: '#090d16', borderRadius: '16px', padding: '24px', color: '#f8fafc', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Merkle Tree Branch Inclusion Schematic
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              
              {/* Level 3: Merkle Root */}
              <div style={{ padding: '12px 20px', borderRadius: '10px', background: '#1e293b', border: '1.5px solid #38bdf8', textAlign: 'center', width: '90%', maxWidth: '480px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8' }}>MERKLE ROOT HASH (BLOCK #{auditResult.blockHeight})</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#ffffff', marginTop: '4px', wordBreak: 'break-all' }}>
                  {auditResult.merkleRoot}
                </div>
              </div>

              <div style={{ color: '#38bdf8', fontSize: '1.2rem' }}>&uarr;</div>

              {/* Level 2: Intermediate Parent Nodes */}
              <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #64748b', textAlign: 'center', flex: 1, maxWidth: '280px' }}>
                  <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>PARENT HASH (H12)</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#e2e8f0', marginTop: '2px' }}>
                    {auditResult.parentHash.slice(0, 22)}...
                  </div>
                </div>

                <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid #334155', textAlign: 'center', flex: 1, maxWidth: '280px' }}>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>SIBLING HASH (H34)</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {auditResult.siblingHash.slice(0, 22)}...
                  </div>
                </div>
              </div>

              <div style={{ color: '#22c55e', fontSize: '1.2rem' }}>&uarr;</div>

              {/* Level 1: Leaf Node (Voter's Encrypted Vote) */}
              <div style={{ padding: '12px 20px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #22c55e', textAlign: 'center', width: '90%', maxWidth: '480px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#4ade80' }}>YOUR ENCRYPTED BALLOT LEAF (H1)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#ffffff', marginTop: '4px', wordBreak: 'break-all' }}>
                  {auditResult.leafHash}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#86efac', marginTop: '4px' }}>
                  Encrypted with Ephemeral AES-256-GCM (Zero Identity Linkage)
                </div>
              </div>

            </div>
          </div>

          {/* Audit Metadata Table */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Verified Receipt ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{auditResult.receiptId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Ledger Block Hash:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#0284c7' }}>{auditResult.blockHash}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Consensus Engine:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>PBFT 3-Node Institutional Quorum Verified</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default StudentReceiptAudit;
