import React, { useState, useEffect, useRef } from 'react';
import { Blocks, Link2, CheckCircle, ShieldCheck, Sparkles, Cpu, Hash } from 'lucide-react';

/**
 * BlockchainLedgerStream - Live Interactive Cryptographic Block Ribbon
 * Visualizes live chained blocks with cryptographic hashes, Merkle roots, and consensus confirmation.
 */
export function BlockchainLedgerStream({ latestBlockNumber = 1048, isMining = false }) {
  const [blocks, setBlocks] = useState([
    {
      id: `block-${latestBlockNumber - 2}`,
      number: latestBlockNumber - 2,
      hash: '0x3f8a9b2c...7d1e',
      prevHash: '0x1a2b3c4d...9e8f',
      txCount: 4,
      validator: 'CS-DEPT-NODE',
      timestamp: '12s ago',
      status: 'CONFIRMED'
    },
    {
      id: `block-${latestBlockNumber - 1}`,
      number: latestBlockNumber - 1,
      hash: '0x8b4c2e1a...4f9a',
      prevHash: '0x3f8a9b2c...7d1e',
      txCount: 6,
      validator: 'ELEC-COMM-NODE',
      timestamp: '4s ago',
      status: 'CONFIRMED'
    },
    {
      id: `block-${latestBlockNumber}`,
      number: latestBlockNumber,
      hash: '0x9e7f1d4a...6b2c',
      prevHash: '0x8b4c2e1a...4f9a',
      txCount: 3,
      validator: 'SENATE-VAL-01',
      timestamp: 'Just now',
      status: 'SEALED'
    }
  ]);

  const prevBlockRef = useRef(latestBlockNumber);

  // When latestBlockNumber increments, append new block smoothly
  useEffect(() => {
    if (latestBlockNumber <= prevBlockRef.current) return;
    prevBlockRef.current = latestBlockNumber;

    const randomHash = () =>
      '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    const validators = ['CS-DEPT-NODE', 'ELEC-COMM-NODE', 'SENATE-VAL-01', 'DEAN-EXEC-02', 'EVM-KIOSK-NODE'];
    const randomVal = validators[Math.floor(Math.random() * validators.length)];

    setBlocks((prev) => {
      const prevBlock = prev[prev.length - 1];
      const newBlock = {
        id: `block-${latestBlockNumber}-${Date.now()}`,
        number: latestBlockNumber,
        hash: randomHash(),
        prevHash: prevBlock ? prevBlock.hash.substring(0, 10) + '...' : '0x0000...0000',
        txCount: Math.floor(Math.random() * 5) + 2,
        validator: randomVal,
        timestamp: 'Just now',
        status: 'SEALED'
      };
      return [...prev.slice(1), newBlock];
    });
  }, [latestBlockNumber]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      {/* Ribbon Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '0 2px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Blocks size={12} color="#0284c7" />
          <span style={{ color: '#0f172a', fontWeight: 800 }}>Live Blockchain Ledger</span>
          <span style={{ color: '#059669', fontSize: '0.65rem' }}>● Immutable</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '0.66rem' }}>
          <Cpu size={11} className={isMining ? 'spin' : ''} />
          <span>{isMining ? 'Mining Block...' : 'Consensus Active'}</span>
        </div>
      </div>

      {/* Linked Chained Blocks Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        {blocks.map((block, idx) => {
          const isLatest = idx === blocks.length - 1;
          return (
            <React.Fragment key={block.id}>
              {/* Block Card */}
              <div
                style={{
                  flex: 1,
                  background: isLatest ? 'rgba(240, 249, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
                  border: isLatest ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '7px 10px',
                  boxShadow: isLatest
                    ? '0 4px 12px rgba(2, 132, 199, 0.15)'
                    : '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 0.3s ease',
                  minWidth: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      color: isLatest ? '#0284c7' : '#0f172a'
                    }}
                  >
                    #{block.number}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '8px',
                      background: '#d1fae5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <CheckCircle size={9} />
                    {block.txCount} tx
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.64rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={block.hash}
                >
                  {block.hash}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.58rem',
                    color: '#94a3b8',
                    marginTop: '2px'
                  }}
                >
                  <span>{block.validator.split('-')[0]}</span>
                  <span>{block.timestamp}</span>
                </div>
              </div>

              {/* Cryptographic Chain Link Icon between blocks */}
              {idx < blocks.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#0284c7',
                    opacity: 0.7,
                    flexShrink: 0
                  }}
                >
                  <Link2 size={13} strokeWidth={2.5} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default BlockchainLedgerStream;
