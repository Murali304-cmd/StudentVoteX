import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';

export function HashViewer({ hash, label, prefix = '0x', truncate = true, showShield = true }) {
  const [copied, setCopied] = useState(false);

  if (!hash) return <span className="font-mono text-slate-400">N/A</span>;

  const displayHash = truncate && hash.length > 24
    ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`
    : hash;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      title={`Click to copy: ${hash}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '8px',
        padding: '3px 8px',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.74rem',
        color: '#38bdf8',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      className="hash-viewer-chip"
    >
      {showShield && <ShieldCheck size={12} color="#10b981" />}
      {label && <span style={{ color: '#94a3b8', fontWeight: 600 }}>{label}:</span>}
      <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>{displayHash}</span>
      {copied ? <Check size={12} color="#10b981" /> : <Copy size={11} color="#94a3b8" />}
    </div>
  );
}

export default HashViewer;
