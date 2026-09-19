import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StudentVoiceXLogo } from '../../components/StudentVoiceXLogo';
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
  Sparkles,
  Zap,
  Radio,
  Check
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await login(username.trim(), password);
      setLoginSuccess(true);

      setTimeout(() => {
        const userRole = response?.role || response?.user?.role;
        const normalizedRole = (userRole || '').toUpperCase();

        if (normalizedRole === 'ADMIN' || normalizedRole === 'SUPERADMIN') {
          navigate('/admin/dashboard');
        } else if (normalizedRole === 'EVM_KIOSK' || normalizedRole === 'EVM' || username.startsWith('evm_')) {
          navigate('/evm-kiosk');
        } else {
          navigate('/evm-kiosk');
        }
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid institutional credentials. Please verify your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      zIndex: 1,
      userSelect: 'none'
    }}>

      {/* Main 2-Column Split Container */}
      <div style={{
        width: '100%',
        maxWidth: '1060px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>

        {/* ------------------------------------------------------------- */}
        {/* LEFT COLUMN: BRAND HERO (Glowing Dark Tech Styling)           */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '26px',
          padding: '12px 6px',
          animation: 'fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>

          {/* Institutional Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '24px',
            padding: '6px 14px',
            width: 'fit-content',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8'
            }} />
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-mono)'
            }}>
              ABC INSTITUTION • DEMOCRATIC BLOCKCHAIN GATEWAY
            </span>
          </div>

          {/* Official Brand Logo Presentation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <StudentVoiceXLogo
              size={64}
              showText={true}
              showTagline={true}
              taglineText="Your Voice Shapes Tomorrow."
              isDark={true}
            />
          </div>

          {/* Headline & Subtitle */}
          <div>
            <h1 style={{
              fontSize: '2.3rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 14px 0',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)'
            }}>
              Decentralized Campus Democratic Voting
            </h1>
            <p style={{
              fontSize: '0.96rem',
              color: '#cbd5e1',
              lineHeight: 1.65,
              margin: 0,
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)'
            }}>
              Empowering transparent, verifiable, and cryptographic student elections with Byzantine Fault Tolerant consensus and zero-knowledge privacy.
            </p>
          </div>

          {/* Feature Highlight Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.22)',
              borderRadius: '16px',
              padding: '14px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                flexShrink: 0,
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  BFT Consensus & Immutability
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Cryptographically sealed ballots across independent validator nodes
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(168, 85, 247, 0.22)',
              borderRadius: '16px',
              padding: '14px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
                flexShrink: 0,
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)'
              }}>
                <Layers size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Merkle Tree Receipt Verification
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Students verify their inclusion in the ledger without exposing their vote
                </div>
              </div>
            </div>

          </div>

          {/* Live Node Telemetry Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
            marginTop: '2px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }} />
              <span style={{ color: '#34d399', fontWeight: 700 }}>GENESIS BLOCK VERIFIED</span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <span style={{ color: '#cbd5e1' }}>SHA-256 SECURED</span>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT COLUMN: CRISP LIGHT GLASSMORPHIC LOGIN CARD            */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.25)',
          position: 'relative',
          animation: 'fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}>

          {/* Card Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-heading)'
            }}>
              Sign In to Portal
            </h2>
            <p style={{
              fontSize: '0.86rem',
              color: '#475569',
              margin: 0,
              lineHeight: 1.4
            }}>
              Enter your institutional credentials or student ID to continue
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b91c1c',
              fontSize: '0.84rem',
              fontWeight: 500,
              lineHeight: 1.4,
              animation: 'shake 0.4s ease-in-out'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, color: '#dc2626' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert Box */}
          {loginSuccess && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#15803d',
              fontSize: '0.86rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#16a34a' }} />
              <span>Identity Authenticated! Redirecting...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Username Input Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '6px',
                letterSpacing: '0.01em'
              }}>
                Username / Institutional ID
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  color: focusedField === 'username' ? '#0284c7' : '#64748b',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. admin or STU2026001"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage('');
                  }}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    background: '#f8fafc',
                    border: focusedField === 'username'
                      ? '1.5px solid #0284c7'
                      : '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0 14px 0 44px',
                    color: '#0f172a',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: focusedField === 'username' ? '0 0 0 3px rgba(2, 132, 199, 0.18)' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '6px',
                letterSpacing: '0.01em'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  color: focusedField === 'password' ? '#0284c7' : '#64748b',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    background: '#f8fafc',
                    border: focusedField === 'password'
                      ? '1.5px solid #0284c7'
                      : '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0 44px 0 44px',
                    color: '#0f172a',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(2, 132, 199, 0.18)' : 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: '#475569'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: '#0284c7',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontWeight: 500 }}>Remember session</span>
              </label>

              <span
                style={{
                  color: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Institutional Support
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading || loginSuccess}
              style={{
                width: '100%',
                height: '50px',
                marginTop: '6px',
                background: loginSuccess
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.94rem',
                fontWeight: 700,
                cursor: loading || loginSuccess ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading && !loginSuccess) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(2, 132, 199, 0.55)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !loginSuccess) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(2, 132, 199, 0.45)';
                }
              }}
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <span>Sign In to StudentVoiceX</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security & Cryptographic Footer Note */}
          <div style={{
            marginTop: '28px',
            textAlign: 'center',
            fontSize: '0.74rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={15} color="#0284c7" />
            <span>Protected by SHA-256 Merkle Ledger & BFT Consensus</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;
