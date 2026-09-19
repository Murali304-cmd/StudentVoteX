import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  KeyRound,
  Building2,
  Lock,
  CheckCircle2,
  Copy,
  Server
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/settings/')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleCopyKey = () => {
    if (settings?.publicKeyPem) {
      navigator.clipboard.writeText(settings.publicKeyPem);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            System Parameters & Cryptography
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Governance settings, cryptographic public keys, and controlled session security parameters.
          </p>
        </div>

        <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Platform Status: Online & Sealed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Institutional Parameters */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            Institutional Configuration
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Institution Name:</span>
              <strong style={{ color: 'var(--text-primary)' }}>ABC Institution</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>System Version:</span>
              <strong>VoteChain v2.4-Production</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Consensus Protocol:</span>
              <strong>Proof of Work + BFT Consensus</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Controlled Mode:</span>
              <span className="badge badge-emerald">Enforced (Fullscreen + Cam)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registration Mode:</span>
              <span className="badge badge-rose">Admin Provisioning Only</span>
            </div>

            {/* Voting Hours Schedule Control */}
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: '#166534', fontSize: '0.85rem' }}>Student Voting Schedule:</strong>
                <span className={settings?.votingHoursEnforced ? "badge badge-emerald" : "badge badge-amber"}>
                  {settings?.votingHoursEnforced ? "Enforced (Strict 9am-12pm)" : "Admin Override Active"}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#14532d', lineHeight: 1.5 }}>
                Window: <strong>{settings?.dailyStartTime || '09:00'} AM – {settings?.dailyEndTime || '12:00'} PM</strong> (Election Day)<br />
                Status: <em>{settings?.votingWindowMessage}</em>
              </div>
              <button
                type="button"
                onClick={() => {
                  fetch('http://127.0.0.1:8000/api/settings/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ voting_hours_enforced: !settings?.votingHoursEnforced })
                  })
                    .then(res => res.json())
                    .then(data => setSettings(data));
                }}
                className="btn btn-secondary"
                style={{ marginTop: '10px', width: '100%', fontSize: '0.76rem', padding: '6px' }}
              >
                {settings?.votingHoursEnforced ? '⚡ Switch to Demo Bypass Mode (Disable 9am-12pm restriction)' : '🔒 Re-enable Strict 9am-12pm Restriction'}
              </button>
            </div>
          </div>
        </div>

        {/* Cryptographic RSA Public Key */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Authority Public Key (RSA-2048)
            </h2>
            <button
              onClick={handleCopyKey}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Copy size={13} />
              <span>{copied ? 'Copied!' : 'Copy PEM'}</span>
            </button>
          </div>

          <div style={{
            background: '#0f172a',
            color: '#38bdf8',
            padding: '14px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            lineHeight: 1.4,
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {settings?.publicKeyPem || '-----BEGIN PUBLIC KEY-----\nLoading institutional authority key...\n-----END PUBLIC KEY-----'}
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            Private keys are stored strictly in server-side cryptographic hardware and never transmitted.
          </div>
        </div>
      </div>
    </div>
  );
}
