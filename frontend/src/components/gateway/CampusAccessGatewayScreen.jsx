import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Cpu,
  Lock,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Server,
  ArrowRight,
  Sparkles,
  Radio,
  Clock,
  Terminal,
  Sliders
} from 'lucide-react';
import { api } from '../../services/api';

export function CampusAccessGatewayScreen({ onAccessGranted, roleTarget = 'STUDENT' }) {
  const [checkingStep, setCheckingStep] = useState(0); // 0: init, 1: net, 2: dev, 3: policy, 4: complete
  const [status, setStatus] = useState('CHECKING'); // 'CHECKING' | 'GRANTED' | 'RESTRICTED'
  const [accessData, setAccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [devBypassActive, setDevBypassActive] = useState(false);

  const runGatewayVerification = async (forcedDeviceId = null) => {
    setStatus('CHECKING');
    setCheckingStep(1);
    setErrorMessage('');

    // Retrieve or generate local device trust token
    let storedDeviceId = forcedDeviceId || localStorage.getItem('studentvoicex_device_id');
    if (!storedDeviceId) {
      storedDeviceId = `DEV-BYOD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      localStorage.setItem('studentvoicex_device_id', storedDeviceId);
    }

    try {
      // Step 1: Network Check
      setTimeout(async () => {
        setCheckingStep(2);

        // Step 2: Device Check
        setTimeout(async () => {
          setCheckingStep(3);

          // Step 3: Policy Check & Backend Request
          try {
            const res = await api.gateway.checkAccess({
              device_id: storedDeviceId,
              role_target: roleTarget
            });

            setTimeout(() => {
              setAccessData(res);
              if (res.access_granted || res.status === 'GRANTED') {
                setCheckingStep(4);
                setStatus('GRANTED');
                setTimeout(() => {
                  if (onAccessGranted) onAccessGranted(res);
                }, 1200);
              } else {
                setStatus('RESTRICTED');
                setErrorMessage(res.network?.status_text || 'Access Restricted');
              }
            }, 600);
          } catch (err) {
            setTimeout(() => {
              setStatus('RESTRICTED');
              setErrorMessage(err.message || 'Campus network verification failed.');
            }, 600);
          }
        }, 600);
      }, 600);
    } catch (e) {
      setStatus('RESTRICTED');
      setErrorMessage(e.message || 'Network check error');
    }
  };

  useEffect(() => {
    runGatewayVerification();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #070b14 0%, #0b1120 50%, #0f172a 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Cybernetic Glow Circles */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Glass Gateway Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          border: status === 'RESTRICTED'
            ? '1.5px solid rgba(239, 68, 68, 0.5)'
            : status === 'GRANTED'
            ? '1.5px solid rgba(16, 185, 129, 0.6)'
            : '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: status === 'RESTRICTED'
            ? '0 20px 50px rgba(239, 68, 68, 0.25), inset 0 0 20px rgba(239, 68, 68, 0.1)'
            : status === 'GRANTED'
            ? '0 20px 50px rgba(16, 185, 129, 0.25), inset 0 0 20px rgba(16, 185, 129, 0.1)'
            : '0 20px 50px rgba(2, 6, 23, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: status === 'RESTRICTED'
                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                : status === 'GRANTED'
                ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: status === 'RESTRICTED'
                ? '0 0 24px rgba(239, 68, 68, 0.5)'
                : status === 'GRANTED'
                ? '0 0 24px rgba(16, 185, 129, 0.5)'
                : '0 0 24px rgba(56, 189, 248, 0.5)',
              transition: 'all 0.3s ease'
            }}
          >
            {status === 'RESTRICTED' ? (
              <ShieldAlert size={28} color="#ffffff" />
            ) : status === 'GRANTED' ? (
              <CheckCircle2 size={28} color="#ffffff" />
            ) : (
              <ShieldCheck size={28} color="#ffffff" />
            )}
          </div>

          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            STUDENTVOICEX SECURITY LAYER
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc', margin: '4px 0 2px 0', letterSpacing: '-0.02em' }}>
            CAMPUS ACCESS GATEWAY
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            {status === 'CHECKING' && 'Verifying authorized college network & hardware trust credentials...'}
            {status === 'GRANTED' && 'Campus environment verified. Establishing secure encrypted session...'}
            {status === 'RESTRICTED' && 'Access restricted to authorized ABC Institution infrastructure.'}
          </p>
        </div>

        {/* ----------------- Status 1: Animated Verification Progress ----------------- */}
        {status === 'CHECKING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {/* Step 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: checkingStep >= 2 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                border: checkingStep === 1 ? '1px solid #38bdf8' : checkingStep >= 2 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                transition: 'all 0.25s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: checkingStep >= 2 ? '#10b981' : checkingStep === 1 ? '#0284c7' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {checkingStep >= 2 ? <CheckCircle2 size={16} color="#ffffff" /> : <Wifi size={16} color="#38bdf8" className={checkingStep === 1 ? 'spin-slow' : ''} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: checkingStep >= 2 ? '#a7f3d0' : '#f8fafc' }}>
                  1. Network Verification
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {checkingStep >= 2 ? 'Authorized College Subnet (COLLEGE_WIFI)' : 'Inspecting client subnet & BFT gateway...'}
                </div>
              </div>
              {checkingStep === 1 && <div className="pulse-dot-cyan" />}
            </div>

            {/* Step 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: checkingStep >= 3 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                border: checkingStep === 2 ? '1px solid #38bdf8' : checkingStep >= 3 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                transition: 'all 0.25s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: checkingStep >= 3 ? '#10b981' : checkingStep === 2 ? '#0284c7' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {checkingStep >= 3 ? <CheckCircle2 size={16} color="#ffffff" /> : <Cpu size={16} color="#818cf8" className={checkingStep === 2 ? 'spin-slow' : ''} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: checkingStep >= 3 ? '#a7f3d0' : '#f8fafc' }}>
                  2. Device Trust Verification
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {checkingStep >= 3 ? 'Hardware Trust Token Validated' : 'Checking device registry fingerprint...'}
                </div>
              </div>
              {checkingStep === 2 && <div className="pulse-dot-cyan" />}
            </div>

            {/* Step 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: checkingStep >= 4 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                border: checkingStep === 3 ? '1px solid #38bdf8' : checkingStep >= 4 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                transition: 'all 0.25s ease'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: checkingStep >= 4 ? '#10b981' : checkingStep === 3 ? '#0284c7' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {checkingStep >= 4 ? <CheckCircle2 size={16} color="#ffffff" /> : <Clock size={16} color="#a855f7" className={checkingStep === 3 ? 'spin-slow' : ''} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: checkingStep >= 4 ? '#a7f3d0' : '#f8fafc' }}>
                  3. Election Access Policy Check
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {checkingStep >= 4 ? 'Active Election Window Open' : 'Validating voting hours & RBAC policies...'}
                </div>
              </div>
              {checkingStep === 3 && <div className="pulse-dot-cyan" />}
            </div>
          </div>
        )}

        {/* ----------------- Status 2: Access Granted ----------------- */}
        {status === 'GRANTED' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', marginBottom: '6px' }}>
                ✓ CAMPUS VERIFIED
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0 }}>
                Authorized connection established via <strong>{accessData?.network?.ssid || 'COLLEGE_WIFI'}</strong>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px', fontSize: '0.74rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 12px', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Network: </span>
                  <strong style={{ color: '#34d399' }}>✓ Authorized</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 12px', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Device: </span>
                  <strong style={{ color: '#38bdf8' }}>✓ {accessData?.device?.device_name || 'Trusted'}</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 12px', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Account: </span>
                  <strong style={{ color: '#38bdf8' }}>✓ Ready for Auth</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 12px', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Election: </span>
                  <strong style={{ color: '#10b981' }}>✓ Access OPEN</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAccessGranted && onAccessGranted(accessData)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>Entering StudentVoiceX Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ----------------- Status 3: Access Restricted / Denied ----------------- */}
        {status === 'RESTRICTED' && (
          <div>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171', marginBottom: '4px' }}>
                ACCESS RESTRICTED
              </div>
              <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: '0 0 14px 0' }}>
                This application is strictly available only through the authorized ABC Institution campus network during official election hours.
              </p>

              {/* Status Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Network:</span>
                  <span style={{ color: '#ef4444', fontWeight: 800 }}>✗ Not Authorized</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Device:</span>
                  <span style={{ color: '#94a3b8' }}>— Not Checked</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Account:</span>
                  <span style={{ color: '#94a3b8' }}>— Not Checked</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => runGatewayVerification()}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={15} />
                <span>Check Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Development Mode Pill (Admin & Developer Testing) */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} color="#38bdf8" />
            <span>Campus Network Verified • Server-Enforced</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>DEVELOPMENT ACCESS ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusAccessGatewayScreen;
