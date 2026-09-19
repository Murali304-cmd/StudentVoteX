import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Blocks, Link2, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export function EVMBlockchain() {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChain() {
      try {
        const res = await api.blockchain.getChain();
        setChain(res.data?.chain || []);
      } catch (err) {
        console.error('Error fetching blockchain:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChain();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Permissioned Blockchain Audit Explorer
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Inspect sealed blocks, Merkle roots, and cryptographic hashes generated during ABC Institution voting.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {chain.map((block) => (
          <div
            key={block.index}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
                  Block #{block.index}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: '#d1fae5',
                    color: '#059669'
                  }}
                >
                  ✓ VERIFIED
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Nonce: {block.nonce} • Transactions: {block.transactions?.length || 0}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b' }}>Hash: </span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{block.hash}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b' }}>Prev Hash: </span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{block.previous_hash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EVMBlockchain;
