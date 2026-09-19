import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SecurityStatus } from './SecurityStatus';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck,
  Building2,
  GraduationCap,
  Monitor,
  KeyRound,
  Clock
} from 'lucide-react';

/**
 * LoginForm - Crisp, Ultra-Modern Light-Themed Institutional Login Component
 * Features:
 * - 1-Click Quick Demo Auto-Fill Chips (Student, Admin, CEO, EVM Kiosk)
 * - Live real-time role preview detection while typing in the ID field
 * - High contrast, accessible typography and glowing focus states
 * - Dynamic verification state machine:
 *   [Sign In →] -> [SCANNING CREDENTIALS ● ● ●] -> [IDENTITY VERIFIED ✓] -> [ROLE BADGE] -> [REDIRECT]
 */
export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Verification Animation States: 'IDLE' | 'VERIFYING' | 'VERIFIED' | 'REDIRECTING'
  const [authState, setAuthState] = useState('IDLE');
  const [detectedRole, setDetectedRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeChip, setActiveChip] = useState(null);

  // Quick Demo Preset Profiles for Evaluators (Admin & EVM Kiosk Stations)
  const demoProfiles = [
    {
      id: 'admin',
      label: 'Admin Portal',
      icon: '🛡️',
      username: 'admin',
      password: 'Admin@ABC2026',
      roleHint: 'System Admin'
    },
    {
      id: 'evm1',
      label: 'EVM Station #01',
      icon: '🗳️',
      username: 'evm_kiosk_01',
      password: 'EVM@ABC2026',
      roleHint: 'Auditorium Polling Unit'
    },
    {
      id: 'evm2',
      label: 'EVM Station #02',
      icon: '⚡',
      username: 'evm_kiosk_02',
      password: 'EVM@ABC2026',
      roleHint: 'Library Polling Unit'
    }
  ];

  // Helper to detect preview role based on current username string
  const getTypingRolePreview = (val) => {
    const v = val.trim().toLowerCase();
    if (!v) return null;
    if (v.includes('admin') || v.startsWith('adm')) {
      return {
        label: 'System Admin',
        color: '#e11d48',
        bg: '#ffe4e6',
        border: '#fecdd3',
        icon: <ShieldCheck size={13} />
      };
    }
    if (v.includes('evm') || v.includes('kiosk') || v.includes('booth')) {
      return {
        label: 'EVM Polling Terminal',
        color: '#0284c7',
        bg: '#e0f2fe',
        border: '#bae6fd',
        icon: <Monitor size={13} />
      };
    }
    return {
      label: 'Authorized Operator',
      color: '#059669',
      bg: '#d1fae5',
      border: '#a7f3d0',
      icon: <CheckCircle2 size={13} />
    };
  };

  const rolePreview = getTypingRolePreview(username);

  // Handle Quick Demo Auto-Fill
  const handleSelectDemo = (profile) => {
    setActiveChip(profile.id);
    setUsername(profile.username);
    setPassword(profile.password);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Please enter both your Terminal/Admin ID and password.');
      return;
    }

    setErrorMessage('');
    setAuthState('VERIFYING');

    try {
      // Authenticate with Django REST API
      const res = await login(cleanUser, cleanPass);

      // Handle MFA if enabled
      if (res && res.mfa_required) {
        setErrorMessage('Multi-Factor Authentication required. Please check your authenticator.');
        setAuthState('IDLE');
        return;
      }

      // Backend dynamically returns authenticated role
      const role = res?.role || 'ADMIN';
      setDetectedRole(role);

      // Step 2: Show "Identity verified ✓"
      setTimeout(() => {
        setAuthState('VERIFIED');

        // Step 3: Smooth redirect to authorized dashboard
        setTimeout(() => {
          setAuthState('REDIRECTING');
          if (role === 'ADMIN' || role === 'CEO') {
            navigate('/admin/dashboard');
          } else {
            navigate('/evm-kiosk');
          }
        }, 600);
      }, 600);

    } catch (err) {
      setAuthState('IDLE');
      setErrorMessage(err.message || 'Invalid ID or password. Please verify your credentials.');
    }
  };

  return (
    <div
      className="studentvoicex-login-card"
      style={{
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(24px)',
        border: '1.5px solid #e2e8f0',
        borderRadius: '24px',
        padding: '34px 32px',
        boxShadow:
          '0 25px 50px -12px rgba(15, 23, 42, 0.09), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
        color: '#0f172a',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      {/* Laser Scan Beam Animation when VERIFYING */}
      {authState === 'VERIFYING' && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '3px',
            background:
              'linear-gradient(90deg, transparent 0%, #0284c7 50%, #4f46e5 80%, transparent 100%)',
            boxShadow: '0 0 14px 3px rgba(2, 132, 199, 0.6)',
            animation: 'scanline 1.2s infinite linear',
            zIndex: 30
          }}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: '22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}
          >
            <span>Welcome back</span>
            <span style={{ fontSize: '1.35rem' }}>👋</span>
          </h2>

          {/* Real-time Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#0284c7'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#0284c7',
                boxShadow: '0 0 6px #0284c7'
              }}
            />
            <span>ABC PORTAL</span>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            marginTop: '6px',
            marginBottom: 0
          }}
        >
          Sign in to Admin Command Center or Provision & Authenticate EVM Polling Kiosks.
        </p>
      </div>

      {/* Quick Demo 1-Click Auto-Fill Chips */}
      <div style={{ marginBottom: '22px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          <span>⚡ Quick Demo Profiles</span>
          <span style={{ color: '#0284c7', fontSize: '0.68rem', fontWeight: 700 }}>1-Click fill</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}
        >
          {demoProfiles.map((p) => {
            const isSelected = activeChip === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectDemo(p)}
                disabled={authState !== 'IDLE'}
                style={{
                  padding: '8px 4px',
                  borderRadius: '12px',
                  background: isSelected ? '#e0f2fe' : '#f8fafc',
                  border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  color: isSelected ? '#0369a1' : '#334155',
                  fontSize: '0.71rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.18)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
                title={`Login as ${p.roleHint} (${p.username})`}
              >
                <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {p.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Voting Hours Notice */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.74rem',
          color: '#475569'
        }}
      >
        <Clock size={16} color="#d97706" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#0f172a' }}>Student Voting Window:</strong> Strictly 9:00 AM – 12:00 PM on Election Day. Administrator access is unrestricted.
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '12px',
            padding: '11px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#be123c',
            fontSize: '0.82rem',
            animation: 'shake 0.3s ease'
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* User ID Field with Dynamic Role Preview Badge */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '7px'
            }}
          >
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#334155'
              }}
            >
              Student / EVM / Admin ID
            </label>

            {/* Dynamic Role Detector Badge */}
            {rolePreview && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.69rem',
                  fontWeight: 800,
                  color: rolePreview.color,
                  background: rolePreview.bg,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: `1px solid ${rolePreview.border}`,
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                {rolePreview.icon}
                <span>{rolePreview.label}</span>
              </span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'username' ? '#0284c7' : '#94a3b8',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <User size={18} />
            </div>

            <input
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. STU2026001, admin, or evm_kiosk_01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              disabled={authState !== 'IDLE'}
              style={{
                width: '100%',
                padding: '13px 14px 13px 44px',
                background: '#ffffff',
                border:
                  focusedField === 'username'
                    ? '1.5px solid #0284c7'
                    : '1.5px solid #cbd5e1',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '0.91rem',
                outline: 'none',
                boxShadow:
                  focusedField === 'username'
                    ? '0 0 0 3px rgba(2, 132, 199, 0.15)'
                    : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '7px'
            }}
          >
            Password
          </label>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'password' ? '#0284c7' : '#94a3b8',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Lock size={18} />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              disabled={authState !== 'IDLE'}
              style={{
                width: '100%',
                padding: '13px 44px 13px 44px',
                background: '#ffffff',
                border:
                  focusedField === 'password'
                    ? '1.5px solid #0284c7'
                    : '1.5px solid #cbd5e1',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '0.91rem',
                outline: 'none',
                boxShadow:
                  focusedField === 'password'
                    ? '0 0 0 3px rgba(2, 132, 199, 0.15)'
                    : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            />

            {/* Show/Hide Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Dynamic Verification Action Button */}
        <button
          type="submit"
          disabled={authState !== 'IDLE'}
          style={{
            marginTop: '6px',
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.96rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            cursor: authState === 'IDLE' ? 'pointer' : 'default',
            color: '#ffffff',
            background:
              authState === 'VERIFIED' || authState === 'REDIRECTING'
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
            boxShadow:
              authState === 'VERIFIED'
                ? '0 8px 20px rgba(16, 185, 129, 0.35)'
                : '0 8px 20px rgba(2, 132, 199, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.25s cubic-bezier(0.2, 0, 0.2, 1)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (authState === 'IDLE') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(2, 132, 199, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (authState === 'IDLE') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.3)';
            }
          }}
        >
          {authState === 'IDLE' && (
            <>
              <span>Sign In</span>
              <ArrowRight size={17} style={{ transition: 'transform 0.2s ease' }} />
            </>
          )}

          {authState === 'VERIFYING' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} className="spin" />
              <span>SCANNING CREDENTIALS</span>
              <span style={{ letterSpacing: '2px' }}>● ● ●</span>
            </div>
          )}

          {(authState === 'VERIFIED' || authState === 'REDIRECTING') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.2s ease' }}>
              <CheckCircle2 size={18} />
              <span>Identity verified ✓</span>
              {detectedRole && (
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    marginLeft: '4px'
                  }}
                >
                  {detectedRole}
                </span>
              )}
            </div>
          )}
        </button>

      </form>

      {/* Security Status Guarantee */}
      <SecurityStatus
        isVerified={authState === 'VERIFIED' || authState === 'REDIRECTING'}
        detectedRole={detectedRole}
      />
    </div>
  );
}

export default LoginForm;
