import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, CheckCircle2, Box, Cpu, GitFork, Lock } from 'lucide-react';

export function ActivityStream({ compact = false }) {
  const [events, setEvents] = useState([
    { id: 1, time: 'Live', text: 'Genesis Block #0 verified & sealed on-chain', type: 'block', icon: Box, color: '#38bdf8' },
    { id: 2, time: 'Live', text: 'BFT Multi-witness 4/4 validator nodes synced', type: 'bft', icon: ShieldCheck, color: '#10b981' },
    { id: 3, time: 'Live', text: 'SHA-3-256 Merkle root engine active', type: 'merkle', icon: GitFork, color: '#a855f7' },
    { id: 4, time: 'Live', text: 'EVM Kiosk Enclave ready for incoming ballots', type: 'node', icon: Cpu, color: '#818cf8' }
  ]);

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '16px',
        padding: compact ? '12px 14px' : '16px 20px',
        color: '#ffffff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            REALTIME AUDIT ACTIVITY
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>● LIVE LEDGER</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {events.map((ev) => {
          const Icon = ev.icon;
          return (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 10px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                fontSize: '0.74rem'
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                {ev.time}
              </span>
              <Icon size={13} color={ev.color} />
              <span style={{ color: '#e2e8f0', flex: 1 }}>{ev.text}</span>
              <span style={{ color: '#10b981', fontSize: '0.68rem', fontWeight: 800 }}>✓</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityStream;
