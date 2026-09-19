import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export function StatusBadge({ status, pulse = false, size = 'sm' }) {
  const s = (status || 'VERIFIED').toUpperCase();

  let bg = 'rgba(16, 185, 129, 0.15)';
  let border = 'rgba(16, 185, 129, 0.4)';
  let color = '#34d399';
  let Icon = ShieldCheck;
  let text = 'VERIFIED';

  if (s === 'PENDING') {
    bg = 'rgba(245, 158, 11, 0.15)';
    border = 'rgba(245, 158, 11, 0.4)';
    color = '#fbbf24';
    Icon = Clock;
    text = 'PENDING';
  } else if (s === 'VALIDATING' || s === 'MINING' || s === 'CHECKING') {
    bg = 'rgba(56, 189, 248, 0.15)';
    border = 'rgba(56, 189, 248, 0.4)';
    color = '#38bdf8';
    Icon = RefreshCw;
    text = s;
  } else if (s === 'TAMPERED' || s === 'INVALID' || s === 'FAILED' || s === 'REJECTED') {
    bg = 'rgba(239, 68, 68, 0.2)';
    border = 'rgba(239, 68, 68, 0.5)';
    color = '#f87171';
    Icon = AlertTriangle;
    text = s;
  } else if (s === 'CONFIRMED' || s === 'COMMITTED') {
    bg = 'rgba(99, 102, 241, 0.15)';
    border = 'rgba(99, 102, 241, 0.4)';
    color = '#818cf8';
    Icon = CheckCircle2;
    text = s;
  }

  const padding = size === 'lg' ? '6px 14px' : size === 'md' ? '4px 10px' : '2px 8px';
  const fontSize = size === 'lg' ? '0.84rem' : size === 'md' ? '0.76rem' : '0.68rem';
  const iconSize = size === 'lg' ? 15 : size === 'md' ? 13 : 11;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '999px',
        color,
        fontSize,
        fontWeight: 800,
        letterSpacing: '0.04em',
        boxShadow: pulse ? `0 0 12px ${border}` : 'none',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
    >
      <Icon size={iconSize} className={s === 'VALIDATING' || s === 'MINING' ? 'spin-slow' : ''} />
      <span>{text}</span>
    </span>
  );
}

export default StatusBadge;
