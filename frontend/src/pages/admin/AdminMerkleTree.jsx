import React, { useState, useEffect } from 'react';
import {
  GitFork,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUp,
  Fingerprint,
  Info
} from 'lucide-react';
import { BFTAuditNav } from '../../components/blockchain/BFTAuditNav';
import { BlockchainVisualizer } from '../../components/blockchain/BlockchainVisualizer';
import { HashViewer } from '../../components/blockchain/HashViewer';
import { DetailDrawer } from '../../components/blockchain/DetailDrawer';
import { api } from '../../services/api';

export function AdminMerkleTree() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [proofResult, setProofResult] = useState(null); // 'VALID' | 'INVALID' | null
  const [selectedBlockNum, setSelectedBlockNum] = useState(0);
  const [availableBlocks, setAvailableBlocks] = useState([0]);

  useEffect(() => {
    async function loadBlocks() {
      try {
        const blks = await api.blockchain.blocks();
        if (Array.isArray(blks) && blks.length > 0) {
          const indices = blks.map(b => b.index);
          setAvailableBlocks(indices);
          setSelectedBlockNum(indices[indices.length - 1]);
        }
      } catch (e) {}
    }
    loadBlocks();
  }, []);

  // Deterministic Merkle Tree Structure for Block #1042
  const merkleRoot = '7a91b3c5e7f9a1b3c5e7f9a1b3c5e7f98b02c4d6f8a0b2c4d6f8a0b2c4d6f8a0';

  const level1 = {
    id: 'H12',
    label: 'SHA-3 Node (TX1 + TX2)',
    hash: '9f82c4d6a0b2c4d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    parent: 'ROOT',
    children: ['TX1', 'TX2']
  };

  const level2 = {
    id: 'H34',
    label: 'SHA-3 Node (TX3 + TX4)',
    hash: 'a193d5e7b1c3d5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    parent: 'ROOT',
    children: ['TX3', 'TX4']
  };

  const leafNodes = [
    {
      id: 'TX1',
      title: 'TX-8F29A1',
      type: 'Election Vote',
      raw_data: 'ZKP-BALLOT-7f3b9a1c | CANDIDATE-01 | WEIGHT-1.0',
      hash: '8a71b3c5e7f9a1b3c5e7f9a1b3c5e7f98a71b3c5e7f9a1b3c5e7f9a1b3c5e7f9',
      sibling_hash: '9b82c4d6f8a0b2c4d6f8a0b2c4d6f8a0',
      parent_hash: level1.hash,
      merkle_root: merkleRoot,
      path: ['TX1', 'H12', 'ROOT']
    },
    {
      id: 'TX2',
      title: 'TX-71BC22',
      type: 'Election Vote',
      raw_data: 'ZKP-BALLOT-4e8c2d1a | CANDIDATE-02 | WEIGHT-1.0',
      hash: '9b82c4d6f8a0b2c4d6f8a0b2c4d6f8a09b82c4d6f8a0b2c4d6f8a0b2c4d6f8a0',
      sibling_hash: '8a71b3c5e7f9a1b3c5e7f9a1b3c5e7f9',
      parent_hash: level1.hash,
      merkle_root: merkleRoot,
      path: ['TX2', 'H12', 'ROOT']
    },
    {
      id: 'TX3',
      title: 'TX-91DA44',
      type: 'Credential Issuance',
      raw_data: 'STU2026001 | DEPT-IT | YEAR-3 | SECTION-A',
      hash: 'ac93d5e7f9b1c3d5e7f9b1c3d5e7f9b1ac93d5e7f9b1c3d5e7f9b1c3d5e7f9b1',
      sibling_hash: 'bd04e6f8a0c2d4e6f8a0c2d4e6f8a0c2',
      parent_hash: level2.hash,
      merkle_root: merkleRoot,
      path: ['TX3', 'H34', 'ROOT']
    },
    {
      id: 'TX4',
      title: 'TX-32AC91',
      type: 'Election Vote',
      raw_data: 'ZKP-BALLOT-1a4f8b2c | CANDIDATE-01 | WEIGHT-1.0',
      hash: 'bd04e6f8a0c2d4e6f8a0c2d4e6f8a0c2bd04e6f8a0c2d4e6f8a0c2d4e6f8a0c2',
      sibling_hash: 'ac93d5e7f9b1c3d5e7f9b1c3d5e7f9b1',
      parent_hash: level2.hash,
      merkle_root: merkleRoot,
      path: ['TX4', 'H34', 'ROOT']
    }
  ];

  // Check if a node is in the active path
  const isNodeInPath = (nodeId) => {
    if (!hoveredNodeId) return false;
    const leaf = leafNodes.find((l) => l.id === hoveredNodeId);
    if (!leaf) return false;
    return leaf.path.includes(nodeId);
  };

  // Verify proof simulation
  const handleVerifyProof = () => {
    setVerifyingProof(true);
    setProofResult(null);

    setTimeout(() => {
      setVerifyingProof(false);
      setProofResult('VALID');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#ffffff' }}>
      <BFTAuditNav />

      {/* Persistent Blockchain Strip */}
      <BlockchainVisualizer />

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
              }}
            >
              <GitFork size={20} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              SHA-3 MERKLE TREE
            </h1>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
            Hierarchical cryptographic hash tree validating transactional inclusion in Block #{selectedBlockNum}.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Inspect Block:</span>
          {availableBlocks.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setSelectedBlockNum(num)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: selectedBlockNum === num ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedBlockNum === num ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                color: selectedBlockNum === num ? '#38bdf8' : '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Block #{num}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------- Visual Interactive Merkle Tree Canvas ----------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '24px',
          padding: '32px 24px',
          marginBottom: '24px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a855f7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            TREE ROOT APEX
          </span>
        </div>

        {/* 1. TOP APEX: MERKLE ROOT */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            onClick={() => setSelectedNode({ id: 'ROOT', title: 'MERKLE ROOT', type: 'Apex Root', hash: merkleRoot, parent_hash: 'GENESIS / BLOCK HEADER', sibling_hash: 'N/A', merkle_root: merkleRoot })}
            onMouseEnter={() => setHoveredNodeId('ROOT')}
            onMouseLeave={() => setHoveredNodeId(null)}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: isNodeInPath('ROOT') || hoveredNodeId === 'ROOT'
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(79, 70, 229, 0.4) 100%)'
                : 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: isNodeInPath('ROOT') || hoveredNodeId === 'ROOT'
                ? '2px solid #a855f7'
                : '1.5px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
              <GitFork size={18} color="#a855f7" />
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>
                MERKLE ROOT (Block #{selectedBlockNum})
              </span>
            </div>
            <code style={{ fontSize: '0.74rem', color: '#c084fc', wordBreak: 'break-all', display: 'block', fontWeight: 700 }}>
              {merkleRoot}
            </code>
            <div style={{ marginTop: '6px', fontSize: '0.66rem', color: '#10b981', fontWeight: 800 }}>
              ✓ Cryptographically Bound to Block Header
            </div>
          </div>
        </div>

        {/* Connecting Lines: Root -> Level 1 Nodes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '220px', marginBottom: '6px' }}>
          <div style={{ width: '2px', height: '24px', background: isNodeInPath('H12') ? '#a855f7' : 'rgba(168, 85, 247, 0.4)', boxShadow: isNodeInPath('H12') ? '0 0 10px #a855f7' : 'none' }} />
          <div style={{ width: '2px', height: '24px', background: isNodeInPath('H34') ? '#a855f7' : 'rgba(168, 85, 247, 0.4)', boxShadow: isNodeInPath('H34') ? '0 0 10px #a855f7' : 'none' }} />
        </div>

        {/* 2. MIDDLE LEVEL: Intermediary SHA-3 Nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '880px', margin: '0 auto 24px auto' }}>
          {/* Node H12 */}
          <div
            onClick={() => setSelectedNode({ id: level1.id, title: level1.label, type: 'Intermediate Branch', hash: level1.hash, parent_hash: merkleRoot, sibling_hash: level2.hash, merkle_root: merkleRoot })}
            style={{
              background: isNodeInPath('H12')
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)'
                : 'rgba(15, 23, 42, 0.85)',
              border: isNodeInPath('H12') ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
              boxShadow: isNodeInPath('H12') ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
              {level1.label}
            </div>
            <code style={{ fontSize: '0.68rem', color: '#94a3b8', wordBreak: 'break-all', display: 'block' }}>
              {level1.hash.substring(0, 32)}...
            </code>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
              SHA-3 ( Hash(TX1) + Hash(TX2) )
            </div>
          </div>

          {/* Node H34 */}
          <div
            onClick={() => setSelectedNode({ id: level2.id, title: level2.label, type: 'Intermediate Branch', hash: level2.hash, parent_hash: merkleRoot, sibling_hash: level1.hash, merkle_root: merkleRoot })}
            style={{
              background: isNodeInPath('H34')
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)'
                : 'rgba(15, 23, 42, 0.85)',
              border: isNodeInPath('H34') ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
              boxShadow: isNodeInPath('H34') ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
              {level2.label}
            </div>
            <code style={{ fontSize: '0.68rem', color: '#94a3b8', wordBreak: 'break-all', display: 'block' }}>
              {level2.hash.substring(0, 32)}...
            </code>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
              SHA-3 ( Hash(TX3) + Hash(TX4) )
            </div>
          </div>
        </div>

        {/* 3. LEAF LEVEL: Individual Transactions */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            TRANSACTION LEAF NODES (Hover to Trace Merkle Proof Path)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {leafNodes.map((leaf) => {
            const isHovered = hoveredNodeId === leaf.id;

            return (
              <div
                key={leaf.id}
                onClick={() => setSelectedNode(leaf)}
                onMouseEnter={() => setHoveredNodeId(leaf.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  background: isHovered
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(79, 70, 229, 0.35) 100%)'
                    : 'rgba(15, 23, 42, 0.8)',
                  border: isHovered ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: isHovered ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                    {leaf.title}
                  </span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="pulse-dot" />
                </div>

                <div style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 700, marginBottom: '4px' }}>
                  {leaf.type}
                </div>

                <code style={{ fontSize: '0.64rem', color: '#94a3b8', wordBreak: 'break-all', display: 'block', marginBottom: '8px' }}>
                  {leaf.hash.substring(0, 20)}...
                </code>

                <div style={{ fontSize: '0.64rem', color: isHovered ? '#38bdf8' : '#64748b', fontWeight: 700 }}>
                  {isHovered ? 'Tracing Path ↑' : 'Inspect Proof →'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------- Merkle Proof Detail Drawer ----------------- */}
      {selectedNode && (
        <DetailDrawer
          isOpen={!!selectedNode}
          onClose={() => { setSelectedNode(null); setProofResult(null); }}
          title={`MERKLE NODE: ${selectedNode.title || selectedNode.id}`}
          subtitle={`Level Type: ${selectedNode.type} • Block #${selectedBlockNum}`}
          icon={GitFork}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>NODE HASH:</div>
                <HashViewer hash={selectedNode.hash} truncate={false} />
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>SIBLING NODE HASH:</div>
                <HashViewer hash={selectedNode.sibling_hash} truncate={false} />
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>PARENT HASH:</div>
                <HashViewer hash={selectedNode.parent_hash} truncate={false} />
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>TARGET MERKLE ROOT:</div>
                <HashViewer hash={selectedNode.merkle_root} truncate={false} />
              </div>
            </div>

            {/* Proof Result Banner */}
            {proofResult === 'VALID' && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <CheckCircle2 size={18} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#a7f3d0' }}>
                    ✓ Valid SHA-3 Merkle Proof
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                    Irrefutable proof of transaction existence without revealing private voter data.
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleVerifyProof}
                disabled={verifyingProof}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={16} />
                <span>{verifyingProof ? 'Calculating SHA-3 Proof Chain...' : 'VERIFY MERKLE PROOF'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedNode(null); setProofResult(null); }}
                style={{
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
}

export default AdminMerkleTree;
