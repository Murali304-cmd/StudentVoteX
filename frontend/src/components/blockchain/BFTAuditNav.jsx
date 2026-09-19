import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Layers, ArrowLeftRight, GitFork, Network, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { BCTConceptsGuide } from './BCTConceptsGuide';

export function BFTAuditNav() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const modules = [
    { path: '/admin/blockchain', label: 'Audit Explorer', icon: Box },
    { path: '/admin/blocks', label: 'Block Ledger & Miner', icon: Layers },
    { path: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/admin/merkle-tree', label: 'SHA-3 Merkle Tree', icon: GitFork },
    { path: '/admin/network', label: 'BFT Multi-Witness Mesh', icon: Network },
    { path: '/admin/validation', label: 'Chain Integrity Auditor', icon: ShieldCheck, highlight: true },
  ];

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '18px',
          padding: '8px 12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(2, 6, 23, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.06em', color: '#f8fafc', textTransform: 'uppercase' }}>
              BFT AUDIT BLOCKCHAIN
            </div>
            <div style={{ fontSize: '0.62rem', color: '#93c5fd', fontWeight: 600 }}>
              StudentVoiceX Permissioned Consensus Network
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.path}
                to={m.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(56, 189, 248, 0.6)'
                    : '1px solid transparent',
                  boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                })}
              >
                <Icon size={14} />
                <span>{m.label}</span>
                {m.highlight && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                )}
              </NavLink>
            );
          })}

          {/* BCT Concepts & Architecture Hub Trigger Button */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(79, 70, 229, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={14} color="#38bdf8" />
            <span>BCT Concepts</span>
          </button>
        </nav>
      </div>

      {/* Global Interactive BCT Concepts Guide Modal */}
      <BCTConceptsGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}

export default BFTAuditNav;

