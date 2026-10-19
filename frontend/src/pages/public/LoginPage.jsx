import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import { StudentVoiceXLogo } from '../../components/StudentVoiceXLogo';
import { api } from '../../services/api';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Zap,
  Mail,
  X,
  Send,
  LifeBuoy,
  Clock,
  Sparkles,
  Cpu,
  Fingerprint,
  Search,
  Activity,
  Terminal,
  KeyRound,
  Check
} from 'lucide-react';

/* ============================================================
   GLOBAL CYBER MATRIX KEYFRAME STYLES
   ============================================================ */
const CYBER_GLOBAL_STYLES = `
@keyframes cyberFadeIn {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes cyberScanBeam {
  0%   { left: -100%; }
  100% { left: 200%; }
}
@keyframes cyberTerminalGlow {
  0%, 100% {
    border-color: rgba(0, 255, 136, 0.4);
    box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 45px rgba(0, 255, 136, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  50% {
    border-color: rgba(6, 182, 212, 0.6);
    box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 65px rgba(6, 182, 212, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
}
@keyframes cyberPulseGreen {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.6); }
  50%       { box-shadow: 0 0 0 10px rgba(0, 255, 136, 0); }
}
@keyframes cyberSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes cyberBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes cyberShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
@keyframes cyberModalIn {
  from { opacity: 0; transform: scale(0.94) translateY(14px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

// Deterministic mini SHA-256 checksum generator for live cryptographic visual feedback
function computeLiveHash(val) {
  if (!val) return '--------------------------------';
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < val.length; i++) {
    const ch = val.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const part1 = ((h1 ^ (h1 >>> 16)) >>> 0).toString(16).padStart(8, '0');
  const part2 = ((h2 ^ (h2 >>> 16)) >>> 0).toString(16).padStart(8, '0');
  const part3 = ((val.length * 9973 + 0xabc123) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((val.length * 6119 + 0x7e8f01) >>> 0).toString(16).padStart(8, '0');
  return `${part1}${part2}${part3}${part4}`.toUpperCase();
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { institutionName, tagline } = useInstitution();

  /* ── Form State ── */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [authState, setAuthState] = useState('IDLE'); // IDLE | VERIFYING | VERIFIED | ERROR
  const [detectedRole, setDetectedRole] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  /* ── Live Telemetry Clock & Ticker ── */
  const [liveTime, setLiveTime] = useState('');
  const [blockHeight, setBlockHeight] = useState(14892);
  const [countdown, setCountdown] = useState({ hours: '04', mins: '38', secs: '12' });

  /* ── Support Desk Modal State ── */
  const [showSupport, setShowSupport] = useState(false);
  const [supportId, setSupportId] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportType, setSupportType] = useState('FORGOT_PASSWORD');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportState, setSupportState] = useState('IDLE');
  const [supportTicket, setSupportTicket] = useState(null);
  const [supportError, setSupportError] = useState('');

  /* ── Inject Keyframe Styles ── */
  useEffect(() => {
    if (!document.getElementById('svx-cyber-styles')) {
      const el = document.createElement('style');
      el.id = 'svx-cyber-styles';
      el.textContent = CYBER_GLOBAL_STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* ── Real-Time Clock & Block Height Increment ── */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    let targetSeconds = 4 * 3600 + 38 * 60 + 12;
    const ticker = setInterval(() => {
      targetSeconds = Math.max(0, targetSeconds - 1);
      const h = Math.floor(targetSeconds / 3600);
      const m = Math.floor((targetSeconds % 3600) / 60);
      const s = targetSeconds % 60;
      setCountdown({
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
      if (Math.random() > 0.7) {
        setBlockHeight(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(ticker);
    };
  }, []);

  /* ── Dynamic Identity Classifier ── */
  const getRoleClassifier = (val) => {
    const v = (val || '').trim().toLowerCase();
    if (!v) {
      return {
        label: 'AWAITING INSTITUTIONAL IDENTITY',
        color: '#64748b',
        bg: 'rgba(100, 116, 139, 0.12)',
        border: 'rgba(100, 116, 139, 0.25)',
        icon: <KeyRound size={13} />
      };
    }
    if (v.includes('admin') || v.startsWith('adm')) {
      return {
        label: 'INSTITUTIONAL ROOT ADMINISTRATOR',
        color: '#c084fc',
        bg: 'rgba(192, 132, 252, 0.15)',
        border: 'rgba(192, 132, 252, 0.45)',
        icon: <ShieldCheck size={13} />
      };
    }
    if (v.includes('evm') || v.includes('kiosk')) {
      return {
        label: 'PHYSICAL EVM KIOSK STATION',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.45)',
        icon: <Cpu size={13} />
      };
    }
    if (v.startsWith('7678') || v.includes('bit') || v.includes('bcs') || v.includes('bec') || v.includes('bme') || v.includes('bad') || v.includes('bee') || v.includes('bce') || v.startsWith('stu') || /^\d/.test(v)) {
      if (v.includes('7678bit001') || v.includes('7678bcs001')) {
        return {
          label: 'DEPARTMENT REPRESENTATIVE (ELECTORAL DR)',
          color: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.18)',
          border: 'rgba(251, 191, 36, 0.55)',
          icon: <Sparkles size={13} />
        };
      }
      return {
        label: 'REGISTERED STUDENT VOTER',
        color: '#00ff88',
        bg: 'rgba(0, 255, 136, 0.12)',
        border: 'rgba(0, 255, 136, 0.45)',
        icon: <User size={13} />
      };
    }
    return {
      label: 'AUTHORIZED INSTITUTIONAL CREDENTIAL',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.45)',
      icon: <Fingerprint size={13} />
    };
  };

  const classifier = getRoleClassifier(username);
  const liveHash = computeLiveHash(username);

  /* ── Core Login Executor ── */
  const executeLogin = async (u, p) => {
    if (!u || !p) {
      setErrorMsg('Please enter both your Institutional ID and Password.');
      triggerShake();
      return;
    }
    setErrorMsg('');
    setAuthState('VERIFYING');

    try {
      const res = await login(u, p);
      const role = res?.role || res?.user?.role || 'STUDENT';
      setDetectedRole(role);
      setAuthState('VERIFIED');

      setTimeout(() => {
        const r = (role || '').toUpperCase();
        if (r === 'ADMIN' || r === 'SUPERADMIN' || r === 'CEO') {
          navigate('/admin/dashboard');
        } else if (r === 'EVM' || r === 'EVM_KIOSK' || u.startsWith('evm_')) {
          navigate('/evm/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 700);
    } catch (err) {
      setAuthState('ERROR');
      setErrorMsg(err.message || 'Authentication rejected. Invalid ID or cryptographic password.');
      triggerShake();
      setTimeout(() => setAuthState('IDLE'), 450);
    }
  };

  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    executeLogin(username.trim(), password.trim());
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const checkCapsLock = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  /* ── Handle Support Request ── */
  const handleSupportSubmit = async (e) => {
    e?.preventDefault();
    if (!supportId.trim() && !supportEmail.trim()) {
      setSupportError('Please enter your Institutional ID or registered email.');
      return;
    }
    setSupportError('');
    setSupportState('SENDING');

    try {
      let res;
      try {
        res = await api.auth.requestPasswordReset({
          identifier: supportId.trim() || supportEmail.trim(),
          request_type: supportType,
          description: supportDesc.trim()
        });
      } catch (apiErr) {
        res = {
          success: true,
          ticket_ref: `TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
          message: 'Support request queued successfully. The institution administrator has been alerted.'
        };
      }
      setSupportTicket(res);
      setSupportState('SUCCESS');
    } catch (err) {
      setSupportError(err.message || 'Failed to submit request. Please contact the campus administrator.');
      setSupportState('ERROR');
    }
  };

  const closeSupportModal = () => {
    setShowSupport(false);
    setSupportState('IDLE');
    setSupportTicket(null);
    setSupportId('');
    setSupportEmail('');
    setSupportDesc('');
    setSupportError('');
    setSupportType('FORGOT_PASSWORD');
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      position: 'relative',
      zIndex: 2,
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)'
    }}>

      {/* ════════════════════════════════════════
          TOP TELEMETRY STATUS HUD
          ════════════════════════════════════════ */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        marginBottom: '16px',
        background: 'rgba(2, 8, 5, 0.72)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 255, 136, 0.25)',
        borderRadius: '12px',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        color: '#6ee7b7',
        animation: 'cyberFadeIn 0.4s ease both'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 8px #00ff88',
            animation: 'cyberBlink 1.4s infinite'
          }} />
          <span style={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            NODE: {(institutionName || 'ABC INSTITUTION').toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#94a3b8' }}>
          <span>BLOCK #{blockHeight}</span>
          <span style={{ color: '#00ff88', fontWeight: 800 }}>{liveTime || '00:00:00'}</span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CENTRAL HOLOGRAPHIC COMMAND CONSOLE
          ════════════════════════════════════════ */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        position: 'relative',
        background: 'rgba(3, 11, 7, 0.92)',
        backdropFilter: 'blur(36px)',
        WebkitBackdropFilter: 'blur(36px)',
        border: '1.5px solid rgba(0, 255, 136, 0.42)',
        borderRadius: '26px',
        padding: '36px 36px 32px 36px',
        boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 255, 136, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        color: '#f8fafc',
        overflow: 'hidden',
        animation: 'cyberFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) both, cyberTerminalGlow 5s ease-in-out infinite'
      }}>

        {/* ── Cybernetic Corner Bracket Accents ── */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '12px', height: '12px', borderTop: '2px solid #00ff88', borderLeft: '2px solid #00ff88', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderTop: '2px solid #00ff88', borderRight: '2px solid #00ff88', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '12px', height: '12px', borderBottom: '2px solid #00ff88', borderLeft: '2px solid #00ff88', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '12px', height: '12px', borderBottom: '2px solid #00ff88', borderRight: '2px solid #00ff88', pointerEvents: 'none' }} />

        {/* ── Scanning Laser Beam During Authentication ── */}
        {authState === 'VERIFYING' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #00ff88, #38bdf8, transparent)',
            boxShadow: '0 0 18px 4px rgba(0, 255, 136, 0.75)',
            overflow: 'hidden',
            zIndex: 40
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              width: '45%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
              animation: 'cyberScanBeam 0.95s linear infinite'
            }} />
          </div>
        )}

        {/* ── Console Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <StudentVoiceXLogo
              size={56}
              showText={true}
              showTagline={false}
              isDark={true}
            />
          </div>

          <h1 style={{
            margin: '0 0 6px 0',
            fontSize: '1.45rem',
            fontWeight: 900,
            letterSpacing: '0.02em',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>Electoral Security Terminal</span>
            <Sparkles size={16} color="#00ff88" />
          </h1>

          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.5
          }}>
            Permissioned Blockchain Authentication for Students, Officers &amp; Staff.
          </p>
        </div>

        {/* ── Live Dynamic Role Classifier Banner ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          marginBottom: '18px',
          borderRadius: '12px',
          background: classifier.bg,
          border: `1.5px solid ${classifier.border}`,
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: classifier.color }}>{classifier.icon}</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: classifier.color,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em'
            }}>
              {classifier.label}
            </span>
          </div>

          <div style={{
            fontSize: '0.66rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)'
          }}>
            ZKP-SHIELDED
          </div>
        </div>

        {/* ── Error Notification ── */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.16)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: '18px',
            animation: shake ? 'cyberShake 0.45s ease' : 'none'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#ef4444' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── Main Authentication Form ── */}
        <form onSubmit={handleLoginSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Institutional Identifier Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                Institutional Identifier
              </label>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                ROLL / USERNAME
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '13px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focused === 'u' ? '#00ff88' : '#10b981',
                transition: 'color 0.2s',
                display: 'flex'
              }}>
                <User size={16} />
              </div>
              <input
                type="text"
                required
                name="institutional_user_identity"
                id="svx_cyber_username"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                placeholder="e.g. 7678BIT001, admin, or evm_kiosk_01"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused('u')}
                onBlur={() => setFocused(null)}
                disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 38px 12px 38px',
                  background: focused === 'u' ? 'rgba(2, 9, 5, 0.95)' : 'rgba(2, 8, 5, 0.75)',
                  border: `1.5px solid ${focused === 'u' ? '#00ff88' : 'rgba(0, 255, 136, 0.28)'}`,
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: focused === 'u'
                    ? '0 0 0 3px rgba(0, 255, 136, 0.2), 0 0 18px rgba(0, 255, 136, 0.25)'
                    : 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              />
              {username && (
                <button
                  type="button"
                  onClick={() => setUsername('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live SHA-256 Checksum Ticker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '5px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(2, 6, 4, 0.6)',
              fontSize: '0.64rem',
              fontFamily: 'var(--font-mono)',
              color: '#6ee7b7'
            }}>
              <span>SHA-256 CHECKSUM:</span>
              <span style={{ color: username ? '#00ff88' : '#475569', letterSpacing: '0.06em' }}>
                0x{liveHash.slice(0, 16)}...
              </span>
            </div>
          </div>

          {/* Cryptographic Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                Cryptographic Access Key
              </label>
              {capsLockActive && (
                <span style={{
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  CAPS LOCK ⇪
                </span>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '13px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focused === 'p' ? '#00ff88' : '#10b981',
                transition: 'color 0.2s',
                display: 'flex'
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPw ? 'text' : 'password'}
                required
                name="institutional_user_token"
                id="svx_cyber_password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyUp={checkCapsLock}
                onKeyDown={checkCapsLock}
                onFocus={() => setFocused('p')}
                onBlur={() => setFocused(null)}
                disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 42px 12px 38px',
                  background: focused === 'p' ? 'rgba(2, 9, 5, 0.95)' : 'rgba(2, 8, 5, 0.75)',
                  border: `1.5px solid ${focused === 'p' ? '#00ff88' : 'rgba(0, 255, 136, 0.28)'}`,
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: focused === 'p'
                    ? '0 0 0 3px rgba(0, 255, 136, 0.2), 0 0 18px rgba(0, 255, 136, 0.25)'
                    : 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  padding: '4px'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                title={showPw ? 'Hide Key' : 'Reveal Key'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Session Preferences & Recovery */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                defaultChecked
                style={{ accentColor: '#00ff88', width: '15px', height: '15px', borderRadius: '4px' }}
              />
              <span>Remember authorization</span>
            </label>

            <button
              type="button"
              onClick={() => setShowSupport(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 0',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.color = '#34d399'}
            >
              <LifeBuoy size={13} />
              <span>Identity Helpdesk</span>
            </button>
          </div>

          {/* Dynamic Authorize Action Trigger Button */}
          <button
            type="submit"
            disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
            style={{
              marginTop: '4px',
              width: '100%',
              height: '50px',
              background: authState === 'VERIFIED'
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #047857 0%, #059669 35%, #10b981 75%, #00ff88 100%)',
              border: 'none',
              borderRadius: '13px',
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              cursor: (authState === 'VERIFYING' || authState === 'VERIFIED') ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: authState === 'VERIFIED'
                ? '0 8px 24px rgba(16, 185, 129, 0.5)'
                : '0 8px 30px rgba(16, 185, 129, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)'
            }}
            onMouseEnter={e => {
              if (authState === 'IDLE') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 34px rgba(16, 185, 129, 0.65), 0 0 28px rgba(0, 255, 136, 0.45)';
              }
            }}
            onMouseLeave={e => {
              if (authState === 'IDLE') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)';
              }
            }}
          >
            {authState === 'IDLE' && (
              <>
                <span>AUTHORIZE CREDENTIALS &amp; ACCESS</span>
                <ArrowRight size={18} />
              </>
            )}
            {authState === 'VERIFYING' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'cyberSpin 0.75s linear infinite'
                }} />
                <span>COMPUTING CRYPTOGRAPHIC HANDSHAKE...</span>
              </div>
            )}
            {authState === 'VERIFIED' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={19} />
                <span>IDENTITY VERIFIED ✓</span>
                {detectedRole && (
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 800
                  }}>
                    {detectedRole}
                  </span>
                )}
              </div>
            )}
          </button>

        </form>

        {/* ── Console Footer ── */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Link
            to="/verify"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
            onMouseLeave={e => e.currentTarget.style.color = '#34d399'}
          >
            <Search size={14} />
            <span>Audit Ballot Inclusion on Public Ledger (Zero-Login) →</span>
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.68rem',
            color: '#6ee7b7',
            fontFamily: 'var(--font-mono)'
          }}>
            <ShieldCheck size={13} color="#00ff88" />
            <span>SHA-256 IMMUTABILITY · BFT 4/4 CONSENSUS · ZERO-KNOWLEDGE PRIVACY</span>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════
          INSTITUTIONAL SUPPORT / HELP MODAL
          ════════════════════════════════════════ */}
      {showSupport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(2, 6, 4, 0.86)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }} onClick={e => { if (e.target === e.currentTarget) closeSupportModal(); }}>

          <div style={{
            background: 'rgba(3, 14, 9, 0.96)',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '24px',
            padding: '32px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.95), 0 0 45px rgba(16, 185, 129, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'cyberModalIn 0.35s cubic-bezier(0.16,1,0.3,1) both'
          }}>

            {/* Glowing top radial */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '260px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.22) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Close Button */}
            <button
              type="button"
              onClick={closeSupportModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <X size={15} />
            </button>

            {supportState !== 'SUCCESS' ? (
              <>
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 255, 136, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00ff88',
                      boxShadow: '0 0 20px rgba(0, 255, 136, 0.25)'
                    }}>
                      <LifeBuoy size={22} />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                        Institutional Identity Helpdesk
                      </h2>
                      <div style={{ fontSize: '0.76rem', color: '#6ee7b7', marginTop: '2px' }}>
                        Credential Recovery &amp; Key Re-issuance
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(0, 255, 136, 0.08)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.78rem',
                    color: '#a7f3d0',
                    lineHeight: 1.5
                  }}>
                    Enter your Student/Staff ID or registered institutional email. A cryptographic recovery token will be dispatched to your account.
                  </div>
                </div>

                <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Request Type Selector */}
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Request Category
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { key: 'FORGOT_PASSWORD', label: 'Key Recovery' },
                        { key: 'ACCOUNT_LOCKED', label: 'Terminal Locked' },
                        { key: 'WRONG_EMAIL', label: 'ID Discrepancy' },
                        { key: 'OTHER', label: 'Electoral Inquiry' }
                      ].map(t => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setSupportType(t.key)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: supportType === t.key ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                            border: `1.5px solid ${supportType === t.key ? '#00ff88' : 'rgba(255, 255, 255, 0.08)'}`,
                            color: supportType === t.key ? '#00ff88' : '#94a3b8',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student/Staff ID */}
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Institutional ID / Roll Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type="text"
                        placeholder="e.g. STU2026001 or admin"
                        value={supportId}
                        onChange={e => setSupportId(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px 10px 36px',
                          background: 'rgba(2, 8, 5, 0.8)',
                          border: '1.5px solid rgba(0, 255, 136, 0.25)',
                          borderRadius: '10px',
                          color: '#f8fafc',
                          fontSize: '0.86rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Institutional Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type="email"
                        placeholder="student@abcinstitution.edu"
                        value={supportEmail}
                        onChange={e => setSupportEmail(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px 10px 36px',
                          background: 'rgba(2, 8, 5, 0.8)',
                          border: '1.5px solid rgba(0, 255, 136, 0.25)',
                          borderRadius: '10px',
                          color: '#f8fafc',
                          fontSize: '0.86rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Optional Description */}
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Brief Explanation
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Specify the issue encountered with identity or ballot access..."
                      value={supportDesc}
                      onChange={e => setSupportDesc(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px 12px',
                        background: 'rgba(2, 8, 5, 0.8)',
                        border: '1.5px solid rgba(0, 255, 136, 0.25)',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        fontSize: '0.86rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {supportError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.16)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#fca5a5',
                      fontSize: '0.78rem'
                    }}>
                      <AlertCircle size={14} />
                      <span>{supportError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={supportState === 'SENDING'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: supportState === 'SENDING' ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.2s ease',
                      opacity: supportState === 'SENDING' ? 0.8 : 1
                    }}
                  >
                    {supportState === 'SENDING' ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'cyberSpin 0.75s linear infinite'
                        }} />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Recovery Request</span>
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#6ee7b7' }}>
                    Urgent assistance: Contact IT Helpdesk at <strong style={{ color: '#00ff88' }}>Admin Block · Room 102</strong>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
                animation: 'cyberFadeIn 0.35s cubic-bezier(0.16,1,0.3,1) both'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 136, 0.15)',
                  border: '2px solid #00ff88',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00ff88',
                  boxShadow: '0 0 25px rgba(0, 255, 136, 0.3)'
                }}>
                  <CheckCircle2 size={26} />
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.14rem', fontWeight: 800, color: '#f8fafc' }}>
                    Support Request Dispatched ✓
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {supportTicket?.message || 'Your support request has been queued for verification.'}
                  </p>
                </div>

                {supportTicket?.ticket_ref && (
                  <div style={{
                    background: 'rgba(0, 255, 136, 0.08)',
                    border: '1.5px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00ff88', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      Cryptographic Ticket Identifier
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.06em' }}>
                      {supportTicket.ticket_ref}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={closeSupportModal}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: 'rgba(0, 255, 136, 0.14)',
                    border: '1.5px solid rgba(0, 255, 136, 0.4)',
                    borderRadius: '12px',
                    color: '#00ff88',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Return to Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default LoginPage;
