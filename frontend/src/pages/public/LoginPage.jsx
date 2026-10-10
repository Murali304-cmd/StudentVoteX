import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Radio,
  Mail,
  X,
  Send,
  LifeBuoy,
  Ticket,
  ChevronRight,
  Clock,
  Calendar,
  Building2,
  GraduationCap,
  Monitor,
  Loader2,
  Crown
} from 'lucide-react';

/* ============================================================
   KEYFRAMES – injected once as a style tag
   ============================================================ */
const GLOBAL_STYLES = `
@keyframes loginFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes loginSlideRight {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes loginPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.45); }
  50%       { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
}
@keyframes loginScan {
  0%   { left: -100%; }
  100% { left: 200%; }
}
@keyframes loginSpinCCW {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes loginOrbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes loginBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes loginShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
@keyframes loginModalIn {
  from { opacity: 0; transform: scale(0.94) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes loginTicketIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes loginGridMove {
  0%   { transform: translateY(0); }
  100% { transform: translateY(60px); }
}
@keyframes loginParticleFloat {
  0%   { transform: translateY(0px) translateX(0px); opacity: 0.6; }
  33%  { transform: translateY(-18px) translateX(8px); opacity: 1; }
  66%  { transform: translateY(-10px) translateX(-6px); opacity: 0.8; }
  100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
}
`;

const FEATURE_CARDS = [
  {
    icon: <ShieldCheck size={20} />,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.25)',
    title: 'BFT Consensus & Immutability',
    subtitle: 'Cryptographically sealed ballots across independent validator nodes'
  },
  {
    icon: <Layers size={20} />,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
    border: 'rgba(167, 139, 250, 0.25)',
    title: 'Merkle Tree Receipt Verification',
    subtitle: 'Students verify their inclusion in the ledger without exposing their vote'
  },
  {
    icon: <Zap size={20} />,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.25)',
    title: 'Zero-Knowledge Identity Privacy',
    subtitle: 'Ballot anonymisation with ZK-SNARK proof chains — vote without revealing identity'
  }
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ── Auth State ─────────────────────────────────── */
  const [activePortal, setActivePortal] = useState('STUDENT'); // STUDENT | CEO | ADMIN | EVM
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [authState, setAuthState] = useState('IDLE'); // IDLE | VERIFYING | VERIFIED | ERROR
  const [detectedRole, setDetectedRole] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [electionSchedule, setElectionSchedule] = useState(null);

  /* ── Support Modal State ────────────────────────── */
  const [showSupport, setShowSupport] = useState(false);
  const [supportId, setSupportId] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportType, setSupportType] = useState('FORGOT_PASSWORD');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportState, setSupportState] = useState('IDLE'); // IDLE | SENDING | SUCCESS | ERROR
  const [supportTicket, setSupportTicket] = useState(null);
  const [supportError, setSupportError] = useState('');

  /* ── Inject global keyframes & load active schedule ── */
  useEffect(() => {
    if (!document.getElementById('svx-login-styles')) {
      const el = document.createElement('style');
      el.id = 'svx-login-styles';
      el.textContent = GLOBAL_STYLES;
      document.head.appendChild(el);
    }

    async function loadSchedule() {
      try {
        const list = await api.elections.list();
        if (Array.isArray(list) && list.length > 0) {
          const active = list.find(e => e.status === 'ACTIVE') || list[0];
          setElectionSchedule(active);
        }
      } catch (e) {
        // Fallback default
      }
    }
    loadSchedule();
  }, []);

  /* ── Role preview from typing ───────────────────── */
  const getRolePreview = (val) => {
    const v = val.trim().toLowerCase();
    if (!v) return null;
    if (v.includes('ceo'))
      return { label: 'Chief Election Officer', color: '#f59e0b' };
    if (v.includes('admin') || v.startsWith('adm'))
      return { label: 'System Admin', color: '#a78bfa' };
    if (v.includes('evm') || v.includes('kiosk'))
      return { label: 'EVM Terminal', color: '#34d399' };
    if (v.startsWith('stu') || /^\d/.test(v))
      return { label: 'Student Voter', color: '#38bdf8' };
    return { label: 'Authorized User', color: '#fb923c' };
  };
  const rolePreview = getRolePreview(username);

  const selectPortal = (portal) => {
    setActivePortal(portal);
    setErrorMsg('');
    if (portal === 'CEO') {
      setUsername('ceo_central');
      setPassword('CEO@ABC2026');
    } else if (portal === 'ADMIN') {
      setUsername('admin');
      setPassword('Admin@ABC2026');
    } else if (portal === 'EVM') {
      setUsername('evm_kiosk_01');
      setPassword('EVM@ABC2026');
    } else {
      setUsername('STU2026001');
      setPassword('Student@123');
    }
  };

  /* ── Handle Login ───────────────────────────────── */
  const handleLogin = async (e) => {
    e?.preventDefault();
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) {
      setErrorMsg('Please enter both your ID and password.');
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
        const r = role.toUpperCase();
        if (r === 'ADMIN' || r === 'SUPERADMIN') navigate('/admin/dashboard');
        else if (r === 'CEO') navigate('/ceo/dashboard');
        else if (r === 'EVM' || r === 'EVM_KIOSK' || u.startsWith('evm_')) navigate('/evm/dashboard');
        else navigate('/student/dashboard');
      }, 800);
    } catch (err) {
      setAuthState('ERROR');
      setErrorMsg(err.message || 'Invalid credentials. Please check your ID and password.');
      triggerShake();
      setTimeout(() => setAuthState('IDLE'), 300);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  /* ── Handle Support Request ─────────────────────── */
  const handleSupportSubmit = async (e) => {
    e?.preventDefault();
    if (!supportId.trim() && !supportEmail.trim()) {
      setSupportError('Please enter your Student/Admin ID or registered email.');
      return;
    }
    setSupportError('');
    setSupportState('SENDING');
    try {
      const res = await api.auth.supportRequest({
        user_id: supportId.trim(),
        email: supportEmail.trim(),
        request_type: supportType,
        description: supportDesc.trim()
      });
      setSupportTicket(res);
      setSupportState('SUCCESS');
    } catch (err) {
      setSupportError(err.message || 'Request failed. Please contact the IT helpdesk directly.');
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

  /* ── Render ─────────────────────────────────────── */
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      position: 'relative',
      zIndex: 1,
      userSelect: 'none',
      boxSizing: 'border-box'
    }}>

      {/* ── Animated Background Grid ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        {/* Moving grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'loginGridMove 8s linear infinite'
        }} />
        {/* Radial glow top-left */}
        <div style={{
          position: 'absolute', top: '-200px', left: '-200px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        {/* Radial glow bottom-right */}
        <div style={{
          position: 'absolute', bottom: '-200px', right: '-200px',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${4 + i * 2}px`, height: `${4 + i * 2}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? 'rgba(56,189,248,0.5)' : 'rgba(167,139,250,0.5)',
            top: `${10 + i * 14}%`, left: `${5 + i * 15}%`,
            animation: `loginParticleFloat ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`
          }} />
        ))}
      </div>

      {/* ── 2-Column Layout ── */}
      <div style={{
        width: '100%', maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '52px',
        alignItems: 'center',
        position: 'relative', zIndex: 2,
        animation: 'loginFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both'
      }}>

        {/* ════════════════════════════════════════
            LEFT HERO PANEL
            ════════════════════════════════════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '28px',
          animation: 'loginSlideRight 0.6s cubic-bezier(0.16,1,0.3,1) both'
        }}>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.3)',
            borderRadius: '999px', padding: '6px 16px', width: 'fit-content',
            animation: 'loginPulse 2.5s ease-in-out infinite'
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#38bdf8', boxShadow: '0 0 10px #38bdf8'
            }} />
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8',
              letterSpacing: '0.06em', fontFamily: 'monospace'
            }}>
              ABC INSTITUTION · DEMOCRATIC BLOCKCHAIN GATEWAY
            </span>
          </div>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <StudentVoiceXLogo size={60} showText showTagline taglineText="Your Voice Shapes Tomorrow." isDark />
          </div>

          {/* Headline */}
          <div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 900, color: '#f1f5f9',
              lineHeight: 1.15, letterSpacing: '-0.03em',
              margin: '0 0 14px 0',
              textShadow: '0 2px 24px rgba(0,0,0,0.55)'
            }}>
              Decentralized Campus<br />
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Democratic Voting</span>
            </h1>
            <p style={{
              fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.65, margin: 0
            }}>
              Empowering transparent, verifiable, and cryptographic student elections with Byzantine Fault Tolerant consensus and zero-knowledge privacy.
            </p>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FEATURE_CARDS.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'rgba(15,23,42,0.7)',
                border: `1px solid ${f.border}`,
                borderRadius: '16px', padding: '14px 18px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 6px 28px rgba(0,0,0,0.4), 0 0 14px ${f.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: f.bg, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, boxShadow: `0 0 16px ${f.bg}`
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>{f.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live telemetry footer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            fontSize: '0.75rem', color: '#475569',
            fontFamily: 'monospace', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#10b981', boxShadow: '0 0 10px #10b981',
                animation: 'loginBlink 1.8s ease-in-out infinite'
              }} />
              <span style={{ color: '#34d399', fontWeight: 700 }}>GENESIS BLOCK VERIFIED</span>
            </div>
            <span>·</span>
            <span>SHA-256 SECURED</span>
            <span>·</span>
            <span>BFT 4/4 NODES</span>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT LOGIN CARD
            ════════════════════════════════════════ */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(28px)',
          border: '1.5px solid rgba(226,232,240,0.9)',
          borderRadius: '28px',
          padding: '38px 36px',
          boxShadow: '0 32px 64px -16px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset',
          color: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
          animation: 'loginFadeUp 0.65s 0.1s cubic-bezier(0.16,1,0.3,1) both'
        }}>

          {/* Scanning beam while verifying */}
          {authState === 'VERIFYING' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'linear-gradient(90deg, transparent, #0284c7, #818cf8, transparent)',
              boxShadow: '0 0 16px 4px rgba(2,132,199,0.5)',
              overflow: 'hidden', zIndex: 20
            }}>
              <div style={{
                position: 'absolute', top: 0, width: '50%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                animation: 'loginScan 1.2s linear infinite'
              }} />
            </div>
          )}

          {/* Top corner accent dots */}
          <div style={{ position: 'absolute', top: '14px', left: '16px', display: 'flex', gap: '6px' }}>
            {['#f87171', '#fbbf24', '#34d399'].map((c, i) => (
              <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>

          {/* Card header */}
          <div style={{ marginBottom: '22px', textAlign: 'left', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Sign In to StudentVoiceX 👋
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '999px', padding: '3px 10px',
                fontSize: '0.68rem', fontWeight: 800,
                color: '#16a34a'
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 5px #22c55e',
                  animation: 'loginBlink 1.5s infinite'
                }} />
                SYSTEM LIVE
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Single unified access point for Students, Chief Election Officers, EVM Stations &amp; Administrators.
            </p>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div style={{
              background: '#fff1f2', border: '1px solid #fecdd3',
              borderRadius: '12px', padding: '11px 14px',
              display: 'flex', alignItems: 'center', gap: '9px',
              color: '#be123c', fontSize: '0.82rem', marginBottom: '18px',
              animation: shake ? 'loginShake 0.45s ease' : 'none'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Single Unified Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Username / Institutional ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Institutional ID / Roll Number / Username
                </label>
                {rolePreview && (
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 800,
                    color: rolePreview.color,
                    background: `${rolePreview.color}18`,
                    padding: '2px 9px', borderRadius: '999px',
                    border: `1px solid ${rolePreview.color}40`
                  }}>
                    {rolePreview.label}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'u' ? '#0284c7' : '#94a3b8',
                  transition: 'color 0.2s', display: 'flex'
                }}>
                  <User size={17} />
                </div>
                <input
                  type="text" required autoComplete="username"
                  placeholder="Enter Student ID (e.g. STU2026001), Admin, CEO, or EVM ID"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused('u')}
                  onBlur={() => setFocused(null)}
                  disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '13px 14px 13px 42px',
                    background: focused === 'u' ? '#f8faff' : '#ffffff',
                    border: `1.5px solid ${focused === 'u' ? '#0284c7' : '#cbd5e1'}`,
                    borderRadius: '12px', color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s ease',
                    boxShadow: focused === 'u'
                      ? '0 0 0 3.5px rgba(2,132,199,0.12)'
                      : '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '7px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'p' ? '#0284c7' : '#94a3b8', transition: 'color 0.2s', display: 'flex'
                }}>
                  <Lock size={17} />
                </div>
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('p')}
                  onBlur={() => setFocused(null)}
                  disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '13px 44px 13px 42px',
                    background: focused === 'p' ? '#f8faff' : '#ffffff',
                    border: `1.5px solid ${focused === 'p' ? '#0284c7' : '#cbd5e1'}`,
                    borderRadius: '12px', color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', transition: 'all 0.2s ease',
                    boxShadow: focused === 'p' ? '0 0 0 3.5px rgba(2,132,199,0.12)' : '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#64748b', display: 'flex', padding: '4px'
                  }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Institutional Support */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.81rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#0284c7', width: '15px', height: '15px' }} />
                Remember session
              </label>
              <button type="button"
                onClick={() => setShowSupport(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#0284c7', fontSize: '0.8rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 0', transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0369a1'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#0284c7'; }}
              >
                <LifeBuoy size={13} />
                Institutional Support
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authState === 'VERIFYING' || authState === 'VERIFIED'}
              style={{
                marginTop: '4px',
                width: '100%', height: '52px',
                background: authState === 'VERIFIED'
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #2563eb 55%, #4f46e5 100%)',
                border: 'none', borderRadius: '14px',
                color: '#fff', fontSize: '0.96rem', fontWeight: 800,
                letterSpacing: '0.02em',
                cursor: (authState === 'VERIFYING' || authState === 'VERIFIED') ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: authState === 'VERIFIED'
                  ? '0 8px 24px rgba(16,185,129,0.35)'
                  : '0 8px 28px rgba(2,132,199,0.38)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)'
              }}
              onMouseEnter={e => {
                if (authState === 'IDLE') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(2,132,199,0.48)';
                }
              }}
              onMouseLeave={e => {
                if (authState === 'IDLE') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(2,132,199,0.38)';
                }
              }}
            >
              {authState === 'IDLE' && (
                <>
                  <span>Sign In to Institutional Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
              {authState === 'VERIFYING' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <Loader2 size={18} style={{ animation: 'loginSpinCCW 0.8s linear infinite' }} />
                  <span>AUTHENTICATING ROLE &amp; CREDENTIALS</span>
                  <span style={{ letterSpacing: '3px', animation: 'loginBlink 1s infinite' }}>● ● ●</span>
                </div>
              )}
              {authState === 'VERIFIED' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', animation: 'loginFadeUp 0.2s ease' }}>
                  <CheckCircle2 size={20} />
                  <span>Authenticated Successfully ✓</span>
                  {detectedRole && (
                    <span style={{
                      background: 'rgba(255,255,255,0.25)', padding: '2px 10px',
                      borderRadius: '8px', fontSize: '0.76rem', fontWeight: 900
                    }}>{detectedRole}</span>
                  )}
                </div>
              )}
            </button>
          </form>



          {/* Security footer */}
          <div style={{
            marginTop: '18px', paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '7px', fontSize: '0.72rem', color: '#94a3b8'
          }}>
            <ShieldCheck size={14} color="#0284c7" />
            <span>Protected by SHA-256 Merkle Ledger &amp; BFT Consensus</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          INSTITUTIONAL SUPPORT MODAL
          ════════════════════════════════════════ */}
      {showSupport && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(7,11,20,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', boxSizing: 'border-box'
        }} onClick={e => { if (e.target === e.currentTarget) closeSupportModal(); }}>

          <div style={{
            background: '#0f172a',
            border: '1.5px solid rgba(56,189,248,0.3)',
            borderRadius: '24px',
            padding: '36px',
            width: '100%', maxWidth: '480px',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(56,189,248,0.08)',
            position: 'relative', overflow: 'hidden',
            animation: 'loginModalIn 0.35s cubic-bezier(0.16,1,0.3,1) both'
          }}>

            {/* Glow top */}
            <div style={{
              position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
              width: '280px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Close */}
            <button type="button" onClick={closeSupportModal} style={{
              position: 'absolute', top: '18px', right: '18px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#94a3b8', transition: 'all 0.18s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <X size={15} />
            </button>

            {supportState !== 'SUCCESS' ? (
              <>
                {/* Modal Header */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '14px',
                      background: 'rgba(56,189,248,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#38bdf8', boxShadow: '0 0 20px rgba(56,189,248,0.2)'
                    }}>
                      <LifeBuoy size={22} />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 800, color: '#f8fafc' }}>
                        Institutional Support
                      </h2>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                        Password reset &amp; helpdesk request
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: '10px', padding: '10px 14px',
                    fontSize: '0.78rem', color: '#7dd3fc', lineHeight: 1.5
                  }}>
                    Enter your Student / Admin ID <strong>or</strong> registered institutional email. A secure password reset link will be dispatched to your inbox within 5–10 minutes.
                  </div>
                </div>

                <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Request type selector */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '7px', display: 'block' }}>
                      Request Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { key: 'FORGOT_PASSWORD', label: 'Forgot Password' },
                        { key: 'ACCOUNT_LOCKED',  label: 'Account Locked' },
                        { key: 'WRONG_EMAIL',     label: 'Wrong Email' },
                        { key: 'OTHER',           label: 'Other Issue' }
                      ].map(t => (
                        <button key={t.key} type="button"
                          onClick={() => setSupportType(t.key)}
                          style={{
                            padding: '9px 8px', borderRadius: '10px', cursor: 'pointer',
                            background: supportType === t.key ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${supportType === t.key ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
                            color: supportType === t.key ? '#38bdf8' : '#64748b',
                            fontSize: '0.76rem', fontWeight: 700, transition: 'all 0.15s ease'
                          }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student/Admin ID */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Student / Admin ID
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type="text" placeholder="e.g. STU2026001 or admin"
                        value={supportId} onChange={e => setSupportId(e.target.value)}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '11px 12px 11px 38px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1.5px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px', color: '#f1f5f9', fontSize: '0.86rem',
                          outline: 'none', transition: 'border-color 0.2s'
                        }}
                        onFocus={e => e.target.style.borderColor = '#38bdf8'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Registered Institutional Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                      <input
                        type="email" placeholder="yourname@abcinstitution.edu"
                        value={supportEmail} onChange={e => setSupportEmail(e.target.value)}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '11px 12px 11px 38px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1.5px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px', color: '#f1f5f9', fontSize: '0.86rem',
                          outline: 'none', transition: 'border-color 0.2s'
                        }}
                        onFocus={e => e.target.style.borderColor = '#38bdf8'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>
                      Provide either your ID or email — at least one is required.
                    </div>
                  </div>

                  {/* Optional description */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                      Additional Details <span style={{ color: '#475569', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief description of the issue..."
                      value={supportDesc} onChange={e => setSupportDesc(e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px', color: '#f1f5f9', fontSize: '0.86rem',
                        outline: 'none', resize: 'none', fontFamily: 'inherit',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = '#38bdf8'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  {/* Error */}
                  {supportError && (
                    <div style={{
                      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '10px', padding: '10px 13px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: '#f87171', fontSize: '0.8rem'
                    }}>
                      <AlertCircle size={14} />
                      {supportError}
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit"
                    disabled={supportState === 'SENDING'}
                    style={{
                      width: '100%', padding: '13px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                      border: 'none', borderRadius: '12px',
                      color: '#fff', fontSize: '0.9rem', fontWeight: 800,
                      cursor: supportState === 'SENDING' ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
                      boxShadow: '0 6px 20px rgba(2,132,199,0.4)',
                      transition: 'all 0.2s ease', opacity: supportState === 'SENDING' ? 0.8 : 1
                    }}
                    onMouseEnter={e => { if (supportState !== 'SENDING') e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {supportState === 'SENDING' ? (
                      <><Loader2 size={16} style={{ animation: 'loginSpinCCW 0.8s linear infinite' }} /><span>Submitting Request…</span></>
                    ) : (
                      <><Send size={16} /><span>Submit Support Request</span></>
                    )}
                  </button>

                  <div style={{
                    textAlign: 'center', fontSize: '0.72rem', color: '#475569', lineHeight: 1.5
                  }}>
                    For urgent issues, visit the IT Helpdesk at<br />
                    <strong style={{ color: '#7dd3fc' }}>Admin Block · Room 102</strong>
                  </div>
                </form>
              </>
            ) : (
              /* ── Success State ── */
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: '18px',
                animation: 'loginTicketIn 0.4s cubic-bezier(0.16,1,0.3,1) both'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#34d399', boxShadow: '0 0 30px rgba(16,185,129,0.3)'
                }}>
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.18rem', fontWeight: 800, color: '#f8fafc' }}>
                    Request Submitted ✓
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    {supportTicket?.message}
                  </p>
                </div>

                {/* Ticket reference */}
                {supportTicket?.ticket_ref && (
                  <div style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1.5px solid rgba(16,185,129,0.3)',
                    borderRadius: '14px', padding: '16px 20px', width: '100%'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Ticket Reference
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.08em' }}>
                      {supportTicket.ticket_ref}
                    </div>
                    {supportTicket.student_name && (
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '6px' }}>
                        {supportTicket.student_name} · {supportTicket.department}
                      </div>
                    )}
                  </div>
                )}

                {/* Next steps */}
                {supportTicket?.next_steps && (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                      Next Steps
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {supportTicket.next_steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.8rem', color: '#94a3b8' }}>
                          <ChevronRight size={14} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button type="button" onClick={closeSupportModal}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'rgba(56,189,248,0.12)',
                    border: '1.5px solid rgba(56,189,248,0.3)',
                    borderRadius: '12px', color: '#38bdf8',
                    fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.12)'; }}
                >
                  Back to Login
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
