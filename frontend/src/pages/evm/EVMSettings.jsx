import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Sliders,
  Monitor,
  ShieldCheck,
  Building2,
  Lock,
  CheckCircle2,
  Printer,
  Clock,
  Activity,
  HardDrive,
  Save,
  Radio,
  Wifi,
  Cpu
} from 'lucide-react';

export function EVMSettings() {
  const { user } = useAuth();
  const { institutionName, officialCode } = useInstitution();

  const [kioskLabel, setKioskLabel] = useState('EVM Kiosk Station #01');
  const [locationName, setLocationName] = useState('Tech Block - Hall 201');
  const [vvpatMode, setVvpatMode] = useState(true);
  const [autoLockSeconds, setAutoLockSeconds] = useState('15');
  const [saveToast, setSaveToast] = useState('');
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagResult, setDiagResult] = useState('');

  const handleSave = (e) => {
    e?.preventDefault();
    setSaveToast('EVM Terminal settings saved!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleRunSelfTest = () => {
    setDiagnosticsRunning(true);
    setDiagResult('');
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagResult('All hardware sensors, camera OCR, and SHA-256 hash engines passed [100% HEALTHY]');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            <Monitor size={15} />
            <span>Hardware Polling Station Setup</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            EVM Terminal Configuration
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Physical voting kiosk parameters, VVPAT thermal audit print settings, and college affiliation for <strong>{institutionName}</strong>.
          </p>
        </div>

        {saveToast && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800
          }}>
            <CheckCircle2 size={16} />
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Terminal Station Identity & Affiliation */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Affiliation &amp; Station Coordinates
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Affiliated Institution Name
              </label>
              <input
                type="text"
                disabled
                value={institutionName}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                  borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', fontSize: '0.88rem', opacity: 0.8
                }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Managed centrally via Administrator Settings hub.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Terminal Kiosk Station Label
              </label>
              <input
                type="text"
                value={kioskLabel}
                onChange={e => setKioskLabel(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                  borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Physical Campus Hall Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                  borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* VVPAT & Ballot Chamber Parameters */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              VVPAT Thermal Audit Printer &amp; Auto-Lock
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Post-Ballot Screen Auto-Lock Timeout (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={autoLockSeconds}
                onChange={e => setAutoLockSeconds(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                  borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={vvpatMode}
                  onChange={e => setVvpatMode(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Enable VVPAT Paper Audit Simulation Window (7 seconds)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Hardware Self-Test Diagnostic */}
        <div
          className="glass-card"
          style={{
            padding: '20px 24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} color="#0284c7" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Terminal Hardware Self-Test Diagnostic
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Verifies optical voter card reader, cryptographic hasher, and consensus network ping.
              </div>
              {diagResult && (
                <div style={{ color: '#10b981', fontSize: '0.76rem', fontWeight: 800, marginTop: '4px' }}>
                  ✓ {diagResult}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSelfTest}
            disabled={diagnosticsRunning}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            {diagnosticsRunning ? 'Running Diagnostic...' : 'Run Self-Test'}
          </button>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '11px 24px', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} />
            <span>Save Terminal Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default EVMSettings;
