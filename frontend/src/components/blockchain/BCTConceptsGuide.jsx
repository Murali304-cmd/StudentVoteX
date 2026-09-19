import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  GitFork,
  ShieldCheck,
  Cpu,
  Key,
  Lock,
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  X,
  ChevronRight,
  Database
} from 'lucide-react';

// Lightweight fast SHA-256 for client-side interactive demo
async function sha256Client(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function BCTConceptsGuide({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chaining');
  
  // Playground States
  const [inputData, setInputData] = useState('StudentVoiceX: Vote for Candidate #01');
  const [computedHash, setComputedHash] = useState('');
  const [merkleLeaves, setMerkleLeaves] = useState(['Vote TX-01', 'Vote TX-02', 'Vote TX-03', 'Vote TX-04']);
  const [merkleTreeDemo, setMerkleTreeDemo] = useState(null);
  const [bftNodes, setBftNodes] = useState([
    { id: 'Node 1 (Leader)', status: 'HONEST', voted: true },
    { id: 'Node 2 (Library)', status: 'HONEST', voted: true },
    { id: 'Node 3 (East Lab)', status: 'HONEST', voted: true },
    { id: 'Node 4 (Auditor)', status: 'HONEST', voted: true },
  ]);

  // Compute live hash on input change
  React.useEffect(() => {
    sha256Client(inputData).then(setComputedHash);
  }, [inputData]);

  // Compute live Merkle tree on leaf changes
  React.useEffect(() => {
    async function calcTree() {
      const h1 = await sha256Client(merkleLeaves[0] || '');
      const h2 = await sha256Client(merkleLeaves[1] || '');
      const h3 = await sha256Client(merkleLeaves[2] || '');
      const h4 = await sha256Client(merkleLeaves[3] || '');
      const h12 = await sha256Client(h1 + h2);
      const h34 = await sha256Client(h3 + h4);
      const root = await sha256Client(h12 + h34);
      setMerkleTreeDemo({ h1, h2, h3, h4, h12, h34, root });
    }
    calcTree();
  }, [merkleLeaves]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'chaining', label: '1. Cryptographic Hash Chaining', icon: Layers },
    { id: 'merkle', label: '2. Merkle Trees & ZKP Proofs', icon: GitFork },
    { id: 'bft', label: '3. Byzantine Fault Tolerance (BFT)', icon: ShieldCheck },
    { id: 'mempool', label: '4. Mempool & Digital Signatures', icon: ArrowLeftRight },
    { id: 'mining', label: '5. Proof of Work & Block Sealing', icon: Cpu },
  ];

  // BFT Calculation
  const totalBFTNodes = bftNodes.length;
  const fFaultsAllowed = Math.floor((totalBFTNodes - 1) / 3); // f = (4-1)/3 = 1
  const honestVotedCount = bftNodes.filter(n => n.status === 'HONEST' && n.voted).length;
  const quorumRequired = 2 * fFaultsAllowed + 1; // 2(1) + 1 = 3 out of 4 (or 2/3+1 = 3)
  const isBFTConsensusReached = honestVotedCount >= quorumRequired;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Blockchain Technology (BCT) Concepts & Architecture
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Interactive theoretical and cryptographic principles powering the StudentVoiceX decentralized ledger.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(11, 17, 32, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* TAB 1: Cryptographic Hash Chaining */}
          {activeTab === 'chaining' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#38bdf8', fontWeight: 800 }}>
                  How Cryptographic Hash Chaining Works
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  A blockchain is an append-only sequential ledger where each block contains a cryptographic header hash of the <strong>entire previous block</strong> (<code>previous_hash</code>).
                  Because cryptographic hash functions like <strong>SHA-256</strong> exhibit the <em>Avalanche Effect</em>, modifying even a single comma or timestamp in Block #1 completely changes its hash, instantly breaking the link to Block #2, Block #3, and all downstream blocks.
                </p>
              </div>

              {/* Interactive Hash Playground */}
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Interactive SHA-256 Hash Engine (Try typing below)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>✓ Deterministic 256-Bit Output</span>
                </div>

                <input
                  type="text"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Type any transaction data or ballot payload..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    COMPUTED SHA-256 CRYPTOGRAPHIC DIGEST (64 HEX CHARACTERS):
                  </div>
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#070d1e',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      fontFamily: 'monospace',
                      fontSize: '0.82rem',
                      color: '#4ade80',
                      wordBreak: 'break-all'
                    }}
                  >
                    {computedHash}
                  </div>
                </div>
              </div>

              {/* 3-Block Chaining Visual Demo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8' }}>BLOCK #0 (Genesis)</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>Prev: <code>000000000000...</code></div>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px' }}>Hash: <code>0000e8a1b2c3...</code></div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8' }}>BLOCK #1</div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '4px' }}>Prev: <code style={{ color: '#10b981' }}>0000e8a1b2c3...</code></div>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: '2px' }}>Hash: <code>00007f3b9a1c...</code></div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8' }}>BLOCK #2 (Latest)</div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '4px' }}>Prev: <code style={{ color: '#38bdf8' }}>00007f3b9a1c...</code></div>
                  <div style={{ fontSize: '0.68rem', color: '#a855f7', marginTop: '2px' }}>Hash: <code>0000c4d6f8a0...</code></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Merkle Trees & ZKP Proofs */}
          {activeTab === 'merkle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#c084fc', fontWeight: 800 }}>
                  Binary Merkle Trees & Zero-Knowledge Inclusion Proofs
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  A <strong>Merkle Tree</strong> is a hierarchical binary hash tree where each leaf node is a transaction hash and each parent node is the hash of its concatenated children: 
                  <code> Parent = SHA256( ChildA + ChildB )</code>.
                  The <strong>Merkle Root</strong> in the block header guarantees the cryptographic inclusion of all transactions. 
                  With <strong>Zero-Knowledge Proofs (ZKP)</strong>, a student can mathematically prove their ballot exists inside the Merkle tree in $O(\log N)$ steps without exposing their student identity or candidate choice!
                </p>
              </div>

              {/* Interactive Merkle Tree Visualizer */}
              {merkleTreeDemo && (
                <div style={{ background: 'rgba(30, 27, 75, 0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                      TOP APEX: COMPUTED MERKLE ROOT
                    </span>
                    <div style={{ background: '#0b1120', padding: '10px', borderRadius: '10px', border: '1.5px solid #a855f7', maxWidth: '550px', margin: '8px auto 0', fontFamily: 'monospace', fontSize: '0.75rem', color: '#e879f9', wordBreak: 'break-all' }}>
                      {merkleTreeDemo.root}
                    </div>
                  </div>

                  {/* Branch Level */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '650px', margin: '0 auto 16px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>Node H12 = Hash(TX1 + TX2)</div>
                      <code style={{ fontSize: '0.64rem', color: '#94a3b8', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
                        {merkleTreeDemo.h12.substring(0, 24)}...
                      </code>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>Node H34 = Hash(TX3 + TX4)</div>
                      <code style={{ fontSize: '0.64rem', color: '#94a3b8', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
                        {merkleTreeDemo.h34.substring(0, 24)}...
                      </code>
                    </div>
                  </div>

                  {/* Leaf Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {merkleLeaves.map((leafVal, i) => (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, marginBottom: '4px' }}>
                          Leaf TX #{i + 1}
                        </div>
                        <input
                          type="text"
                          value={leafVal}
                          onChange={(e) => {
                            const updated = [...merkleLeaves];
                            updated[i] = e.target.value;
                            setMerkleLeaves(updated);
                          }}
                          style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            outline: 'none'
                          }}
                        />
                        <code style={{ fontSize: '0.58rem', color: '#64748b', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
                          {(merkleTreeDemo[`h${i + 1}`] || '').substring(0, 16)}...
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Byzantine Fault Tolerance (BFT) */}
          {activeTab === 'bft' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#34d399', fontWeight: 800 }}>
                  Practical Byzantine Fault Tolerance (PBFT) & Quorum
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  In a decentralized campus network, nodes may crash, lose power, or act maliciously. 
                  PBFT solves the <em>Byzantine Generals Problem</em> by guaranteeing 100% consensus safety as long as malicious nodes $f &lt; N/3$.
                  With $N=4$ nodes, the network tolerates $f=1$ faulty node. A supermajority of $2f + 1 = 3$ nodes is required across 3 phases:
                  <strong> Pre-Prepare</strong> (Proposer broadcasts block) $\rightarrow$ 
                  <strong> Prepare</strong> (Nodes validate signatures) $\rightarrow$ 
                  <strong> Commit</strong> (Quorum reaches consensus).
                </p>
              </div>

              {/* Interactive BFT Node Quorum Simulator */}
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
                      Interactive 4-Node BFT Multi-Witness Simulator
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Toggle node health to test if the network achieves $2f+1$ consensus quorum!
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      background: isBFTConsensusReached ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      border: isBFTConsensusReached ? '1px solid #10b981' : '1px solid #ef4444',
                      color: isBFTConsensusReached ? '#34d399' : '#f87171'
                    }}
                  >
                    {isBFTConsensusReached ? '✓ BFT QUORUM REACHED (CONSENSUS VALID)' : '✕ CONSENSUS STALLED (LACK OF 2f+1 QUORUM)'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {bftNodes.map((node, idx) => {
                    const isHonest = node.status === 'HONEST';
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isHonest ? 'rgba(15, 23, 42, 0.9)' : 'rgba(239, 68, 68, 0.15)',
                          border: isHonest ? '1px solid rgba(56, 189, 248, 0.3)' : '1.5px solid #ef4444',
                          borderRadius: '12px',
                          padding: '14px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isHonest ? '#f8fafc' : '#f87171', marginBottom: '4px' }}>
                          {node.id}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: isHonest ? '#10b981' : '#f87171', fontWeight: 700, marginBottom: '10px' }}>
                          {isHonest ? '✓ HONEST WITNESS' : '⚠ FAULTY / BYZANTINE'}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...bftNodes];
                            updated[idx].status = isHonest ? 'BYZANTINE' : 'HONEST';
                            setBftNodes(updated);
                          }}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: isHonest ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: isHonest ? '#f87171' : '#34d399',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isHonest ? 'Turn Rogue / Offline' : 'Restore Honest Node'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Mempool & Digital Signatures */}
          {activeTab === 'mempool' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#fbbf24', fontWeight: 800 }}>
                  Memory Pool (Mempool) & Asymmetric Cryptography
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  Before a vote or credential is sealed into an immutable block, it enters the <strong>Mempool (Memory Pool)</strong> as an unconfirmed transaction.
                  Each transaction is signed using <strong>ECDSA (secp256k1)</strong> or <strong>Ed25519</strong> asymmetric private keys. 
                  Validators verify the digital signature against the sender's public key to guarantee authenticity and prevent impersonation or tampering.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Key size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>Asymmetric Keypairs</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    • <strong>Private Key (SK):</strong> Kept strictly confidential on the student device / kiosk hardware token to sign ballots.<br />
                    • <strong>Public Key (PK):</strong> Broadcasted to verify signatures across the BFT peer network without revealing the secret key.
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={16} color="#10b981" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>Zero-Knowledge Nullifiers</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    • <strong>Double-Spend Prevention:</strong> Each ballot produces a unique one-way nullifier hash <code>Nullifier = Hash(StudentSecret + ElectionID)</code>.<br />
                    • If a student attempts to vote twice, the second nullifier collides and is instantly rejected while preserving full voter secrecy.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Proof of Work & Block Sealing */}
          {activeTab === 'mining' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#38bdf8', fontWeight: 800 }}>
                  Proof of Work (PoW) Nonce Mining & Proof of Authority (PoA)
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  Mining is the process of iterating an integer <code>nonce</code> (number used once) until the SHA-256 header hash of the block meets a <strong>difficulty target</strong> (e.g. starting with <code>0000...</code>).
                  In enterprise and campus voting, hybrid <strong>PoA/BFT</strong> enables fast, green, sub-second block finality with zero energy waste while retaining full cryptographic immutability!
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                <div style={{ color: '#38bdf8', fontWeight: 800, marginBottom: '8px' }}>
                  Block Header Formula:
                </div>
                <div style={{ color: '#cbd5e1', background: '#070d1e', padding: '10px 14px', borderRadius: '8px', lineHeight: 1.6 }}>
                  Block_Hash = SHA256( Block_Index + Previous_Hash + Merkle_Root + Timestamp + Nonce )<br />
                  Target Condition: Block_Hash &lt; Difficulty_Target (e.g. Prefix == "0000")
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            StudentVoiceX • Real-time Enterprise Blockchain Technology Suite
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default BCTConceptsGuide;
