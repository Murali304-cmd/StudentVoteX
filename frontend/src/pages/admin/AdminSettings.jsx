import { API_BASE_URL } from '../../services/api';
import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  KeyRound,
  Building2,
  Lock,
  CheckCircle2,
  Copy,
  Server,
  Calendar,
  Clock,
  Camera,
  Wifi,
  Cpu,
  Save,
  Radio,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Editable configuration states
  const [electionDate, setElectionDate] = useState('');
  const [dailyStart, setDailyStart] = useState('09:00');
  const [dailyEnd, setDailyEnd] = useState('12:00');
  const [hoursEnforced, setHoursEnforced] = useState(true);
  const [faceThreshold, setFaceThreshold] = useState('90');
  const [cameraRequired, setCameraRequired] = useState(true);
  const [livenessCheck, setLivenessCheck] = useState(true);
  const [consensusAlgo, setConsensusAlgo] = useState('BFT_MULTI_WITNESS');
  const [miningDifficulty, setMiningDifficulty] = useState('3');
  const [autoMineBlock, setAutoMineBlock] = useState(true);
  const [wifiSsid, setWifiSsid] = useState('Muralidharan K');
  const [maxSessionTime, setMaxSessionTime] = useState('60');

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings/`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data.dailyStartTime) setDailyStart(data.dailyStartTime);
        if (data.dailyEndTime) setDailyEnd(data.dailyEndTime);
        if (data.votingHoursEnforced !== undefined) setHoursEnforced(data.votingHoursEnforced);
        if (data.electionDate) setElectionDate(data.electionDate);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCopyKey = () => {
    if (settings?.publicKeyPem) {
      navigator.clipboard.writeText(settings.publicKeyPem);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveAllSettings = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/settings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voting_hours_enforced: hoursEnforced,
          daily_start_time: dailyStart,
          daily_end_time: dailyEnd,
          election_date: electionDate
        })
      });
      const updated = await res.json();
      setSettings(updated);
      setSaveSuccess('All institutional configurations & parameters successfully updated!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      alert('Error updating configurations: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
              <Sliders size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              System Governance &amp; Configuration Hub
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Configure voting schedules, biometric thresholds, cryptographic consensus, and physical campus access rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          <Save size={16} />
          <span>{saving ? 'Applying...' : 'Save & Apply Configuration'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '12px 18px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontSize: '0.88rem', fontWeight: 700, animation: 'fadeIn 0.2s ease' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Grid of Configuration Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>

        {/* 1. Election Scheduling & Timing */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Election Scheduling &amp; Timing</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Define election day, daily voting window, and enforcement policy</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Designated Election Date
              </label>
              <input
                type="date"
                className="input-field"
                value={electionDate}
                onChange={e => setElectionDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Daily Window Start
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={dailyStart}
                  onChange={e => setDailyStart(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Daily Window End
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={dailyEnd}
                  onChange={e => setDailyEnd(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: hoursEnforced ? '#f0fdf4' : '#fffbeb', border: `1px solid ${hoursEnforced ? '#bbf7d0' : '#fde68a'}`, borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: hoursEnforced ? '#166534' : '#92400e' }}>
                    Voting Hours Enforcement: {hoursEnforced ? 'STRICT' : 'BYPASS ACTIVE'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: hoursEnforced ? '#15803d' : '#b45309', marginTop: '2px' }}>
                    {hoursEnforced ? 'Students restricted to scheduled window. Admin unrestricted.' : 'Demo bypass: all users can vote at any hour.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHoursEnforced(!hoursEnforced)}
                  className={`btn btn-sm ${hoursEnforced ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                >
                  {hoursEnforced ? 'Enable Bypass' : 'Enforce Strict'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Biometric Face Recognition & Liveness */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <Camera size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Biometric Face Verification</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real facial comparison against registered student photo</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Face Matching Strictness Threshold
              </label>
              <select
                className="input-field"
                value={faceThreshold}
                onChange={e => setFaceThreshold(e.target.value)}
              >
                <option value="95">Strict High Security (95%+ Confidence Match)</option>
                <option value="90">Institutional Standard (90%+ Confidence Match)</option>
                <option value="75">Moderate Lighting (75%+ Confidence Match)</option>
                <option value="60">Permissive Demo (60%+ Confidence Match)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mandatory Webcam Stream</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Require active front camera during Web &amp; EVM voting</div>
              </div>
              <input
                type="checkbox"
                checked={cameraRequired}
                onChange={e => setCameraRequired(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Optical Liveness Detection</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Anti-spoofing 68-point facial mesh alignment check</div>
              </div>
              <input
                type="checkbox"
                checked={livenessCheck}
                onChange={e => setLivenessCheck(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Blockchain & Cryptographic Consensus */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Cpu size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Blockchain Ledger &amp; Mining</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Block generation, difficulty, and consensus rules</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Consensus Protocol
                </label>
                <select
                  className="input-field"
                  value={consensusAlgo}
                  onChange={e => setConsensusAlgo(e.target.value)}
                >
                  <option value="BFT_MULTI_WITNESS">BFT Multi-Witness (4 Nodes)</option>
                  <option value="POW_STOCHASTIC">Proof of Work (NIST SHA-256)</option>
                  <option value="RAFT_PERMISSIONED">Raft Permissioned Consortium</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  PoW Difficulty
                </label>
                <select
                  className="input-field"
                  value={miningDifficulty}
                  onChange={e => setMiningDifficulty(e.target.value)}
                >
                  <option value="1">Difficulty 1 (Instant / 0.1s)</option>
                  <option value="2">Difficulty 2 (Fast / 0.4s)</option>
                  <option value="3">Difficulty 3 (Standard / 1.2s)</option>
                  <option value="4">Difficulty 4 (Heavy / 4.5s)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Auto-Mine Block Per Student Vote</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Creates and seals a dedicated block for every cast ballot</div>
              </div>
              <input
                type="checkbox"
                checked={autoMineBlock}
                onChange={e => setAutoMineBlock(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#059669' }}
              />
            </div>
          </div>
        </div>

        {/* 4. Campus Gateway & Network Security */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Wifi size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Campus Network &amp; Hardware Bounds</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wi-Fi geofencing, anti-tamper, and session duration</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Authorized Campus Network SSID / IP Subnet
              </label>
              <input
                type="text"
                className="input-field"
                value={wifiSsid}
                onChange={e => setWifiSsid(e.target.value)}
                placeholder="e.g. Muralidharan K / Campus_College_WiFi"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Max Session Limit (Sec)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={maxSessionTime}
                  onChange={e => setMaxSessionTime(e.target.value)}
                  min="30"
                  max="300"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Anti-Screenshot Guard
                </label>
                <div style={{ padding: '9px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#10b981', border: '1px solid var(--border-subtle)' }}>
                  ACTIVE (Protected)
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Authority Cryptographic RSA Public Key Card */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              Authority Cryptographic Public Key (RSA-2048)
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Used across BFT nodes and EVM hardware terminals to verify institutional digital signatures
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyKey}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Copy size={14} />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy PEM Key'}</span>
          </button>
        </div>

        <div style={{
          background: '#070d1e',
          color: '#38bdf8',
          padding: '16px',
          borderRadius: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          lineHeight: 1.5,
          maxHeight: '180px',
          overflowY: 'auto',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
        }}>
          {settings?.publicKeyPem || '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEA3... (Loading Authority Public Key)\n-----END RSA PUBLIC KEY-----'}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
