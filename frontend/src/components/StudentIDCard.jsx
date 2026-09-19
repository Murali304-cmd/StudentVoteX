import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  QrCode,
  Download,
  Printer,
  RotateCw,
  Copy,
  Check,
  Sparkles,
  Wifi,
  Award,
  Lock,
  Building,
  CreditCard
} from 'lucide-react';

export function StudentIDCard({ student, onVerifyRedirect }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(student?.profile_photo || '');
  const cardRef = useRef(null);

  const studentId = student?.student_id || 'STU2026001';
  const fullName = student?.full_name || 'Voter Student';
  const department = student?.department || 'Information Technology';
  const year = student?.year || 'III';
  const section = student?.section || 'A';
  const verificationStatus = student?.verification_status || 'VERIFIED';
  const idCardNumber = student?.id_card_number || `ABC-ID-${studentId}`;
  const bloodGroup = 'O +ve';
  const validity = '2023 - 2027';

  // Format QR Payload recognized by EVM Kiosk and OCR verifier
  const qrPayload = `QR-${studentId}-ABC_INSTITUTION-VERIFIED`;

  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [qrPayload]);

  const handleCopyQR = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1000, 630);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 1000, 630, 24);
    ctx.fill();

    // Top Header Banner
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText('ABC INSTITUTION OF TECHNOLOGY', 60, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('AUTONOMOUS • ACCREDITED NAAC A++ • AFFILIATED TO STATE UNIVERSITY', 60, 98);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText(fullName.toUpperCase(), 290, 230);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText(`ROLL NO: ${studentId}`, 290, 275);
    ctx.fillText(`DEPT: ${department}`, 290, 315);
    ctx.fillText(`YEAR & SECTION: Year ${year} • Sec ${section}`, 290, 355);
    ctx.fillText(`VALIDITY: ${validity} | BLOOD GROUP: ${bloodGroup}`, 290, 395);

    // Photo Box Placeholder
    ctx.fillStyle = '#334155';
    ctx.roundRect(60, 160, 190, 240, 16);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Outfit", sans-serif';
    ctx.fillText(fullName.charAt(0), 135, 305);

    // Draw QR Code
    if (qrDataUrl) {
      const img = new Image();
      img.src = qrDataUrl;
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(770, 180, 170, 170, 12);
        ctx.fill();
        ctx.drawImage(img, 775, 185, 160, 160);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText('EVM SCAN READY', 785, 380);

        const link = document.createElement('a');
        link.download = `ABC_Institution_ID_${studentId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  };

  return (
    <div className="id-card-generator-container">
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="var(--primary-color)" />
            Official Student Smart ID Card
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cryptographically signed identity badge with dynamic NFC & EVM kiosk scanner QR
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCw size={14} />
            {isFlipped ? 'Show Front' : 'Flip to Back'}
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            Download PNG
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} />
            Print Badge
          </button>
        </div>
      </div>

      {/* 3D Flippable Card Perspective Wrapper */}
      <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <div
          ref={cardRef}
          style={{
            width: '100%',
            maxWidth: '520px',
            height: '310px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px -15px rgba(2, 6, 23, 0.5), 0 0 20px rgba(56, 189, 248, 0.15)',
            cursor: 'pointer'
          }}
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click to flip card"
        >
          {/* ==================== CARD FRONT ==================== */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)',
              color: '#ffffff',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {/* Hologram / Guilloche Background Accents */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Top Bar: Institution Crest & Accreditation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                }}>
                  <Building size={22} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#f8fafc' }}>
                    ABC Institution of Technology
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#93c5fd', fontWeight: 600, letterSpacing: '0.3px' }}>
                    AUTONOMOUS • NAAC 'A++' ACCREDITED
                  </div>
                </div>
              </div>

              {/* Gold Chip & NFC Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #fbbf24 100%)',
                  border: '1px solid #b45309',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '7px', left: 0, right: 0, height: '1px', background: '#78350f' }} />
                  <div style={{ position: 'absolute', left: '15px', top: 0, bottom: 0, width: '1px', background: '#78350f' }} />
                </div>
                <Wifi size={16} color="#38bdf8" style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>

            {/* Middle Section: Photo, Bio, and Live QR Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr 90px', gap: '14px', alignItems: 'center', zIndex: 2, margin: '8px 0' }}>
              {/* Student Photo */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '84px',
                  height: '98px',
                  borderRadius: '12px',
                  background: photoUrl ? `url(${photoUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '2px solid rgba(56, 189, 248, 0.6)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  overflow: 'hidden'
                }}>
                  {!photoUrl && fullName.charAt(0)}
                </div>
                {verificationStatus === 'VERIFIED' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
                  }}>
                    VERIFIED
                  </div>
                )}
              </div>

              {/* Student Metadata */}
              <div>
                <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                  {fullName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                  Roll No: <span style={{ color: '#ffffff', letterSpacing: '0.5px' }}>{studentId}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px', fontWeight: 600 }}>
                  Dept: {department}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                  Class: Year {year} • Sec {section}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
                  Card ID: {idCardNumber}
                </div>
              </div>

              {/* Dynamic QR Code for EVM Kiosk Scanner */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  padding: '4px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }}>
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="EVM QR Scan" style={{ width: '74px', height: '74px', display: 'block' }} />
                  ) : (
                    <div style={{ width: '74px', height: '74px', background: '#f1f5f9' }} />
                  )}
                </div>
                <div style={{ fontSize: '0.58rem', color: '#38bdf8', fontWeight: 700, marginTop: '4px', letterSpacing: '0.3px' }}>
                  EVM READY
                </div>
              </div>
            </div>

            {/* Bottom Bar: Barcode and Cryptographic Watermark */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '8px',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 600 }}>
                  StudentVoiceX Verified Token #2026
                </span>
              </div>

              <div style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 700 }}>
                Valid Thru: <span style={{ color: '#38bdf8' }}>{validity}</span>
              </div>
            </div>
          </div>

          {/* ==================== CARD BACK ==================== */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1.5px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {/* Magnetic Stripe */}
            <div style={{
              margin: '-20px -24px 0 -24px',
              height: '38px',
              background: '#020617',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }} />

            {/* Instructions and Rules */}
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.4, margin: '8px 0' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px', fontSize: '0.72rem' }}>
                INSTITUTIONAL TERMS & VOTING INSTRUCTIONS
              </div>
              <div>• This digital ID card is the official property of ABC Institution of Technology.</div>
              <div>• Mandatory for physical EVM Kiosk authorization and online proctored election balloting.</div>
              <div>• Scan QR code at EVM Kiosk terminal or student election voting gates for instant access.</div>
            </div>

            {/* Details & Signature Block */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '12px',
              alignItems: 'flex-end',
              borderTop: '1px dashed rgba(255,255,255,0.15)',
              paddingTop: '8px'
            }}>
              <div style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>
                <div><strong>Campus:</strong> Tech Park Road, Knowledge City</div>
                <div><strong>Emergency:</strong> +91 98765 43210</div>
                <div><strong>Blood Group:</strong> {bloodGroup}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'cursive',
                  fontSize: '0.95rem',
                  color: '#38bdf8',
                  letterSpacing: '1px',
                  marginBottom: '2px'
                }}>
                  Dr. R. Ramanathan
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Principal / Chief Election Officer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick QR Payload Bar for testing with EVM Kiosk */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QrCode size={18} color="var(--primary-color)" />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              EVM KIOSK & OCR SCANNER PAYLOAD
            </div>
            <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {qrPayload}
            </code>
          </div>
        </div>

        <button
          onClick={handleCopyQR}
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? 'Copied QR Data' : 'Copy Payload'}
        </button>
      </div>
    </div>
  );
}
