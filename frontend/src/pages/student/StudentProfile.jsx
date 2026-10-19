import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  User,
  Building2,
  FileCheck2,
  ShieldCheck,
  KeyRound,
  Phone,
  Mail,
  Calendar,
  Layers,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ScanFace,
  Award,
  BadgeCheck,
  Lock,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentProfile() {
  const { user, refreshUser } = useAuth();
  
  // Face Enrollment State
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(user?.profile_photo || null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera
  const handleStartCamera = async () => {
    setEnrollError('');
    setEnrollSuccess('');
    setCameraOpen(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 400, height: 320, facingMode: 'user' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      setEnrollError('Unable to access webcam. Please verify browser camera permissions.');
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 400, 320);
    const dataUri = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUri);
    handleStopCamera();
  };

  const handleSaveFaceBiometrics = async () => {
    if (!capturedImage) {
      setEnrollError('Please capture your facial snapshot first.');
      return;
    }

    setEnrolling(true);
    setEnrollError('');
    setEnrollSuccess('');

    try {
      const res = await api.verifications.enrollFace(user.student_id, capturedImage);
      setEnrollSuccess(res.message || 'Facial biometrics stored successfully! You are cleared for Controlled Chamber & EVM voting.');
      if (refreshUser) await refreshUser();
    } catch (err) {
      setEnrollError(err.message || 'Failed to save biometric facial data.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.25)',
          borderRadius: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '18px',
            background: capturedImage ? `url(${capturedImage}) center/cover no-repeat` : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
            flexShrink: 0
          }}>
            {!capturedImage && (user?.full_name?.charAt(0) || 'S')}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={12} />
                <span>{user?.department || 'Information Technology'}</span>
              </span>
              <span className="badge badge-cyan" style={{ fontWeight: 800 }}>
                Section {user?.section || 'A'} &middot; Year {user?.year || 'III'}
              </span>
              <span className="badge badge-emerald">
                {user?.verification_status === 'VERIFIED' ? '✓ Smart Card Verified' : 'Verification In Progress'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {user?.full_name || 'Student Voter'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              Roll Number: <strong>{user?.roll_number || '2026IT001'}</strong> &middot; Student ID: <strong>{user?.student_id || 'STU2026001'}</strong>
            </p>
          </div>

          <Link
            to="/student/id"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <Award size={15} />
            <span>Digital ID Card</span>
          </Link>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
        
        {/* Left Column: Academic Credentials & Eligibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Academic Details Card */}
          <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#0284c7" />
              <span>Academic Enrollment &amp; Section Roster</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Assigned Section:</span>
                <strong style={{ color: '#0284c7' }}>Section {user?.section || 'A'} (Class of 2026)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Academic Department:</span>
                <strong style={{ color: '#0f172a' }}>{user?.department || 'Information Technology'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Current Semester / Year:</span>
                <strong style={{ color: '#0f172a' }}>Year {user?.year || 'III'} &middot; Semester VI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Institutional Email:</span>
                <span style={{ color: '#334155', fontFamily: 'monospace' }}>{user?.email || `${(user?.student_id || 'stu').toLowerCase()}@abc.edu`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Assigned EVM Kiosk:</span>
                <strong style={{ color: '#059669' }}>Booth-{user?.section || 'A'} &middot; Tech Block Hall 201</strong>
              </div>
            </div>
          </div>

          {/* Academic Eligibility Indicators */}
          <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeCheck size={18} color="#059669" />
              <span>Collegiate Voting Eligibility Status</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CGPA SCORE</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                  {user?.cgpa || 8.5}
                </div>
                <span style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 800 }}>&ge; 7.0 Req</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>ATTENDANCE</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                  {user?.attendance || 85}%
                </div>
                <span style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 800 }}>&ge; 75% Req</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DISCIPLINE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
                  CLEAR
                </div>
                <span style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 800 }}>No Infractions</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Biometric Facial Registry Studio */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ScanFace size={18} color="#0284c7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Biometric Facial Snapshot Registry
                </h3>
              </div>
              <span className={`badge ${capturedImage ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                {capturedImage ? 'Biometrics Active' : 'Snapshot Required'}
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Required for the proctored controlled chamber and EVM terminal facial verification.
            </p>

            {/* Camera / Photo Display Frame */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              borderRadius: '16px',
              background: '#090d16',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e2e8f0'
            }}>
              {cameraOpen ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Facial Oval Alignment HUD */}
                  <div style={{
                    position: 'absolute',
                    width: '140px',
                    height: '180px',
                    border: '2px dashed #38bdf8',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.74rem', color: '#f8fafc', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: '6px' }}>
                    Align face inside oval
                  </div>
                </>
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Biometric Snapshot"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  <User size={48} style={{ margin: '0 auto 8px', color: '#475569' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                    No Face Snapshot Recorded
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    Click button below to open webcam and capture photo
                  </div>
                </div>
              )}
            </div>

            {/* Error / Success Alerts */}
            {enrollSuccess && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', marginTop: '12px' }}>
                {enrollSuccess}
              </div>
            )}
            {enrollError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', marginTop: '12px' }}>
                {enrollError}
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {cameraOpen ? (
              <>
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.84rem', justifyContent: 'center' }}
                >
                  <Camera size={16} />
                  <span>Take Snapshot</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="btn btn-secondary"
                  style={{ padding: '11px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.84rem', justifyContent: 'center' }}
                >
                  <Camera size={16} />
                  <span>{capturedImage ? 'Retake Live Photo' : 'Open Webcam'}</span>
                </button>

                {capturedImage && (
                  <button
                    type="button"
                    onClick={handleSaveFaceBiometrics}
                    disabled={enrolling}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '11px', fontSize: '0.84rem', justifyContent: 'center' }}
                  >
                    <Sparkles size={16} />
                    <span>{enrolling ? 'Saving Hash...' : 'Save & Register Face'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default StudentProfile;
