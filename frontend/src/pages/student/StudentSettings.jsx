import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sliders,
  ShieldCheck,
  Building2,
  Bell,
  Lock,
  User,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Mail,
  Palette,
  FileDown,
  Clock,
  Eye,
  Key,
  Save,
  Check
} from 'lucide-react';

export function StudentSettings() {
  const { user } = useAuth();
  const { institutionName, officialCode, electoralBoard, contactEmail } = useInstitution();
  const { theme, toggleTheme, bgMode, setBgMode } = useTheme();

  // Student Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [zkProofMode, setZkProofMode] = useState(true);
  const [biometricAuditTelemetry, setBiometricAuditTelemetry] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  const handleSavePreferences = (e) => {
    e?.preventDefault();
    setSaveToast('Preferences saved successfully!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleExportVoterCredentials = () => {
    const data = {
      institution: institutionName,
      official_code: officialCode,
      student_id: user?.student_id || 'STU2026001',
      roll_number: user?.roll_number || '2026IT001',
      full_name: user?.full_name || 'Muralidharan K',
      department: user?.department || 'Information Technology',
      section: user?.section || 'A',
      zk_proof_enabled: zkProofMode,
      exported_at: new Date().toISOString(),
      electoral_board: electoralBoard
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Voter_Credential_${user?.student_id || 'STU2026001'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sliders size={15} />
            <span>Voter Portal Configuration</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Student Preferences &amp; Security
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Manage your personal cryptographic voting preferences, notifications, and active collegiate profile for <strong>{institutionName}</strong>.
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

      {/* ── Active Institutional Affiliation Card ── */}
      <div
        className="glass-card"
        style={{
          padding: '22px 26px',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Current Enrolled Institution
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
              {institutionName}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Electoral Code: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{officialCode}</span> &middot; Support: <span style={{ color: '#38bdf8' }}>{contactEmail}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportVoterCredentials}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', padding: '9px 16px' }}
        >
          <FileDown size={15} />
          <span>Export Voter Credential (.JSON)</span>
        </button>
      </div>

      {/* 2-Column Settings Form */}
      <form onSubmit={handleSavePreferences} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Column 1: Privacy & Blockchain Ledger Telemetry */}
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
            <ShieldCheck size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Ballot Privacy &amp; Cryptography
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={zkProofMode}
                onChange={e => setZkProofMode(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#0284c7', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Zero-Knowledge Proof Chain (ZK-SNARK)
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Cryptographically strips all student ID linkages from ballots before consensus broadcasting.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={biometricAuditTelemetry}
                onChange={e => setBiometricAuditTelemetry(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#0284c7', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Enhanced Biometric Audit Telemetry
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Share anonymized face angle liveness confidence scores with the Election Commission audit logs.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Column 2: Civic Notifications */}
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
            <Bell size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Notifications &amp; Voter Alerts
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#f59e0b', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Email Ballot Confirmation Receipt
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Dispatches cryptographic Merkle proof hash directly to your registered campus email upon casting.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={e => setWhatsappAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#22c55e', marginTop: '2px' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Section Turnout &amp; Candidate AMA Updates
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Receive live alerts for your section straw polls and candidate Q&amp;A replies.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Column 3: Visual Theme & Ambiance */}
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
            <Palette size={20} color="#818cf8" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Portal Ambiance &amp; Canvas Mode
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { id: 'cyber', label: 'Cyber Grid', desc: 'BFT Pipeline' },
              { id: 'aurora', label: 'Aurora Waves', desc: 'Fluid Neon' },
              { id: 'matrix', label: 'Matrix Nodes', desc: 'Crypto 3D' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setBgMode(m.id)}
                style={{
                  padding: '10px 8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: bgMode === m.id ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                  background: bgMode === m.id ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-card)',
                  color: bgMode === m.id ? '#0284c7' : 'var(--text-muted)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{m.label}</div>
                <div style={{ fontSize: '0.68rem', marginTop: '2px' }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 4: Session Security */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Session Security
            </h3>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            To safeguard collegiate elections, voting sessions automatically terminate after <strong>5 minutes of inactivity</strong> (with warning at 4:30).
          </div>

          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#38bdf8'
          }}>
            ✓ Session Guard Active &middot; Cryptographic Hardware Cookie Bound
          </div>
        </div>

        {/* Submit */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '11px 24px', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default StudentSettings;
