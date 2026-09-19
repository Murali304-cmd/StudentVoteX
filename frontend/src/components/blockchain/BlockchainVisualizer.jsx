import React, { useState, useEffect } from 'react';
import { Box, Layers, ShieldCheck, ChevronRight, Sparkles, Activity, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge } from './StatusBadge';
import { HashViewer } from './HashViewer';

export function BlockchainVisualizer({ onSelectBlock, selectedBlockIndex }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHover, setActiveHover] = useState(null);
  const [newBlockNotif, setNewBlockNotif] = useState(false);

  // Fresh Genesis Block default
  const fallbackBlocks = [
    { index: 0, hash: '0000000000000000000000000000000000000000000000000000000000000000', previous_hash: '0', transactions_count: 0, validator: 'GENESIS-NODE', timestamp: new Date().toISOString(), status: 'GENESIS', merkle_root: 'GENESIS-ROOT' }
  ];

  const fetchBlocks = async () => {
    try {
      const data = await api.blockchain.blocks();
      if (Array.isArray(data) && data.length > 0) {
        setBlocks(data);
      } else {
        setBlocks(fallbackBlocks);
      }
    } catch (e) {
      console.warn('Using fresh genesis block:', e);
      setBlocks(fallbackBlocks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '20px',
        padding: '16px 20px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Top Strip Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} className="pulse-dot" />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            LIVE BFT BLOCKCHAIN LEDGER STRIP
          </span>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>• Deterministic Cryptographic Chain</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Activity size={12} color="#38bdf8" />
            <span>Height: <strong>#{blocks[blocks.length - 1]?.index ?? 0}</strong></span>
          </div>

          <button
            type="button"
            onClick={fetchBlocks}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Horizontal Blockchain Chain Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin'
        }}
      >
        {blocks.map((block, idx) => {
          const isSelected = selectedBlockIndex === block.index;
          const isHovered = activeHover === block.index;

          return (
            <React.Fragment key={block.index || idx}>
              {/* Block Glass Card */}
              <div
                onClick={() => onSelectBlock && onSelectBlock(block)}
                onMouseEnter={() => setActiveHover(block.index)}
                onMouseLeave={() => setActiveHover(null)}
                style={{
                  minWidth: '190px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(79, 70, 229, 0.35) 100%)'
                    : isHovered
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
                    : 'rgba(15, 23, 42, 0.75)',
                  border: isSelected
                    ? '1.5px solid #38bdf8'
                    : isHovered
                    ? '1px solid rgba(56, 189, 248, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered || isSelected ? 'translateY(-3px)' : 'none',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.2)'
                    : isHovered
                    ? '0 8px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(56, 189, 248, 0.25)'
                    : '0 4px 12px rgba(0, 0, 0, 0.25)',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Box size={14} color="#38bdf8" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#f8fafc' }}>
                      #{block.index}
                    </span>
                  </div>
                  <StatusBadge status={block.status || 'VERIFIED'} size="xs" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>Transactions:</span>
                  <strong style={{ color: '#38bdf8' }}>{block.transactions_count || block.transactions?.length || 24} TX</strong>
                </div>

                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Hash: <span style={{ color: isHovered ? '#38bdf8' : '#94a3b8' }}>{(block.hash || '0000...').substring(0, 14)}...</span>
                </div>

                {isHovered && (
                  <div style={{ marginTop: '6px', fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700, textAlign: 'right' }}>
                    Inspect Block →
                  </div>
                )}
              </div>

              {/* Connecting Chain Link Line */}
              {idx < blocks.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)',
                    fontSize: '1rem',
                    fontWeight: 900,
                    letterSpacing: '-2px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '2px',
                      background: isHovered
                        ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
                        : 'rgba(56, 189, 248, 0.3)',
                      boxShadow: isHovered ? '0 0 8px #38bdf8' : 'none'
                    }}
                  />
                  <ChevronRight size={14} style={{ marginLeft: '-4px' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default BlockchainVisualizer;
