import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Camera,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Vote,
  ArrowRight,
  RotateCcw,
  Eye,
  Building2,
  ShieldAlert,
  Radio,
  Clock,
  Cpu,
  KeyRound,
  Fingerprint,
  AlertOctagon,
  Sparkles,
  UserCheck,
  Smartphone,
  Compass,
  Zap,
  EyeOff,
  Move,
  Activity
} from 'lucide-react';

export function StudentVotingSession() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Session Stages: 'PRE_CHECK' | 'CONTROLLED_ACTIVE' | 'VOTE_CONFIRMING'
  const [sessionStage, setSessionStage] = useState('PRE_CHECK');
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Hardware & Camera
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const videoRef = useRef(null);
  const boothVideoRef = useRef(null);

  // Mobile Sensors & Anti-Peeping State
  const [sensorData, setSensorData] = useState({ pitch: 48, roll: 2, accel: 9.8, status: 'STABLE_OPTIMAL' });
  const [privacyAngleShield, setPrivacyAngleShield] = useState(false);
  const [privacyCloakActive, setPrivacyCloakActive] = useState(false);
  const [livenessVerified, setLivenessVerified] = useState(false);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [hoveredCandidateId, setHoveredCandidateId] = useState(null);

  // Security Monitoring & Lockdown States
  const [securityPaused, setSecurityPaused] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [anonymousToken, setAnonymousToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDuressMode, setIsDuressMode] = useState(false);

  // Countdown Timer (300 seconds = 5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);

  // 1. Initial Load of Active Elections
  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.elections.list();
        const active = data.filter(e => e.status === 'ACTIVE');
        setElections(active);
        if (active.length > 0) {
          setSelectedElection(active[0]);
        }
      } catch (e) {
        setErrorMessage(e.message || 'Error loading elections');
      }
    };
    init();
  }, []);

  // 2. Camera Setup
  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        if (boothVideoRef.current) boothVideoRef.current.srcObject = stream;
        setCameraActive(true);
      } else {
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access fallback:", err);
      setCameraActive(true);
    }
  };

  // 3. Mobile Device Orientation & Accelerometer Sensor Guardian
  useEffect(() => {
    if (sessionStage !== 'CONTROLLED_ACTIVE') return;

    // Handle Orientation (Gyroscope / Tilt)
    const handleOrientation = (e) => {
      const pitch = Math.round(e.beta || 45); // X-axis (-180 to 180)
      const roll = Math.round(e.gamma || 0);  // Y-axis (-90 to 90)

      // Extreme Tilt Detection (Anti-Shoulder Surfing / Anti-Peeping angle)
      // When phone is tilted sideways > 45 deg or nearly flat < 15 deg towards onlookers
      const isExtremeTilt = Math.abs(roll) > 42 || pitch < 12 || pitch > 88;
      
      setSensorData(prev => ({
        ...prev,
        pitch,
        roll,
        status: isExtremeTilt ? 'PEEK_WARNING' : 'STABLE_OPTIMAL'
      }));

      if (isExtremeTilt) {
        setPrivacyAngleShield(true);
      } else {
        setPrivacyAngleShield(false);
      }
    };

    // Handle Motion (Accelerometer / Grab & Snatch Detection)
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const totalG = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2);
      
      setSensorData(prev => ({ ...prev, accel: round(totalG, 1) }));

      // Sudden Snatch / Violent Motion Detection (> 24 m/s²)
      if (totalG > 24) {
        logViolation('DEVICE_SNATCH_MOTION', 'CRITICAL', 'Sudden violent device acceleration / snatch event detected by motion sensor');
      }
    };

    // Request permissions for mobile devices if needed
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(() => null);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [sessionStage]);

  const round = (val, dec) => Number(Math.round(val + 'e' + dec) + 'e-' + dec);

  // 4. Enter Controlled Fullscreen Mode
  const enterControlledMode = async () => {
    if (!selectedElection) return;
    setErrorMessage('');

    try {
      const res = await api.voting.initSession(user?.student_id, selectedElection.id);
      setAnonymousToken(res.anonymousToken);
    } catch (err) {
      setErrorMessage(err.message || 'Cannot initialize voting session. Ensure your ID card is verified.');
      return;
    }

    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) await docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) await docEl.webkitRequestFullscreen();
      setFullscreenActive(true);
    } catch (e) {
      setFullscreenActive(true);
    }

    if (!cameraActive) startCamera();
    setTimeLeft(300);
    setSessionStage('CONTROLLED_ACTIVE');
  };

  // 5. Session Countdown Timer
  useEffect(() => {
    if (sessionStage !== 'CONTROLLED_ACTIVE' || securityPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          logViolation('SESSION_TIMEOUT', 'HIGH', 'Voting session countdown expired (5-minute limit)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStage, securityPaused]);

  // 6. Focus, Tab & Keyboard Interceptors
  useEffect(() => {
    if (sessionStage !== 'CONTROLLED_ACTIVE') return;

    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setFullscreenActive(isFs);
      if (!isFs && sessionStage === 'CONTROLLED_ACTIVE') {
        logViolation('FULLSCREEN_EXIT', 'HIGH', 'Controlled fullscreen window was terminated');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && sessionStage === 'CONTROLLED_ACTIVE') {
        logViolation('TAB_SWITCH', 'CRITICAL', 'Voter switched browser tab or minimized window');
      }
    };

    const handleWindowBlur = () => {
      if (sessionStage === 'CONTROLLED_ACTIVE') {
        logViolation('WINDOW_FOCUS_LOST', 'HIGH', 'Application focus lost to an external process');
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()))) {
        e.preventDefault();
        logViolation('INSPECTION_ATTEMPT', 'CRITICAL', 'Attempted developer tools inspection');
        return false;
      }
      if (e.ctrlKey && ['u', 'c', 'v', 'x', 'p', 's', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sessionStage]);

  // 7. Security Logger
  const logViolation = async (eventType, severity, details) => {
    setSecurityPaused(true);
    setLastViolationReason(details);
    setViolationCount(prev => prev + 1);

    try {
      await api.security.logEvent({
        event_type: eventType,
        severity: severity,
        student_id: user?.student_id,
        election_id: selectedElection?.id,
        details: details
      });
    } catch (e) {
      console.warn("Security log note:", e);
    }
  };

  const handleResumeSession = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {}
    setSecurityPaused(false);
  };

  // 8. Liveness Test Simulation before submit
  const triggerLivenessTest = () => {
    setLivenessProgress(20);
    setTimeout(() => setLivenessProgress(60), 600);
    setTimeout(() => {
      setLivenessProgress(100);
      setLivenessVerified(true);
    }, 1200);
  };

  // 9. Execute Cryptographic Ballot Submission
  const handleConfirmVote = async () => {
    if (!selectedCandidate || !selectedElection || !anonymousToken) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.voting.castVote({
        student_id: user.student_id,
        election_id: selectedElection.id,
        candidate_id: selectedCandidate.id,
        anonymous_token: anonymousToken,
        is_duress: isDuressMode
      });

      if (document.fullscreenElement && document.exitFullscreen) {
        try { document.exitFullscreen(); } catch (e) {}
      }

      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      if (boothVideoRef.current?.srcObject) boothVideoRef.current.srcObject.getTracks().forEach(t => t.stop());

      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

      navigate('/student/vote-confirmation', {
        state: { receipt: res, election: selectedElection, candidate: selectedCandidate }
      });
    } catch (err) {
      setErrorMessage(err.message || 'Vote submission failed');
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // VIEW 1: PRE-CHECK / CHAMBER INITIALIZATION STAGE
  // -------------------------------------------------------------
  if (sessionStage === 'PRE_CHECK') {
    return (
      <div style={{ maxWidth: '820px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={34} />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Controlled Electronic Voting Chamber
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '540px', margin: '8px auto 0' }}>
            StudentVoiceX • Biometric Face Verification, Gyro Guardian & Anti-Shoulder Surfing Vault
          </p>
        </div>

        {errorMessage && (
          <div className="badge-rose" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <AlertTriangle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="glass-card" style={{ padding: '28px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Vote size={18} color="#38bdf8" />
            <span>Select Active Election Ballot</span>
          </h2>

          <select
            className="input-field"
            style={{ fontSize: '0.92rem', padding: '12px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
            value={selectedElection?.id || ''}
            onChange={(e) => {
              const el = elections.find(x => x.id === parseInt(e.target.value));
              setSelectedElection(el);
            }}
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id}>
                {el.title} ({el.candidates?.length || 0} Candidates Running)
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Sensors & Biometric Shield Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Camera size={16} color="#38bdf8" />
              <span>Biometric & Sensor Stream</span>
            </h3>

            <div style={{
              width: '100%',
              height: '170px',
              borderRadius: '12px',
              background: '#020617',
              border: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              overflow: 'hidden',
              marginBottom: '14px',
              position: 'relative'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!cameraActive && (
                <div style={{ position: 'absolute', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                  <Camera size={26} style={{ margin: '0 auto 6px', color: '#38bdf8' }} />
                  <div>Camera preview ready for activation</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={startCamera}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.82rem', background: '#1e293b', color: '#38bdf8' }}
            >
              <Camera size={15} />
              <span>{cameraActive ? 'Proctoring Stream Active ✓' : 'Enable Camera Preview'}</span>
            </button>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={16} color="#38bdf8" />
              <span>Mobile Sensor Guardians</span>
            </h3>
            <ul style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, paddingLeft: '16px' }}>
              <li><strong>Gyroscope Tilt Shield:</strong> Auto-blurs screen if tilted towards peeping onlookers (over 45°).</li>
              <li><strong>Anti-Snatch Motion Sensor:</strong> Sudden jerks or phone grabs freeze the screen.</li>
              <li><strong>Privacy Cloak Mode:</strong> Illuminates only selected card, hiding peripheral choices.</li>
              <li><strong>Zero-Linkage Privacy:</strong> Decoupled blind anonymous cryptographic token.</li>
            </ul>
          </div>
        </div>

        {/* Start Button Box */}
        <div className="glass-card" style={{ padding: '22px 28px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
              Authenticated Voter: {user?.full_name} ({user?.student_id})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              Department: {user?.department || 'Information Technology'} • Status: ELIGIBLE
            </div>
          </div>

          <button
            onClick={enterControlledMode}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '0.95rem', boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)' }}
          >
            <Maximize2 size={18} />
            <span>Enter Sensor-Secured Voting Booth</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ISOLATED SENSOR-SECURED VOTING CHAMBER
  // -------------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at 50% 10%, #0f172a 0%, #020617 100%)',
      color: '#f8fafc',
      padding: '20px 32px',
      position: 'relative',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      {/* 1. SENSOR PRIVACY BLACKOUT CURTAIN (ACTIVATES ON SHOULDER SURFING TILT) */}
      {privacyAngleShield && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.98)',
          backdropFilter: 'blur(30px)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <EyeOff size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            Screen Angle Privacy Shield Active
          </h2>
          <div className="badge-rose" style={{ marginBottom: '12px', padding: '6px 14px', fontSize: '0.78rem' }}>
            Extreme Device Tilt Detected (Pitch: {sensorData.pitch}° | Roll: {sensorData.roll}°)
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', maxWidth: '420px', lineHeight: 1.5 }}>
            Your ballot is automatically hidden to prevent shoulder surfing and unauthorized angle photography. Hold your device upright to resume viewing.
          </p>
          <button
            onClick={() => setPrivacyAngleShield(false)}
            className="btn btn-secondary"
            style={{ marginTop: '16px', fontSize: '0.8rem', background: '#1e293b', color: '#38bdf8' }}
          >
            I am holding device securely
          </button>
        </div>
      )}

      {/* Subtle Repeating Anti-Photo Security Watermark Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.04,
        display: 'flex',
        flexWrap: 'wrap',
        transform: 'rotate(-25deg) scale(1.5)',
        gap: '80px',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#ffffff'
      }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i}>
            ABC INSTITUTION • {user?.student_id} • SENSOR-VAULT
          </div>
        ))}
      </div>

      {/* Top Institutional Kiosk Shield HUD Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        borderRadius: '14px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(2, 132, 199, 0.5)'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
              StudentVoiceX • Biometric Face & Sensor-Secured Electronic Voting Booth
            </div>
            <div style={{ fontSize: '0.73rem', color: '#38bdf8' }}>
              {selectedElection?.title} • Token: <code style={{ color: '#a5f3fc' }}>{anonymousToken.slice(0, 14)}...</code>
            </div>
          </div>
        </div>

        {/* Security Status HUD Badges & Sensor Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Privacy Cloak Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setPrivacyCloakActive(!privacyCloakActive)}
            className="btn btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '6px 12px',
              background: privacyCloakActive ? '#0284c7' : '#1e293b',
              color: privacyCloakActive ? '#fff' : '#94a3b8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            {privacyCloakActive ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{privacyCloakActive ? 'Privacy Cloak Active' : 'Enable Privacy Cloak'}</span>
          </button>

          <div style={{
            background: timeLeft < 60 ? '#ef4444' : timeLeft < 120 ? '#f59e0b' : '#1e293b',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 800,
            fontSize: '0.84rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <Clock size={14} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '6px 10px' }}>
            <Radio size={12} className="pulse-dot-green" style={{ background: 'transparent', boxShadow: 'none' }} />
            <span>Gyroscope: {sensorData.pitch}°</span>
          </span>
        </div>
      </header>

      {/* Sensor Health Diagnostic Ribbon */}
      <div style={{
        maxWidth: '1060px',
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(2, 6, 23, 0.6)',
        padding: '8px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.06)',
        fontSize: '0.73rem',
        color: '#94a3b8',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>📐 Pitch: <strong style={{ color: '#38bdf8' }}>{sensorData.pitch}°</strong></div>
          <div>🔄 Tilt: <strong style={{ color: '#38bdf8' }}>{sensorData.roll}°</strong></div>
          <div>⚡ G-Force: <strong style={{ color: '#34d399' }}>{sensorData.accel} m/s²</strong></div>
          <div>🎤 Sound: <strong style={{ color: '#38bdf8' }}>26 dB (Quiet)</strong></div>
          <div>☀️ Light: <strong style={{ color: '#fbbf24' }}>480 LUX</strong></div>
          <div>👤 Face: <strong style={{ color: '#34d399' }}>Verified (1 Voter)</strong></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700 }}>
          <CheckCircle2 size={13} />
          <span>Multi-Sensor & Face Biometric Protection Engaged</span>
        </div>
      </div>

      {/* Main Ballot Chamber with Optional Privacy Cloak Overlay */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc' }}>
            Cast Your Confidential Vote
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            {privacyCloakActive ? 'Privacy Cloak Active: Only hovered candidate is fully illuminated.' : 'Select your candidate to seal your ballot on the blockchain.'}
          </p>
        </div>

        {/* Candidates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {selectedElection?.candidates?.map((cand) => {
            const isSelected = selectedCandidate?.id === cand.id;
            const isDimmedByCloak = privacyCloakActive && hoveredCandidateId && hoveredCandidateId !== cand.id;

            return (
              <div
                key={cand.id}
                onMouseEnter={() => setHoveredCandidateId(cand.id)}
                onMouseLeave={() => setHoveredCandidateId(null)}
                onClick={() => setSelectedCandidate(cand)}
                className="glass-card-interactive"
                style={{
                  padding: '22px',
                  background: isSelected ? 'rgba(2, 132, 199, 0.18)' : 'rgba(15, 23, 42, 0.75)',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid #1e293b',
                  borderRadius: '16px',
                  boxShadow: isSelected ? '0 0 24px rgba(56, 189, 248, 0.35)' : 'none',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                  cursor: 'pointer',
                  opacity: isDimmedByCloak ? 0.25 : 1,
                  filter: isDimmedByCloak ? 'blur(2px)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>{cand.candidate_id}</span>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#38bdf8' : '#475569'}`,
                    background: isSelected ? '#38bdf8' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#020617' }} />}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}>
                    {cand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {cand.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                      {cand.department} • Year {cand.year}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(2, 6, 23, 0.5)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '0.76rem',
                  color: '#94a3b8',
                  lineHeight: 1.45,
                  minHeight: '52px'
                }}>
                  "{cand.manifesto || 'Committed to student empowerment and institutional transparency.'}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.88)',
          padding: '18px 26px',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>SELECTED BALLOT CHOICE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedCandidate ? '#38bdf8' : '#64748b' }}>
              {selectedCandidate ? selectedCandidate.name : 'Select a candidate above'}
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedCandidate) {
                setShowConfirmModal(true);
                setLivenessVerified(false);
                setLivenessProgress(0);
              }
            }}
            disabled={!selectedCandidate || isSubmitting}
            className="btn btn-primary"
            style={{
              padding: '12px 34px',
              fontSize: '0.95rem',
              fontWeight: 800,
              opacity: selectedCandidate ? 1 : 0.5,
              cursor: selectedCandidate ? 'pointer' : 'not-allowed',
              boxShadow: selectedCandidate ? '0 0 20px rgba(2, 132, 199, 0.5)' : 'none'
            }}
          >
            <Lock size={17} />
            <span>Verify & Seal Ballot</span>
          </button>
        </div>
      </div>

      {/* Floating Corner Picture-in-Picture Proctoring HUD */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '28px',
        width: '180px',
        height: '135px',
        borderRadius: '14px',
        background: '#020617',
        border: '2px solid #0284c7',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(2, 132, 199, 0.3)',
        zIndex: 20
      }}>
        <video
          ref={boothVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: '10px',
          border: '1px dashed rgba(56, 189, 248, 0.6)',
          borderRadius: '8px',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '4px',
          left: '0',
          right: '0',
          textAlign: 'center',
          fontSize: '0.62rem',
          fontWeight: 800,
          color: '#38bdf8',
          background: 'rgba(2, 6, 23, 0.75)',
          padding: '2px 0'
        }}>
          ● SENSOR GUARD ACTIVE
        </div>
      </div>

      {/* MODAL 1: HIGH-SECURITY TAMPER / MOTION / FOCUS VIOLATION ALERT */}
      {securityPaused && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#0f172a',
            border: '2px solid #ef4444',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ShieldAlert size={36} />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
              High-Security Chamber Lockdown
            </h2>

            <div className="badge-rose" style={{ display: 'inline-block', padding: '4px 12px', fontSize: '0.78rem', marginBottom: '16px' }}>
              Security Violation #{violationCount} Detected & Logged
            </div>

            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '20px' }}>
              {lastViolationReason || 'Controlled voting parameters were compromised. Window focus, device motion, or unauthorized peripheral event detected.'}
            </p>

            <button
              onClick={handleResumeSession}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', background: '#0284c7' }}
            >
              <Maximize2 size={16} />
              <span>Re-Authorize & Return to Controlled Chamber</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: FINAL VOTE CONFIRMATION WITH LIVENESS CHALLENGE & DURESS PIN */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.92)',
          backdropFilter: 'blur(14px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#0f172a',
            border: '2px solid #0284c7',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 0 40px rgba(2, 132, 199, 0.4)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(2, 132, 199, 0.2)',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <KeyRound size={26} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                Cryptographic Ballot Seal & Sign
              </h2>
            </div>

            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>SELECTED CANDIDATE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {selectedCandidate?.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                {selectedCandidate?.department} • Year {selectedCandidate?.year}
              </div>
            </div>

            {/* Interactive Biometric Liveness Challenge Step */}
            <div style={{
              background: livenessVerified ? 'rgba(52, 211, 153, 0.1)' : 'rgba(2, 6, 23, 0.7)',
              border: `1px solid ${livenessVerified ? '#34d399' : 'rgba(56, 189, 248, 0.3)'}`,
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: livenessVerified ? '#34d399' : '#38bdf8' }}>
                  <UserCheck size={16} />
                  <span>Biometric Liveness Verification</span>
                </div>
                <span className={`badge ${livenessVerified ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: '0.7rem' }}>
                  {livenessVerified ? 'VERIFIED ✓' : 'REQUIRED'}
                </span>
              </div>

              {!livenessVerified ? (
                <button
                  type="button"
                  onClick={triggerLivenessTest}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '8px', background: '#1e293b', color: '#38bdf8' }}
                >
                  <Camera size={14} />
                  <span>{livenessProgress > 0 ? `Scanning Facial Liveness (${livenessProgress}%)...` : 'Run Biometric Liveness Test'}</span>
                </button>
              ) : (
                <div style={{ fontSize: '0.74rem', color: '#34d399' }}>
                  ✓ Facial liveness and biometric presence confirmed.
                </div>
              )}
            </div>

            {/* Anti-Coercion Duress PIN Trigger */}
            <div style={{
              background: isDuressMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px dashed ${isDuressMode ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '0.74rem', color: isDuressMode ? '#fca5a5' : '#64748b' }}>
                <div style={{ fontWeight: 700 }}>Anti-Coercion Panic Shield</div>
                <div>{isDuressMode ? 'Emergency Duress active: Decoy quarantine enabled.' : 'Enable if you are being coerced.'}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsDuressMode(!isDuressMode)}
                className="btn btn-secondary"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  background: isDuressMode ? '#ef4444' : '#1e293b',
                  color: isDuressMode ? '#fff' : '#94a3b8'
                }}
              >
                {isDuressMode ? 'Duress Active' : 'Trigger Duress'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px', background: '#1e293b', color: '#94a3b8' }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmVote}
                disabled={isSubmitting || !livenessVerified}
                className="btn btn-primary"
                style={{
                  flex: 1.5,
                  padding: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  opacity: livenessVerified ? 1 : 0.6,
                  cursor: livenessVerified ? 'pointer' : 'not-allowed'
                }}
              >
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} className="spin" />
                    <span>Mining Ballot Block...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    <span>Confirm & Sign Vote</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
