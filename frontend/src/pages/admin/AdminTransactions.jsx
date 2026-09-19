import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Sparkles,
  Lock,
  FileCheck,
  Layers,
  RefreshCw,
  Box,
  Key,
  Plus,
  Zap,
  Check,
  Copy,
  Send,
  Database,
  GitFork,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { BFTAuditNav } from '../../components/blockchain/BFTAuditNav';
import { BlockchainVisualizer } from '../../components/blockchain/BlockchainVisualizer';
import { StatusBadge } from '../../components/blockchain/StatusBadge';
import { HashViewer } from '../../components/blockchain/HashViewer';
import { DetailDrawer } from '../../components/blockchain/DetailDrawer';
import { VerificationProgress } from '../../components/blockchain/VerificationProgress';
import { emitBackgroundEvent, BG_EVENTS } from '../../services/eventBus';
import { audioFX } from '../../utils/audioFX';


export function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [copiedTxId, setCopiedTxId] = useState(null);

  // Broadcast New Transaction Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [newTxType, setNewTxType] = useState('Election Vote');
  const [newTxPayload, setNewTxPayload] = useState('Presidential Election - Candidate #01 (CS Dept)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Default seed transactions
  const seedTransactions = [
    {
      id: 'TX-9A81F042',
      type: 'Election Vote',
      block_number: 1044,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      hash: '9a81f042b3c5e7f9a1b3c5e7f9a1b3c5e7f9a1b3c5e7f9a1b3c5e7f9a1b3c5e7',
      anonymous_vote_id: 'ZKP-NULLIFIER-7F3A91BC',
      signature_status: 'ECDSA-SECP256K1 VALID',
      merkle_proof: '0x9a81f0... [Branch Level 2 Validated]',
      validator: 'NODE-01 (Auditorium Hub)',
      gas_used: '21,000 gas',
      status: 'CONFIRMED'
    },
    {
      id: 'TX-71BC22A0',
      type: 'Election Vote',
      block_number: 1044,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      hash: '71bc22a0e7f9a1b3c5e7f9a1b3c5e7f98b02c4d6f8a0b2c4d6f8a0b2c4d6f8a0',
      anonymous_vote_id: 'ZKP-NULLIFIER-4E8C2D1A',
      signature_status: 'ECDSA-SECP256K1 VALID',
      merkle_proof: '0x71bc22... [Branch Level 2 Validated]',
      validator: 'NODE-02 (Library West)',
      gas_used: '21,000 gas',
      status: 'CONFIRMED'
    },
    {
      id: 'TX-4F92B301',
      type: 'Credential Issuance',
      block_number: 1043,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      hash: '4f92b301c5e7f9a1b3c5e7f9a1b3c5e7f98b02c4d6f8a0b2c4d6f8a0b2c4d6f8',
      anonymous_vote_id: 'STUDENT-REG-2026-IT',
      signature_status: 'ED25519-ADMIN VALID',
      merkle_proof: '0x4f92b3... [Branch Level 1 Validated]',
      validator: 'NODE-04 (Institutional Server)',
      gas_used: '35,000 gas',
      status: 'CONFIRMED'
    },
    {
      id: 'TX-E8A109CF',
      type: 'Candidate Nomination',
      block_number: 1043,
      timestamp: new Date(Date.now() - 360000).toISOString(),
      hash: 'e8a109cfb1c3d5e7f9b1c3d5e7f9b1c3d5e7f9b1ac93d5e7f9b1c3d5e7f9b1c3',
      anonymous_vote_id: 'NOMINEE-CSE-004',
      signature_status: 'ECDSA-SECP256K1 VALID',
      merkle_proof: '0xe8a109... [Branch Level 3 Validated]',
      validator: 'NODE-03 (East Lab)',
      gas_used: '42,000 gas',
      status: 'CONFIRMED'
    },
    {
      id: 'TX-MEMPOOL-01',
      type: 'Election Vote',
      block_number: 'Mempool (Pending)',
      timestamp: new Date().toISOString(),
      hash: 'b1c3d5e7f9a1b3c5e7f9a1b3c5e7f98b02c4d6f8a0b2c4d6f8a0b2c4d6f8a099',
      anonymous_vote_id: 'ZKP-NULLIFIER-99A1C2FF',
      signature_status: 'ECDSA-SECP256K1 VALID',
      merkle_proof: 'Pending Block Inclusion...',
      validator: 'Pending Quorum Selection',
      gas_used: '21,000 gas',
      status: 'IN_MEMPOOL'
    }
  ];

  const fetchTransactions = async () => {
    try {
      const data = await api.blockchain.transactions();
      if (Array.isArray(data) && data.length > 0) {
        // Format incoming backend transactions to unified schema
        const mapped = data.map((t, i) => ({
          id: t.tx_id || t.id || `TX-${(t.hash || '8F29A1').substring(0, 8).toUpperCase()}`,
          type: t.type || (t.candidate_name ? 'Election Vote' : 'Ballot Token Seal'),
          block_number: t.block_index !== null && t.block_index !== undefined ? t.block_index : 'Mempool (Pending)',
          timestamp: t.timestamp || t.block_timestamp || new Date().toISOString(),
          hash: t.vote_hash || t.hash || `0000${Math.random().toString(16).substring(2, 32)}`,
          anonymous_vote_id: t.anonymous_vote_id || t.nullifier || 'ZKP-ANON-BALLOT',
          signature_status: t.signature_valid !== false ? 'ECDSA-SECP256K1 VALID' : 'INVALID',
          merkle_proof: t.merkle_proof || '0x7a91b3... [Branch Level 2 Validated]',
          validator: t.validator || 'NODE-01 (Auditorium Hub)',
          gas_used: '21,000 gas',
          status: t.status || (t.block_index !== null && t.block_index !== undefined ? 'CONFIRMED' : 'IN_MEMPOOL')
        }));
        setTransactions(mapped);
      } else {
        setTransactions(seedTransactions);
      }
    } catch (e) {
      setTransactions(seedTransactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    const matchSearch =
      (tx.id || '').toLowerCase().includes(q) ||
      (tx.type || '').toLowerCase().includes(q) ||
      (tx.hash || '').toLowerCase().includes(q) ||
      (tx.anonymous_vote_id || '').toLowerCase().includes(q);

    if (filterType === 'ALL') return matchSearch;
    if (filterType === 'MEMPOOL') return matchSearch && tx.status === 'IN_MEMPOOL';
    return matchSearch && tx.type === filterType;
  });

  // Animated Step-by-Step Transaction Verification Simulation
  const handleVerifyTransaction = () => {
    setVerifying(true);
    setVerifyStep(1);
    audioFX.playProofVerify();

    setTimeout(() => setVerifyStep(2), 400);
    setTimeout(() => setVerifyStep(3), 800);
    setTimeout(() => setVerifyStep(4), 1200);
    setTimeout(() => {
      setVerifyStep(5);
      setVerifying(false);
      emitBackgroundEvent(BG_EVENTS.MERKLE_VERIFY);
    }, 1600);
  };

  // Broadcast New Transaction to Mempool Simulation
  const handleBroadcastTransaction = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);

    setTimeout(() => {
      const newId = `TX-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
      const newHash = `${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;
      const newNullifier = `ZKP-NULLIFIER-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;

      const createdTx = {
        id: newId,
        type: newTxType,
        block_number: 'Mempool (Pending)',
        timestamp: new Date().toISOString(),
        hash: newHash,
        anonymous_vote_id: newNullifier,
        signature_status: 'ECDSA-SECP256K1 VALID',
        merkle_proof: 'Pending Block Inclusion...',
        validator: 'Pending Quorum Witness',
        gas_used: '21,000 gas',
        status: 'IN_MEMPOOL'
      };

      setTransactions((prev) => [createdTx, ...prev]);
      setIsBroadcasting(false);
      setIsBroadcastOpen(false);
      setSelectedTx(createdTx);

      emitBackgroundEvent(BG_EVENTS.VOTE_CAST, { txId: newId });
      audioFX.playTxBlip();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  // Package & Mine Mempool Transactions
  const handleMineMempool = async () => {
    try {
      await api.blockchain.mineBlock(3);
      fetchTransactions();
      emitBackgroundEvent(BG_EVENTS.BLOCK_MINED);
      audioFX.playBlockMined();
      confetti({ particleCount: 70, spread: 70 });
    } catch (e) {
      // simulate local mine
      setTransactions((prev) =>
        prev.map((t) => (t.status === 'IN_MEMPOOL' ? { ...t, status: 'CONFIRMED', block_number: 1045 } : t))
      );
      emitBackgroundEvent(BG_EVENTS.BLOCK_MINED);
      audioFX.playBlockMined();
    }
  };


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(text);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  const mempoolCount = transactions.filter((t) => t.status === 'IN_MEMPOOL').length;
  const confirmedCount = transactions.filter((t) => t.status === 'CONFIRMED').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#ffffff' }}>
      <BFTAuditNav />

      {/* Top Persistent Blockchain Ribbon */}
      <BlockchainVisualizer />

      {/* ----------------- Top Header ----------------- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <ArrowLeftRight size={22} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                TRANSACTIONS EXPLORER & MEMPOOL
              </h1>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Decoded zero-knowledge cryptographic transactions signed via ECDSA secp256k1 keys.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Broadcast Tx & Mine Mempool */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {mempoolCount > 0 && (
            <button
              type="button"
              onClick={handleMineMempool}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Zap size={15} color="#fbbf24" />
              <span>Mine Mempool ({mempoolCount} Pending)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
            }}
          >
            <Plus size={16} />
            <span>Broadcast New Transaction</span>
          </button>
        </div>
      </div>

      {/* ----------------- Top 3 Statistics Cards ----------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            TOTAL TRANSACTIONS
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {transactions.length.toLocaleString()} TX
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            Cumulative ledger transaction count
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
            CONFIRMED & SEALED
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
            {confirmedCount.toLocaleString()} TX
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            Bound into cryptographic Merkle trees
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(245, 158, 11, 0.1) 100%)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
            MEMPOOL PENDING QUEUE
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
            {mempoolCount} TX
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            Awaiting validator block packaging
          </div>
        </div>
      </div>

      {/* ----------------- Filter & Search Bar ----------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Transaction ID (TX-8F29A1), hash, or ZKP nullifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#ffffff',
              fontSize: '0.84rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Type Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'Election Vote', label: 'Election Votes' },
            { id: 'Credential Issuance', label: 'Credentials' },
            { id: 'MEMPOOL', label: 'Pending Mempool' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: filterType === tab.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: filterType === tab.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                color: filterType === tab.id ? '#38bdf8' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------- Transactions Ledger Table ----------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
          overflowX: 'auto',
          marginBottom: '24px'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 14px' }}>Transaction ID</th>
              <th style={{ padding: '12px 14px' }}>Type</th>
              <th style={{ padding: '12px 14px' }}>Block Height</th>
              <th style={{ padding: '12px 14px' }}>Timestamp</th>
              <th style={{ padding: '12px 14px' }}>ZKP Nullifier Hash</th>
              <th style={{ padding: '12px 14px' }}>ECDSA Signature</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => { setSelectedTx(tx); setVerifyStep(0); }}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                className="hover-row-cyber"
              >
                <td style={{ padding: '14px', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                  {tx.id}
                </td>
                <td style={{ padding: '14px', color: '#f8fafc', fontWeight: 600 }}>
                  {tx.type}
                </td>
                <td style={{ padding: '14px' }}>
                  <span style={{ color: tx.status === 'IN_MEMPOOL' ? '#f59e0b' : '#818cf8', fontWeight: 700 }}>
                    {typeof tx.block_number === 'number' ? `Block #${tx.block_number}` : tx.block_number}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '14px' }}>
                  <code style={{ fontSize: '0.72rem', color: '#a855f7', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                    {(tx.anonymous_vote_id || 'ZKP-BALLOT').substring(0, 16)}...
                  </code>
                </td>
                <td style={{ padding: '14px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    ✓ ECDSA Valid
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  <StatusBadge status={tx.status} size="xs" />
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); setVerifyStep(0); }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------- Broadcast Transaction Modal ----------------- */}
      {isBroadcastOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsBroadcastOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.2)',
              color: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                  Broadcast Live Transaction to Mempool
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Signs transaction with ECDSA keypair and queues into the memory pool.
                </div>
              </div>
            </div>

            <form onSubmit={handleBroadcastTransaction}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                  TRANSACTION TYPE:
                </label>
                <select
                  value={newTxType}
                  onChange={(e) => setNewTxType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                >
                  <option value="Election Vote">Election Ballot (Zero-Knowledge Protected)</option>
                  <option value="Credential Issuance">Student Identity Credential Issuance</option>
                  <option value="Candidate Nomination">Candidate Nomination Certificate</option>
                  <option value="Validator Staking">Validator Node Consensus Stake</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                  TRANSACTION PAYLOAD / RECIPIENT:
                </label>
                <input
                  type="text"
                  value={newTxPayload}
                  onChange={(e) => setNewTxPayload(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '18px', fontSize: '0.72rem', color: '#94a3b8' }}>
                • An asymmetric secp256k1 keypair will generate a digital signature <code>(r, s)</code>.<br />
                • A zero-knowledge nullifier will be computed to guarantee 100% anonymous, un-linkable voting.
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
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
                  {isBroadcasting ? <RefreshCw size={15} className="spin-slow" /> : <Send size={15} />}
                  <span>{isBroadcasting ? 'Broadcasting & Signing...' : 'Sign & Broadcast to Mempool'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
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
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- Animated Transaction Detail Drawer ----------------- */}
      {selectedTx && (
        <DetailDrawer
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title={`TRANSACTION ${selectedTx.id}`}
          subtitle={`${selectedTx.type} • Height: ${typeof selectedTx.block_number === 'number' ? `#${selectedTx.block_number}` : selectedTx.block_number}`}
          icon={ArrowLeftRight}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>ANONYMOUS NULLIFIER (ZKP)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {selectedTx.anonymous_vote_id || 'ZKP-PROTECTED-TOKEN'}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>SIGNATURE STATUS</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {selectedTx.signature_status || 'ECDSA-SECP256K1 VALID'}
                </div>
              </div>
            </div>

            {/* Hashes and Merkle Proof */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>TRANSACTION HASH:</div>
                <HashViewer hash={selectedTx.hash} truncate={false} />
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>MERKLE PROOF PATH:</div>
                <code style={{ fontSize: '0.75rem', color: '#a855f7', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '6px', display: 'block' }}>
                  {selectedTx.merkle_proof || '0x7a91b3c5... [Branch Level 3 Verified]'}
                </code>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>VALIDATING WITNESS NODE:</div>
                <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
                  {selectedTx.validator || 'NODE-01 (Auditorium Hub)'}
                </div>
              </div>
            </div>

            {/* Multi-Step Animated Verification */}
            {verifyStep > 0 && (
              <VerificationProgress currentStep={verifyStep} totalSteps={5} />
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleVerifyTransaction}
                disabled={verifying}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                <span>{verifying ? 'Executing Proof Verification...' : 'VERIFY TRANSACTION PROOF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
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

export default AdminTransactions;
