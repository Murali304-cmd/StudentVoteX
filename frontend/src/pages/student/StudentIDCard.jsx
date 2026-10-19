import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Download,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Building2,
  User,
  Award,
  Sparkles,
  RotateCw,
  Copy,
  ExternalLink,
  Printer,
  Check,
  Cpu,
  Layers,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentIDCard() {
  const { user } = useAuth();
  const { institutionName, shortName } = useInstitution();
  const cardRef = useRef(null);

  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const studentId = user?.student_id || user?.roll_number || '7678BIT001';
  const rollNo = user?.roll_number || user?.student_id || '7678BIT001';
  const dept = user?.department || 'Information Technology';
  const sec = user?.section || 'A';
  const yr = user?.year || 'III';
  const fullName = user?.full_name || 'Student Voter';
  const idHash = user?.id_card_hash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  useEffect(() => {
    // Generate QR code for ID card verification
    const instPrefix = (shortName || 'ABC').toUpperCase();
    const verifyPayload = `${instPrefix}-VERIFY:${studentId}:${rollNo}:${sec}`;
    QRCode.toDataURL(verifyPayload, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [studentId, rollNo, sec, shortName]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(studentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(idHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            <QrCode size={15} />
            <span>Digital Smart Credential</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Collegiate Smart Identity Card
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Official cryptographic identity token issued by {institutionName || 'ABC Institution'} for Section {sec} voting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            <RotateCw size={15} />
            <span>{isFlipped ? 'Show Front Side' : 'Flip to Back Side'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 3D Flippable Smart ID Card Container */}
      <div style={{ perspective: '1200px', margin: '10px auto', width: '100%', maxWidth: '540px' }}>
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click to flip card"
          style={{
            position: 'relative',
            width: '100%',
            height: '340px',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer'
          }}
        >
          {/* ================= CARD FRONT ================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '24px',
              padding: '24px',
              background: 'linear-gradient(135deg, #091e3a 0%, #0c2d58 50%, #0369a1 100%)',
              color: '#ffffff',
              boxShadow: '0 24px 48px -12px rgba(2, 132, 199, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}
          >
            {/* Holographic Sheen & Watermark */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Top Bar: Institution Emblem & Verified Chip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}>
                  {(shortName || 'ABC').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.12em', color: '#7dd3fc', textTransform: 'uppercase' }}>
                    {(institutionName || 'ABC INSTITUTION OF TECHNOLOGY').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#ffffff' }}>
                    STUDENT IDENTITY CARD
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#6ee7b7',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <ShieldCheck size={12} />
                <span>SEC-{sec} VERIFIED</span>
              </div>
            </div>

            {/* Middle Section: Photo & Student Credentials */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              {/* Photo Box */}
              <div style={{
                width: '90px',
                height: '110px',
                borderRadius: '14px',
                background: user?.profile_photo ? `url(${user.profile_photo}) center/cover no-repeat` : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}>
                {!user?.profile_photo && (
                  <>
                    <User size={34} color="#94a3b8" />
                    <span style={{ fontSize: '0.6rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 700 }}>
                      PHOTO
                    </span>
                  </>
                )}
              </div>

              {/* Student Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {fullName}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    Roll: <span style={{ fontFamily: 'monospace' }}>{rollNo}</span>
                  </span>
                  <span style={{ background: '#0284c7', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    Section {sec}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    Year {yr}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#bae6fd', fontWeight: 600, marginTop: '2px' }}>
                  {dept}
                </div>

                <div style={{ fontSize: '0.68rem', color: '#7dd3fc', marginTop: '2px' }}>
                  ID: <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{studentId}</span> &middot; Valid: 2022 &ndash; 2026
                </div>
              </div>

              {/* Smart Microchip Visual */}
              <div style={{
                width: '42px',
                height: '34px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)',
                border: '1px solid #facc15',
                position: 'relative',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                flexShrink: 0
              }}>
                <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Bottom Bar: Barcode Graphic */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' }}>
              <div>
                <div style={{
                  height: '24px',
                  width: '180px',
                  background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 2px, transparent 2px, transparent 4px, #ffffff 4px, #ffffff 7px, transparent 7px, transparent 9px)',
                  opacity: 0.8
                }} />
                <div style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: '#94a3b8', letterSpacing: '0.1em', marginTop: '2px' }}>
                  *{studentId}*
                </div>
              </div>

              <div style={{ fontSize: '0.64rem', color: '#94a3b8', textAlign: 'right' }}>
                <div>Click to view reverse side</div>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '24px',
              padding: '20px 24px',
              background: '#0f172a',
              color: '#ffffff',
              boxShadow: '0 24px 48px -12px rgba(2, 132, 199, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Magnetic Stripe */}
            <div style={{
              margin: '-20px -24px 14px -24px',
              height: '42px',
              background: '#020617',
              borderBottom: '1px solid #1e293b'
            }} />

            {/* Content Body */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Institutional Security Terms
                </div>
                <div>1. This card certifies active enrollment in Section {sec}.</div>
                <div>2. Non-transferable cryptographic voting credential.</div>
                <div>3. QR code verifies authenticity on campus ledger.</div>
                
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.66rem', color: '#64748b' }}>SHA-256 Tamper Hash:</span>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.64rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                    {idHash.slice(0, 36)}...
                  </div>
                </div>
              </div>

              {/* Scannable Verification QR Code */}
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '12px', flexShrink: 0 }}>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Verify QR" style={{ width: '90px', height: '90px', display: 'block' }} />
                ) : (
                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={40} color="#0f172a" />
                  </div>
                )}
                <div style={{ textAlign: 'center', fontSize: '0.55rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  SCAN TO VERIFY
                </div>
              </div>
            </div>

            {/* Registrar Signature Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Emergency Verification Hotline</div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>+91 (044) 2741-7000 &middot; sec-{sec.toLowerCase()}@{(shortName || 'abc').toLowerCase()}.edu</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', fontFamily: 'serif', fontStyle: 'italic', color: '#e2e8f0', letterSpacing: '0.05em' }}>
                  Dr. K. R. Rangarajan
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Registrar &middot; {institutionName || 'ABC Institution'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Copy IDs */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Identifier Clipboards
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Student Roll Number</div>
                <strong style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}>{studentId}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {copiedId ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID Document Hash</div>
                <strong style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#0284c7' }}>
                  {idHash.slice(0, 14)}...
                </strong>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {copiedHash ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Verifier Testing */}
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Public Blockchain Verifier
            </span>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: '6px 0 0 0', lineHeight: 1.4 }}>
              Verify this identity credential against the live zero-knowledge Merkle tree to confirm enrollment in Section {sec}.
            </p>
          </div>

          <Link
            to={`/verify?studentId=${encodeURIComponent(studentId)}`}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.82rem', padding: '9px 12px' }}
          >
            <ExternalLink size={15} />
            <span>Test Public QR Verifier</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default StudentIDCard;
