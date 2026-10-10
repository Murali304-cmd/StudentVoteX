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
  ScanFace
} from 'lucide-react';

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
          video: { width: 320, height: 240, facingMode: 'user' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      setEnrollError('Unable to access webcam. Please check camera permissions.');
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
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const dataUri = canvas.toDataURL('image/jpeg', 0.85);
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
      setEnrollSuccess(res.message || 'Face biometrics stored successfully! You are ready for EVM & Web voting.');
      if (refreshUser) await refreshUser();
    } catch (err) {
      setEnrollError(err.message || 'Failed to save biometric facial data.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Student Voter Profile & Biometrics
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Official student credentials, facial biometric registry, and institutional identity records on ABC Institution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Profile & Face Enrollment Card */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
            {capturedImage || user?.profile_photo ? (
              <img
                src={capturedImage || user?.profile_photo}
                alt="Student Face Profile"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '3px solid #0284c7',
                  boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)'
                }}
              />
            ) : (
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)'
              }}>
                {user?.full_name?.charAt(0) || 'S'}
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: '#10b981',
              color: '#fff',
              borderRadius: '50%',
              padding: '4px',
              border: '2px solid #fff'
            }} title="Biometric Registry Enabled">
              <ShieldCheck size={14} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {user?.full_name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Student ID: <strong>{user?.student_id}</strong>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <span className="badge badge-indigo">{user?.department}</span>
            <span className={`badge ${user?.verification_status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'}`}>
              {user?.verification_status}
            </span>
          </div>

          {/* Biometric Face Capture Actions */}
          <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ScanFace size={15} color="#0284c7" />
                Biometric Face Registry
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: (capturedImage || user?.profile_photo) ? '#10b981' : '#f59e0b' }}>
                {(capturedImage || user?.profile_photo) ? '✓ STORED' : 'NOT STORED'}
              </span>
            </div>

            {enrollSuccess && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.74rem', padding: '6px 8px', borderRadius: '6px', marginBottom: '10px' }}>
                {enrollSuccess}
              </div>
            )}
            {enrollError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.74rem', padding: '6px 8px', borderRadius: '6px', marginBottom: '10px' }}>
                {enrollError}
              </div>
            )}

            {cameraOpen ? (
              <div style={{ marginBottom: '10px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '140px', borderRadius: '8px', objectFit: 'cover', background: '#000', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.74rem', padding: '6px 8px' }}
                  >
                    📸 Capture Face
                  </button>
                  <button
                    type="button"
                    onClick={handleStopCamera}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.74rem', padding: '6px 8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Camera size={14} />
                  <span>{capturedImage ? 'Retake Face Snapshot' : 'Open Camera & Capture Face'}</span>
                </button>

                {capturedImage && capturedImage !== user?.profile_photo && (
                  <button
                    type="button"
                    disabled={enrolling}
                    onClick={handleSaveFaceBiometrics}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px' }}
                  >
                    {enrolling ? 'Saving to Database...' : '💾 Save Stored Biometric Face'}
                  </button>
                )}
              </div>
            )}
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
              Your facial template is matched in real-time when voting via EVM kiosk or Web polling booth.
            </p>
          </div>
        </div>

        {/* Right Details Grid */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
            Academic & Verification Metadata
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Academic Department</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.department}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Academic Year & Section</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>Year {user?.year} • Section {user?.section}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Institutional Email</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.email || `${user?.student_id?.toLowerCase()}@abcinstitution.edu`}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Smart ID Card</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.id_card_number || `ABC-ID-${user?.student_id}`}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Voting Eligibility Status</div>
              <div style={{ fontWeight: 600, color: 'var(--emerald-primary)', marginTop: '4px' }}>✓ {user?.eligibility}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Biometric Verification Ready</div>
              <div style={{ fontWeight: 600, color: (capturedImage || user?.profile_photo) ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                {(capturedImage || user?.profile_photo) ? '✓ Face Enrolled for EVM & Web' : 'Pending Camera Snapshot'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
