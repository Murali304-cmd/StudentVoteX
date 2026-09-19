import React, { useState, useEffect } from 'react';
import {
  Network,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Play,
  Zap,
  Activity,
  Server,
  Radio,
  Send,
  Lock
} from 'lucide-react';
import { BFTAuditNav } from '../../components/blockchain/BFTAuditNav';
import { BlockchainVisualizer } from '../../components/blockchain/BlockchainVisualizer';
import { StatusBadge } from '../../components/blockchain/StatusBadge';

export function AdminNetwork() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: idle, 1: proposed, 2: validating, 3: voted, 4: consensus
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    {
      id: 'NODE-01',
      name: 'Auditorium Kiosk Hub',
      role: 'Lead Miner / Proposer',
      ip: '10.0.1.101',
      latency: '2.4 ms',
      status: 'ONLINE',
      blocks_proposed: 412,
      voting_power: '25%',
      bft_state: activeStep >= 1 ? 'PROPOSER' : 'IDLE'
    },
    {
      id: 'NODE-02',
      name: 'Library West Wing',
      role: 'Consensus Validator',
      ip: '10.0.1.102',
      latency: '3.1 ms',
      status: 'ONLINE',
      blocks_proposed: 320,
      voting_power: '25%',
      bft_state: activeStep >= 2 ? (activeStep >= 3 ? 'VOTED ✓' : 'VALIDATING') : 'IDLE'
    },
    {
      id: 'NODE-03',
      name: 'Campus East Computer Centre',
      role: 'Consensus Validator',
      ip: '10.0.1.103',
      latency: '2.8 ms',
      status: 'ONLINE',
      blocks_proposed: 311,
      voting_power: '25%',
      bft_state: activeStep >= 2 ? (activeStep >= 3 ? 'VOTED ✓' : 'VALIDATING') : 'IDLE'
    },
    {
      id: 'NODE-04',
      name: 'Main Institutional Server (Admin)',
      role: 'Full Node / Finalizer',
      ip: '10.0.1.104',
      latency: '1.2 ms',
      status: 'ONLINE',
      blocks_proposed: 0,
      voting_power: '25%',
      bft_state: activeStep >= 4 ? 'COMMITTED ✓' : (activeStep >= 3 ? 'VOTED ✓' : 'IDLE')
    }
  ];

  const handleRunConsensusDemo = () => {
    setIsSimulating(true);
    setActiveStep(1); // NODE-01 Proposing

    setTimeout(() => {
      setActiveStep(2); // Broadcast to NODE-02, NODE-03
    }, 900);

    setTimeout(() => {
      setActiveStep(3); // Nodes Vote (2/3+ threshold reached)
    }, 1800);

    setTimeout(() => {
      setActiveStep(4); // Committed
      setIsSimulating(false);
    }, 2700);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#ffffff' }}>
      <BFTAuditNav />

      {/* Persistent Blockchain Strip */}
      <BlockchainVisualizer />

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <Network size={20} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              BFT MULTI-WITNESS MESH
            </h1>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
            Educational Byzantine Fault Tolerant (BFT) multi-witness validator network with 2/3+ quorum consensus.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunConsensusDemo}
          disabled={isSimulating}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
          }}
        >
          {isSimulating ? <RefreshCw size={15} className="spin-slow" /> : <Play size={15} />}
          <span>{isSimulating ? 'Simulating Consensus Round...' : 'Simulate BFT Consensus Round'}</span>
        </button>
      </div>

      {/* ----------------- Consensus Status Banner ----------------- */}
      <div
        style={{
          background: activeStep === 4
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)'
            : isSimulating
            ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: activeStep === 4
            ? '1.5px solid #10b981'
            : isSimulating
            ? '1.5px solid #38bdf8'
            : '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color={activeStep === 4 ? '#10b981' : '#38bdf8'} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
              {activeStep === 0 && 'Consensus Engine Ready — 4 of 4 Multi-Witnesses Synced'}
              {activeStep === 1 && 'Stage 1: Proposal Broadcast from NODE-01 → Mesh Network'}
              {activeStep === 2 && 'Stage 2: Validation of Cryptographic Ballot Signatures'}
              {activeStep === 3 && 'Stage 3: 4/4 Votes Received (> 66.7% BFT Quorum Threshold)'}
              {activeStep === 4 && '✓ BFT CONSENSUS REACHED — Block Finalized on All Nodes'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Fault tolerance parameter: f = 1 (can tolerate 1 malicious or offline node while maintaining 100% safety).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981' }}>
            {activeStep >= 3 ? '4 / 4 Witnesses Voted (100%)' : '4 Nodes Active'}
          </span>
        </div>
      </div>

      {/* ----------------- 2x2 Network Mesh Grid ----------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {nodes.map((node, idx) => {
          const isProposer = node.id === 'NODE-01';
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
                border: isSelected
                  ? '2px solid #38bdf8'
                  : '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isProposer ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Cpu size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                      {node.id}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {node.name}
                    </div>
                  </div>
                </div>

                <StatusBadge status={node.status} size="xs" />
              </div>

              {/* Role & Network Parameters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.74rem', margin: '14px 0', background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '10px' }}>
                <div>
                  <div style={{ color: '#64748b' }}>Role:</div>
                  <strong style={{ color: '#38bdf8' }}>{node.role}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>IP & Latency:</div>
                  <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{node.ip} ({node.latency})</span>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Voting Power:</div>
                  <strong style={{ color: '#10b981' }}>{node.voting_power}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Consensus State:</div>
                  <span style={{ color: node.bft_state.includes('✓') ? '#10b981' : '#38bdf8', fontWeight: 800 }}>
                    {node.bft_state}
                  </span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                <span>Blocks Sealed: <strong>{node.blocks_proposed}</strong></span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Inspect Node →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminNetwork;
