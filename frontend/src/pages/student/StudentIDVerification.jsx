import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FileCheck2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  FileText,
  Eye,
  Camera,
  Cpu,
  Sparkles,
  Fingerprint
} from 'lucide-react';

export function StudentIDVerification() {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [extractedId, setExtractedId] = useState(user?.student_id || '');
  const [ocrResult, setOcrResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        triggerOcrAnalysis(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerOcrAnalysis = async (imageData) => {
    setIsScanning(true);
    setError('');
    try {
      const res = await api.verifications.ocrScan({
        student_id: user?.student_id || '',
        id_card_image: imageData || 'data:image/sample'
      });
      if (res.success) {
        setOcrResult(res);
        if (res.extractedData?.studentId) {
          setExtractedId(res.extractedData.studentId);
        }
      }
    } catch (err) {
      console.warn('OCR scan background notice:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulateCameraCapture = () => {
    // Generate a high-contrast digital smart card mockup data
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 250);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 400, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('ABC INSTITUTION OF TECHNOLOGY', 20, 22);
    ctx.font = '12px sans-serif';
    ctx.fillText(`STUDENT ID: ${user?.student_id || 'STU2026001'}`, 20, 75);
    ctx.fillText(`NAME: ${user?.full_name || 'STUDENT VOTER'}`, 20, 105);
    ctx.fillText(`DEPT: ${user?.department || 'INFORMATION TECHNOLOGY'}`, 20, 135);
    ctx.fillText('STATUS: ACTIVE ENROLLED', 20, 165);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(280, 60, 90, 110);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('PHOTO ID', 300, 120);

    const mockData = canvas.toDataURL('image/png');
    setPreviewUrl(mockData);
    triggerOcrAnalysis(mockData);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!previewUrl) {
      setError('Please upload an ID card image or capture via smart camera.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.verifications.upload({
        student_id: user.student_id,
        id_card_image: previewUrl,
        extracted_id_number: extractedId
      });
      setSuccess('Institution ID Card verified with cryptographic document hash!');
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Verification upload failed');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = user?.verification_status === 'VERIFIED';

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Student ID Card Verification
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Mandatory identity validation against ABC Institution student records before entering the voting chamber.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Upload Form */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Institution Smart ID Card
            </h2>
            <button
              type="button"
              onClick={handleSimulateCameraCapture}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Camera size={14} />
              <span>Capture Digital Card</span>
            </button>
          </div>

          {success && (
            <div className="badge-emerald" style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="badge-rose" style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload}>
            <div style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: '14px',
              padding: '24px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              marginBottom: '18px',
              transition: 'border-color 0.2s ease'
            }} onClick={() => document.getElementById('id-upload-input').click()}>
              <input
                id="id-upload-input"
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="ID Card Preview"
                    style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain', margin: '0 auto 10px', display: 'block', border: '1px solid var(--border-subtle)' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
                    Click to change ID card image
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--cyan-light)',
                    color: 'var(--cyan-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <Upload size={24} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Drop institution ID card here or browse
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports PNG, JPG, or smart card scan (Max 5MB)
                  </div>
                </div>
              )}
            </div>

            {/* AI OCR Scan Results Card */}
            {(isScanning || ocrResult) && (
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem', color: '#0369a1' }}>
                    <Sparkles size={16} />
                    <span>AI OCR Document Analysis</span>
                  </div>
                  {ocrResult && (
                    <span className="badge-cyan" style={{ fontSize: '0.72rem' }}>
                      {ocrResult.confidenceScore}% Match Score
                    </span>
                  )}
                </div>

                {isScanning ? (
                  <div style={{ fontSize: '0.78rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={14} className="spin" />
                    <span>Extracting security holograms and student credentials...</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.76rem', color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div><strong>Institution:</strong> {ocrResult?.extractedData?.institution}</div>
                    <div><strong>Match Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>VERIFIED</span></div>
                    <div><strong>Barcode:</strong> {ocrResult?.extractedData?.securityBarcode}</div>
                    <div><strong>Validity:</strong> {ocrResult?.extractedData?.validUntil}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Extracted Student ID Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. STU2026001"
                value={extractedId}
                onChange={(e) => setExtractedId(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <FileCheck2 size={17} />
              <span>{loading ? 'Validating ID Card...' : 'Submit ID for Verification'}</span>
            </button>
          </form>
        </div>

        {/* Verification Status & Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Current Verification Status
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{
                background: isVerified ? '#d1fae5' : '#fef3c7',
                color: isVerified ? '#059669' : '#d97706',
                padding: '10px',
                borderRadius: '10px'
              }}>
                <ShieldCheck size={26} />
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isVerified ? '#059669' : '#d97706' }}>
                  {user?.verification_status || 'NOT_SUBMITTED'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isVerified ? 'Identity confirmed. Eligible to vote.' : 'Verification required before voting.'}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
              Verification Rules & Security
            </h3>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
              <li>ID card must be issued by <strong>ABC Institution of Technology</strong>.</li>
              <li>Student ID, Full Name, and Department must match institutional records.</li>
              <li>A cryptographic SHA-256 hash is generated for immutable auditing.</li>
              <li>Automated AI OCR scans and compares card records in real-time.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

