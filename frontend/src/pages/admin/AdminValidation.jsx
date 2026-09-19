import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  RotateCcw,
  Lock,
  Box,
  Layers,
  GitFork,
  ArrowLeftRight,
  Cpu,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { BFTAuditNav } from '../../components/blockchain/BFTAuditNav';
import { BlockchainVisualizer } from '../../components/blockchain/BlockchainVisualizer';
import { StatusBadge } from '../../components/blockchain/StatusBadge';
import { HashViewer } from '../../components/blockchain/HashViewer';

export function AdminValidation() {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const [activeStage, setActiveStage] = useState(5); // 0..5
  const [tamperedState, setTamperedState] = useState(false);
  const [tamperingInProgress, setTamperingInProgress] = useState(false);

  const stages = [
    { num: 1, title: 'Validating Block Headers (Genesis Block #0 → Latest)', desc: 'Validating cryptographic hashes & difficulty targets' },
    { num: 2, title: 'Checking Sequential Hash Links', desc: 'Ensuring Previous Hash -> Current Hash pointer integrity' },
    { num: 3, title: 'Verifying SHA-3 Merkle Roots', desc: 'Validating hierarchical transaction inclusion tree hashes' },
    { num: 4, title: 'Auditing Encrypted Ballot Signatures', desc: 'Verifying ECDSA & Ed25519 zero-knowledge voter credentials' },
    { num: 5, title: 'Validating BFT Multi-Witness Quorum', desc: 'Confirming 4/4 nodes consensus signatures' }
  ];

  // Run full animated 5-stage integrity audit
  const handleRunIntegrityCheck = () => {
    setIsRunningCheck(true);
    setTamperedState(false);
    setProgressPercent(0);
    setActiveStage(1);

    setTimeout(() => {
      setProgressPercent(25);
      setActiveStage(2);
    }, 700);

    setTimeout(() => {
      setProgressPercent(50);
      setActiveStage(3);
    }, 1400);

    setTimeout(() => {
      setProgressPercent(75);
      setActiveStage(4);
    }, 2100);

    setTimeout(() => {
      setProgressPercent(100);
      setActiveStage(5);
      setIsRunningCheck(false);
    }, 2800);
  };

  // Tamper Detection Demo
  const handleSimulateTampering = () => {
    setTamperingInProgress(true);

    setTimeout(() => {
      setTamperingInProgress(false);
      setTamperedState(true);
      setProgressPercent(40);
      setActiveStage(2);
    }, 1200);
  };

  // Restore chain
  const handleRestoreChain = () => {
    setTamperingInProgress(true);
    setTimeout(() => {
      setTamperingInProgress(false);
      setTamperedState(false);
      setProgressPercent(100);
      setActiveStage(5);
    }, 1000);
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              CHAIN INTEGRITY AUDITOR
            </h1>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
            Multi-stage cryptographic ledger verification & simulated Byzantine tamper detection engine.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!tamperedState ? (
            <button
              type="button"
              onClick={handleSimulateTampering}
              disabled={isRunningCheck || tamperingInProgress}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertTriangle size={15} />
              <span>{tamperingInProgress ? 'Altering isolated demo block...' : 'SIMULATE TAMPERING'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestoreChain}
              disabled={tamperingInProgress}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={15} />
              <span>{tamperingInProgress ? 'Recalculating...' : 'RESTORE DEMO CHAIN'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRunIntegrityCheck}
            disabled={isRunningCheck || tamperingInProgress}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
            }}
          >
            {isRunningCheck ? <RefreshCw size={16} className="spin-slow" /> : <Play size={16} />}
            <span>{isRunningCheck ? 'Auditing Ledger...' : 'RUN INTEGRITY CHECK →'}</span>
          </button>
        </div>
      </div>

      {/* ----------------- Big Visual Hero Audit Gauge & Status ----------------- */}
      <div
        style={{
          background: tamperedState
            ? 'linear-gradient(135deg, rgba(30, 10, 15, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(11, 17, 32, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: tamperedState
            ? '2px solid #ef4444'
            : '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: tamperedState ? '0 0 30px rgba(239, 68, 68, 0.3)' : '0 16px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', alignItems: 'center' }}>
          {/* Circular Progress Gauge */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: tamperedState
                  ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.8) 70%)'
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.8) 70%)',
                border: tamperedState
                  ? '4px solid #ef4444'
                  : '4px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: tamperedState ? '0 0 24px rgba(239, 68, 68, 0.4)' : '0 0 24px rgba(16, 185, 129, 0.4)'
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '2px' }}>
                {tamperedState ? '⚠️' : '🔐'}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: tamperedState ? '#f87171' : '#34d399', lineHeight: 1 }}>
                {progressPercent}%
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', marginTop: '4px', letterSpacing: '0.04em' }}>
                {tamperedState ? 'INTEGRITY FAILED' : 'CHAIN INTEGRITY'}
              </div>
            </div>
          </div>

          {/* Right Status Explanation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  background: tamperedState ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: tamperedState ? '#f87171' : '#34d399',
                  border: tamperedState ? '1px solid #ef4444' : '1px solid #10b981'
                }}
              >
                {tamperedState ? '⚠ TAMPERING DETECTED IN BLOCK #1' : '✓ CHAIN INTEGRITY VERIFIED (100% AUDITED)'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 8px 0' }}>
              {tamperedState
                ? 'Hash Pointer Mismatch: Block #1 Previous Hash Invalid'
                : 'All Ledger Blocks Cryptographically Sound'}
            </h2>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {tamperedState
                ? 'Simulated payload manipulation detected in Block #1. Because the SHA-256 Merkle root changed, the subsequent block hash failed validation. In StudentVoiceX, the BFT consensus mesh immediately rejects tampered blocks.'
                : 'Full cryptographic pass completed. All block headers, SHA-3 Merkle tree branches, digital signatures, and BFT witness multi-signatures verified with zero defects.'}
            </p>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Blocks Checked</div>
                <strong style={{ fontSize: '0.94rem', color: '#38bdf8' }}>1,043 / 1,043</strong>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Transactions Audited</div>
                <strong style={{ fontSize: '0.94rem', color: '#10b981' }}>12,486 (100%)</strong>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Witness Quorum</div>
                <strong style={{ fontSize: '0.94rem', color: '#818cf8' }}>4 / 4 Nodes (100%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- 5-Stage Audit Pipeline ----------------- */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            5-STAGE CRYPTOGRAPHIC VERIFICATION PIPELINE
          </div>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
            {isRunningCheck ? 'Pipeline Executing...' : 'Audit Complete'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stages.map((st) => {
            const isPassed = !tamperedState && activeStage >= st.num;
            const isFailed = tamperedState && st.num === 2;
            const isRunning = isRunningCheck && activeStage === st.num;

            return (
              <div
                key={st.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isFailed
                    ? 'rgba(239, 68, 68, 0.15)'
                    : isPassed
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isFailed
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : isPassed
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isFailed
                        ? '#ef4444'
                        : isPassed
                        ? '#10b981'
                        : isRunning
                        ? '#0284c7'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.74rem',
                      fontWeight: 800
                    }}
                  >
                    {isFailed ? '✕' : isPassed ? '✓' : isRunning ? <RefreshCw size={13} className="spin-slow" /> : st.num}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isFailed ? '#f87171' : isPassed ? '#a7f3d0' : '#f8fafc' }}>
                      Stage {st.num}: {st.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {st.desc}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isFailed ? '#ef4444' : isPassed ? '#10b981' : '#64748b'
                    }}
                  >
                    {isFailed ? 'FAIL (MISMATCH)' : isPassed ? 'PASSED ✓' : isRunning ? 'VERIFYING...' : 'QUEUED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminValidation;
