import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Radio,
  Clock,
  Sparkles,
  Info,
  Play,
  RotateCw,
  Award,
  Zap,
  KeyRound,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentPracticeBooth() {
  const { user } = useAuth();

  const [sandboxStep, setSandboxStep] = useState(1); // 1: Environment Readiness, 2: Anti-Tamper Test, 3: Interactive Mock Ballot, 4: Encrypted Receipt
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [simulatedViolation, setSimulatedViolation] = useState(null);
  const [mockToken, setMockToken] = useState('0xTOKEN-SANDBOX-DEMO');
  const [mockReceipt, setMockReceipt] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const mockCandidates = [
    { id: 1, name: 'Priya Sharma', symbol: '★', symbolName: 'Beacon of Innovation', position: 'Class Representative', dept: user?.department || 'Information Technology', sec: user?.section || 'A' },
    { id: 2, name: 'Karthik Raja', symbol: '⚡', symbolName: 'Spark of Progress', position: 'Class Representative', dept: user?.department || 'Information Technology', sec: user?.section || 'A' },
    { id: 3, name: 'Ananya Iyer', symbol: '🚀', symbolName: 'Vanguard Rocket', position: 'Class Representative', dept: user?.department || 'Information Technology', sec: user?.section || 'A' },
    { id: 4, name: 'NOTA (None of the Above)', symbol: '⚪', symbolName: 'Formal Dissent', position: 'Class Representative', dept: 'All', sec: 'All' }
  ];

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 400, height: 300, facingMode: 'user' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      }
    } catch (e) {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleSimulateTamper = (type) => {
    if (type === 'TAB_SWITCH') {
      setSimulatedViolation('Window Focus Lost: The voting session detected an attempt to navigate away or open inspect tools.');
    } else if (type === 'MULTI_FACE') {
      setSimulatedViolation('Multiple Faces Detected: Camera AI identified another individual looking over the voter screen.');
    }
  };

  const handleCastMockVote = () => {
    if (!selectedCandidateId) return;
    const cand = mockCandidates.find(c => c.id === selectedCandidateId);
    setMockReceipt({
      candidateName: cand.name,
      symbol: cand.symbol,
      anonymousVoteId: 'ZK-' + Math.floor(100000 + Math.random() * 900000),
      voteHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockNumber: 42,
      timestamp: new Date().toLocaleTimeString(),
      zkProof: 'Verified SHA-3-256 + Ed25519 signature'
    });
    setSandboxStep(4);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1.5px solid rgba(79, 70, 229, 0.25)',
          borderRadius: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4f46e5', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              <Sparkles size={15} />
              <span>Voter Training &amp; Sandbox Simulator</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Proctored Ballot Practice Sandbox
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
              Test drive the controlled chamber proctoring, anti-tamper safeguards, and zero-knowledge receipts in a safe, risk-free sandbox before casting your official ballot.
            </p>
          </div>

          <Link
            to="/student/voting-session"
            className="btn btn-primary"
            style={{ fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Vote size={16} />
            <span>Enter Real Polling Chamber</span>
          </Link>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[
          { step: 1, title: '1. Camera & HUD Check' },
          { step: 2, title: '2. Anti-Tamper Tests' },
          { step: 3, title: '3. Practice Voting' },
          { step: 4, title: '4. Cryptographic Proof' }
        ].map(item => (
          <button
            key={item.step}
            type="button"
            onClick={() => setSandboxStep(item.step)}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: sandboxStep === item.step ? '2px solid #4f46e5' : '1px solid #e2e8f0',
              background: sandboxStep === item.step ? '#eef2ff' : '#ffffff',
              color: sandboxStep === item.step ? '#4f46e5' : '#64748b',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* STEP 1: Camera & HUD Check */}
      {sandboxStep === 1 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#4f46e5" />
            <span>Proctored Camera &amp; AI Liveness Verification</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '20px' }}>
            During the official voting session, our continuous client-side AI monitor ensures only you are present in the voting booth. Test your camera below.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '260px',
              borderRadius: '16px',
              background: '#090d16',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* HUD Overlay */}
                  <div style={{ position: 'absolute', inset: '20px', border: '2px solid rgba(56, 189, 248, 0.4)', borderRadius: '12px', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(16, 185, 129, 0.8)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                    ● LIVE PROCTOR HUD ACTIVE
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <Camera size={44} style={{ margin: '0 auto 8px', color: '#6366f1' }} />
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>Camera Standby</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Click to test live proctor stream</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Privacy Guarantee:</span>
                  <strong style={{ color: '#059669' }}>Local Client AI Only (No Raw Stream Saved)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Face Confidence:</span>
                  <strong style={{ color: '#0284c7' }}>99.2% Facial Alignment</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Lighting &amp; Head Pose:</span>
                  <strong style={{ color: '#059669' }}>Optimal &amp; Balanced</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {cameraActive ? (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Turn Off Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Start Camera Test
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSandboxStep(2)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Next: Tamper Tests &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Anti-Tamper Tests */}
      {sandboxStep === 2 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#d97706" />
            <span>Anti-Tamper &amp; Session Guard Simulator</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '20px' }}>
            During the real vote, student voting sessions enforce proctored fullscreen rules. Click the buttons below to see how violations are flagged and resolved.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => handleSimulateTamper('TAB_SWITCH')}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #fed7aa',
                background: '#fffaf0',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: 800, color: '#c2410c', fontSize: '0.9rem', marginBottom: '4px' }}>
                Simulate Window Defocus (Alt+Tab)
              </div>
              <div style={{ fontSize: '0.76rem', color: '#9a3412', lineHeight: 1.4 }}>
                Tests what happens when a student opens developer tools or switches browser tabs.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateTamper('MULTI_FACE')}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #fed7aa',
                background: '#fffaf0',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: 800, color: '#c2410c', fontSize: '0.9rem', marginBottom: '4px' }}>
                Simulate Multiple Faces
              </div>
              <div style={{ fontSize: '0.76rem', color: '#9a3412', lineHeight: 1.4 }}>
                Tests what happens when an onlooker peeks into the voting booth.
              </div>
            </button>
          </div>

          {/* Simulation Output */}
          {simulatedViolation && (
            <div style={{ padding: '16px 20px', borderRadius: '14px', background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#991b1b', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.88rem', marginBottom: '4px' }}>
                <AlertTriangle size={18} />
                <span>Simulation Violation Triggered</span>
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                {simulatedViolation}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#7f1d1d' }}>
                <strong>How it is handled in live session:</strong> Voting screen is momentarily blurred with a warning dialog. 3 cumulative violations lock the chamber session.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setSandboxStep(1)}
              className="btn btn-secondary"
              style={{ padding: '10px 18px' }}
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setSandboxStep(3)}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              Next: Practice Mock Ballot &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Interactive Mock Ballot */}
      {sandboxStep === 3 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Vote size={20} color="#0284c7" />
            <span>Interactive Sandbox Ballot (No Actual Votes Recorded)</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '20px' }}>
            Click on any mock candidate to practice selecting your choice and experiencing the cryptographic sealing workflow.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {mockCandidates.map(c => {
              const isSelected = selectedCandidateId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0f9ff' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: isSelected ? '#0284c7' : '#e2e8f0',
                      color: isSelected ? '#ffffff' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {c.symbol}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {c.name}
                      </h4>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {c.symbolName} &middot; Section {c.sec} ({c.dept})
                      </div>
                    </div>
                  </div>

                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? '7px solid #0284c7' : '2px solid #cbd5e1',
                    background: '#ffffff'
                  }} />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setSandboxStep(2)}
              className="btn btn-secondary"
              style={{ padding: '10px 18px' }}
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleCastMockVote}
              disabled={!selectedCandidateId}
              className="btn btn-primary"
              style={{ padding: '11px 26px', fontWeight: 900 }}
            >
              Simulate Casting Encrypted Vote &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Encrypted Receipt */}
      {sandboxStep === 4 && mockReceipt && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #86efac' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Mock Cryptographic Receipt Generated!
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
              In the real election, your vote is recorded identically with zero identity linkage.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Simulated Choice:</span>
              <strong style={{ color: '#0f172a' }}>{mockReceipt.candidateName} {mockReceipt.symbol}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Anonymous Vote ID:</span>
              <strong style={{ fontFamily: 'monospace', color: '#0284c7' }}>{mockReceipt.anonymousVoteId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>SHA-256 Ledger Hash:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#334155' }}>{mockReceipt.voteHash.slice(0, 32)}...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Zero-Knowledge Seal:</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>{mockReceipt.zkProof}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setSandboxStep(1);
                setSelectedCandidateId(null);
                setMockReceipt(null);
              }}
              className="btn btn-secondary"
              style={{ padding: '10px 20px' }}
            >
              Restart Practice Simulation
            </button>
            <Link
              to="/student/voting-session"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontWeight: 800 }}
            >
              Enter Official Voting Chamber
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentPracticeBooth;
