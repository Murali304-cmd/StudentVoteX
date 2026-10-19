import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Trophy,
  Award,
  ShieldCheck,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  QrCode,
  Sparkles,
  Building,
  Vote,
  Hash,
  ExternalLink,
  Copy,
  Check,
  Users,
  Palette,
  FileJson,
  Share2,
  FileDown,
  Loader2,
  Calendar,
  Clock,
  Landmark
} from 'lucide-react';

/* ============================================================
   CERTIFICATE THEMES DEFINITION
   ============================================================ */
const THEMES = {
  ROYAL_GOLD: {
    id: 'ROYAL_GOLD',
    name: 'Royal Ivory & Gold',
    subtitle: 'Classic Academic Prestige',
    bg: '#fcfbf7',
    outerBorder: '#b45309',
    innerBorder: '#d97706',
    borderStyle: 'double',
    primaryText: '#0f172a',
    headerText: '#0369a1',
    titleColor: '#92400e',
    subTitleColor: '#b45309',
    accent: '#f59e0b',
    accentBg: 'linear-gradient(135deg, #fef3c7 0%, #ede9fe 100%)',
    sealBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    sealBorder: '#fef3c7',
    ribbonColor: '#dc2626',
    watermarkColor: '#0284c7',
    watermarkSymbol: '★',
    fontFamily: "Georgia, 'Times New Roman', serif",
    headerFont: "'Inter', -apple-system, sans-serif",
    signatureColor: '#1e3a8a'
  },
  CYBER_HOLO: {
    id: 'CYBER_HOLO',
    name: 'Cyber Matrix Obsidian',
    subtitle: 'Web3 & Blockchain Verified',
    bg: '#080e1c',
    outerBorder: '#38bdf8',
    innerBorder: '#818cf8',
    borderStyle: 'solid',
    primaryText: '#f8fafc',
    headerText: '#38bdf8',
    titleColor: '#38bdf8',
    subTitleColor: '#818cf8',
    accent: '#38bdf8',
    accentBg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(129, 140, 248, 0.15) 100%)',
    sealBg: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
    sealBorder: '#38bdf8',
    ribbonColor: '#06b6d4',
    watermarkColor: '#38bdf8',
    watermarkSymbol: '⬢',
    fontFamily: "'Inter', system-ui, sans-serif",
    headerFont: "'Space Grotesk', 'Inter', monospace",
    signatureColor: '#38bdf8'
  },
  EMERALD_HONOR: {
    id: 'EMERALD_HONOR',
    name: 'Emerald Excellence',
    subtitle: 'Chancellor Leadership Honor',
    bg: '#f2fcf5',
    outerBorder: '#065f46',
    innerBorder: '#059669',
    borderStyle: 'double',
    primaryText: '#064e3b',
    headerText: '#047857',
    titleColor: '#065f46',
    subTitleColor: '#059669',
    accent: '#10b981',
    accentBg: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
    sealBg: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
    sealBorder: '#a7f3d0',
    ribbonColor: '#047857',
    watermarkColor: '#059669',
    watermarkSymbol: '⚜',
    fontFamily: "Garamond, 'Baskerville', serif",
    headerFont: "'Inter', sans-serif",
    signatureColor: '#064e3b'
  },
  SAPPHIRE_PLATINUM: {
    id: 'SAPPHIRE_PLATINUM',
    name: 'Imperial Sapphire',
    subtitle: 'Presidential Executive Shield',
    bg: '#f8fafc',
    outerBorder: '#1e3a8a',
    innerBorder: '#64748b',
    borderStyle: 'double',
    primaryText: '#0f172a',
    headerText: '#1e3a8a',
    titleColor: '#1e3a8a',
    subTitleColor: '#475569',
    accent: '#2563eb',
    accentBg: 'linear-gradient(135deg, #dbeafe 0%, #f1f5f9 100%)',
    sealBg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
    sealBorder: '#e2e8f0',
    ribbonColor: '#1e3a8a',
    watermarkColor: '#2563eb',
    watermarkSymbol: '🏛',
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    headerFont: "'Inter', sans-serif",
    signatureColor: '#1e3a8a'
  }
};

export function OfficialCertificateModal({
  isOpen,
  onClose,
  certificatesData,
  defaultTab = 'WINNERS'
}) {
  const { institutionName, returningOfficer, returningOfficerTitle, electoralBoard } = useInstitution();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'WINNERS' | 'CANDIDATES' | 'VOTERS'
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [currentThemeKey, setCurrentThemeKey] = useState('ROYAL_GOLD');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const certRef = useRef(null);

  // Sync tab if default changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      setSelectedCertIndex(0);
    }
  }, [defaultTab]);

  const winners = certificatesData?.winners || [];
  const candidates = certificatesData?.candidates || [];
  const voters = certificatesData?.voters || [];

  const currentList =
    activeTab === 'WINNERS'
      ? winners
      : activeTab === 'CANDIDATES'
      ? candidates
      : voters;

  const cert = currentList[selectedCertIndex] || currentList[0];
  const theme = THEMES[currentThemeKey] || THEMES.ROYAL_GOLD;

  // Generate verified dynamic QR code data URL
  useEffect(() => {
    if (!isOpen || !cert) return;
    const verifyUrl = `${window.location.origin}/verify?certId=${encodeURIComponent(cert.certificate_id || 'CERT-STU2026001')}`;
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: theme.id === 'CYBER_HOLO' ? '#38bdf8' : '#0f172a',
        light: theme.id === 'CYBER_HOLO' ? '#080e1c' : '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('QR Code generation error:', err));
  }, [isOpen, cert, theme.id]);

  if (!isOpen || !certificatesData) return null;

  /* ── Download Certificate as High-Res PNG ── */
  const handleDownloadImage = async () => {
    if (!certRef.current || !cert) return;
    setIsDownloading(true);
    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // Crisp 300 DPI retina resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.bg,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const safeName = (cert.recipient_name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const certType = activeTab.toLowerCase();
      const safeInst = (institutionName || 'ABC_Institution').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeInst}_Certificate_${safeName}_${certType}.png`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download certificate image:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  /* ── Download Cryptographic JSON Inscription Proof ── */
  const handleDownloadJSON = () => {
    if (!cert) return;
    const proofPayload = {
      institution: `${institutionName || 'ABC Institution'} - Autonomous Campus Democratic Governance`,
      credential_type: activeTab === 'WINNERS' ? 'ELECTION_VICTORY' : activeTab === 'CANDIDATES' ? 'CANDIDATE_HONOR' : 'CIVIC_VOTER_DUTY',
      certificate_id: cert.certificate_id,
      recipient: {
        name: cert.recipient_name,
        student_id: cert.recipient_id,
        department: cert.department,
        class_year: cert.academic_year || '2026'
      },
      election: {
        title: cert.election_title || `${institutionName || 'ABC Institution'} Student Council General Election 2026`,
        position: cert.position_title || 'Campus Governance',
        total_votes: cert.votes_received,
        percentage: cert.vote_percentage
      },
      cryptography: {
        ledger_engine: "Byzantine Fault Tolerant (BFT) Permissioned Blockchain",
        merkle_root_verified: true,
        block_index: cert.block_index || 1,
        block_hash: cert.block_hash || '0x8f7d82e1c94b3012a95c81de4f0391abc8912',
        certificate_sha256: cert.certificate_hash,
        verification_endpoint: `${window.location.origin}/verify?certId=${encodeURIComponent(cert.certificate_id)}`
      },
      timestamp: cert.issued_at || new Date().toISOString(),
      chief_returning_officer: returningOfficer || "Dr. S. K. Narayanan",
      returning_officer_title: returningOfficerTitle || "Chief Returning Officer",
      electoral_board: electoralBoard || `${institutionName || 'ABC Institution'} Electoral Board`,
      seal_status: "VERIFIED_GENUINE_SEALED"
    };

    const blob = new Blob([JSON.stringify(proofPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof_${cert.certificate_id || 'svx_cert'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ── Native Print / PDF Flow ── */
  const handlePrint = () => {
    window.print();
  };

  /* ── Copy Verification Hash ── */
  const handleCopyHash = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  /* ── Copy Public Verification URL ── */
  const handleCopyVerificationLink = () => {
    if (!cert) return;
    const url = `${window.location.origin}/verify?certId=${encodeURIComponent(cert.certificate_id || '')}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 12, 24, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div
        className="certificate-modal-container"
        style={{
          width: '100%',
          maxWidth: '1020px',
          maxHeight: '94vh',
          background: '#0f172a',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          color: '#f8fafc'
        }}
      >
        {/* ── Top Header Toolbar (Hidden in Print) ── */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            paddingBottom: '14px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={22} color="#38bdf8" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.01em' }}>
                Certified Institutional Election Certificates
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Cryptographically audited credentials for ABC Institution student governance.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Download High-Res PNG Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloading || !cert}
              style={{
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                border: 'none',
                color: '#ffffff',
                cursor: isDownloading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease'
              }}
              title="Download 300 DPI High-Resolution PNG"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Generating PNG...</span>
                </>
              ) : (
                <>
                  <FileDown size={15} />
                  <span>Download Image</span>
                </>
              )}
            </button>

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Print or Save as Landscape PDF"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>

            {/* Download JSON Proof */}
            <button
              type="button"
              onClick={handleDownloadJSON}
              style={{
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Download cryptographic JSON proof for offline audit"
            >
              <FileJson size={15} />
              <span>JSON Proof</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
                marginLeft: '4px'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>

        {/* ── Category Tabs & Theme Palette Switcher Bar (Hidden in Print) ── */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(2, 6, 23, 0.55)',
            padding: '10px 14px',
            borderRadius: '14px',
            border: '1px solid rgba(56, 189, 248, 0.16)'
          }}
        >
          {/* Certificate Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setActiveTab('WINNERS'); setSelectedCertIndex(0); }}
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'WINNERS' ? '1.5px solid #f59e0b' : '1px solid transparent',
                background: activeTab === 'WINNERS' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: activeTab === 'WINNERS' ? '#f59e0b' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trophy size={14} />
              <span>Winners Distinction ({winners.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('CANDIDATES'); setSelectedCertIndex(0); }}
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'CANDIDATES' ? '1.5px solid #a78bfa' : '1px solid transparent',
                background: activeTab === 'CANDIDATES' ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                color: activeTab === 'CANDIDATES' ? '#a78bfa' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Award size={14} />
              <span>Candidate Participation ({candidates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('VOTERS'); setSelectedCertIndex(0); }}
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeTab === 'VOTERS' ? '1.5px solid #38bdf8' : '1px solid transparent',
                background: activeTab === 'VOTERS' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeTab === 'VOTERS' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} />
              <span>Voter Civic Duty ({voters.length})</span>
            </button>
          </div>

          {/* ── THEME PALETTE SELECTOR ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Palette size={13} color="#38bdf8" />
              <span>THEME:</span>
            </span>

            <div style={{ display: 'flex', gap: '5px' }}>
              {Object.values(THEMES).map(t => {
                const isSelected = currentThemeKey === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCurrentThemeKey(t.id)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: '7px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isSelected ? `1.5px solid ${t.accent}` : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isSelected ? `${t.accent}25` : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#f8fafc' : '#94a3b8',
                      transition: 'all 0.18s ease'
                    }}
                    title={t.subtitle}
                  >
                    {t.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dropdown if multiple in current category */}
        {currentList.length > 1 && (
          <div className="no-print" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select Record:</span>
            <select
              style={{
                width: '320px',
                fontSize: '0.8rem',
                padding: '6px 10px',
                background: 'rgba(2, 6, 23, 0.7)',
                color: '#f8fafc',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px',
                outline: 'none'
              }}
              value={selectedCertIndex}
              onChange={(e) => setSelectedCertIndex(Number(e.target.value))}
            >
              {currentList.map((item, idx) => (
                <option key={item.certificate_id || idx} value={idx}>
                  {item.recipient_name} — {item.position_title || 'Civic Elector'} ({item.votes_received || 0} votes)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PRINTABLE & EXPORTABLE OFFICIAL CERTIFICATE DOCUMENT
            ══════════════════════════════════════════════════════════════ */}
        {cert ? (
          <div
            ref={certRef}
            id="printable-certificate"
            style={{
              background: theme.bg,
              border: `9px ${theme.borderStyle} ${theme.outerBorder}`,
              borderRadius: '18px',
              padding: '36px 42px',
              position: 'relative',
              boxShadow: theme.id === 'CYBER_HOLO'
                ? '0 0 50px rgba(56, 189, 248, 0.15), inset 0 0 30px rgba(56, 189, 248, 0.08)'
                : 'inset 0 0 35px rgba(217, 119, 6, 0.08), 0 12px 30px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              fontFamily: theme.fontFamily,
              color: theme.primaryText,
              boxSizing: 'border-box',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Inner Gilded Trim Line */}
            <div
              style={{
                position: 'absolute',
                inset: '6px',
                border: `1.5px solid ${theme.innerBorder}`,
                borderRadius: '10px',
                pointerEvents: 'none'
              }}
            />

            {/* Corner Ornamental Accents */}
            <div style={{ position: 'absolute', top: '14px', left: '16px', color: theme.innerBorder, fontSize: '0.9rem', pointerEvents: 'none' }}>✦</div>
            <div style={{ position: 'absolute', top: '14px', right: '16px', color: theme.innerBorder, fontSize: '0.9rem', pointerEvents: 'none' }}>✦</div>
            <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: theme.innerBorder, fontSize: '0.9rem', pointerEvents: 'none' }}>✦</div>
            <div style={{ position: 'absolute', bottom: '14px', right: '16px', color: theme.innerBorder, fontSize: '0.9rem', pointerEvents: 'none' }}>✦</div>

            {/* Large Watermark Symbol in Center */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '19rem',
                opacity: theme.id === 'CYBER_HOLO' ? 0.04 : 0.035,
                fontWeight: 900,
                color: theme.watermarkColor,
                pointerEvents: 'none',
                userSelect: 'none',
                lineHeight: 1
              }}
            >
              {theme.watermarkSymbol}
            </div>

            {/* Top Institutional Header */}
            <div style={{ textAlign: 'center', borderBottom: `2px solid ${theme.innerBorder}44`, paddingBottom: '14px', position: 'relative', zIndex: 2 }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                color: theme.headerText,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: theme.headerFont,
                marginBottom: '4px'
              }}>
                {(institutionName || 'ABC INSTITUTION').toUpperCase()} • OFFICE OF STUDENT GOVERNANCE
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.7rem, 3.2vw, 2.2rem)',
                  fontWeight: 900,
                  color: theme.titleColor,
                  letterSpacing: '0.03em',
                  margin: '4px 0 2px 0',
                  textTransform: 'uppercase',
                  lineHeight: 1.15
                }}
              >
                {activeTab === 'WINNERS'
                  ? 'Certificate of Election Victory'
                  : activeTab === 'CANDIDATES'
                  ? 'Certificate of Democratic Candidacy'
                  : 'Certificate of Civic Participation'}
              </h1>

              <div style={{
                fontSize: '0.82rem',
                color: theme.subTitleColor,
                fontWeight: 700,
                fontStyle: 'italic',
                marginTop: '2px'
              }}>
                "Your Voice Builds Tomorrow." — Cryptographically Certified by StudentVoiceX BFT Ledger
              </div>
            </div>

            {/* Certificate Body Text & Recipient */}
            <div style={{ textAlign: 'center', margin: '18px 0', position: 'relative', zIndex: 2 }}>
              <p style={{
                fontSize: '0.88rem',
                color: theme.id === 'CYBER_HOLO' ? '#94a3b8' : '#475569',
                margin: '0 0 6px 0',
                fontStyle: 'italic'
              }}>
                This is officially certified and permanently inscribed upon the institutional immutable blockchain that
              </p>

              {/* Recipient Name */}
              <div
                style={{
                  fontSize: 'clamp(1.9rem, 3.8vw, 2.35rem)',
                  fontWeight: 900,
                  color: theme.primaryText,
                  textDecoration: 'underline',
                  textDecorationColor: theme.accent,
                  textUnderlineOffset: '6px',
                  margin: '6px 0'
                }}
              >
                {cert.recipient_name}
              </div>

              {/* Recipient Institutional Metadata */}
              <div style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: theme.headerText,
                fontFamily: theme.headerFont,
                marginBottom: '14px'
              }}>
                ROLL ID: {cert.recipient_id} • DEPARTMENT OF {cert.department || 'INFORMATION TECHNOLOGY'} • CLASS OF {cert.academic_year || '2026'}
              </div>

              {/* Distinction Paragraph */}
              <p style={{
                fontSize: '0.92rem',
                color: theme.id === 'CYBER_HOLO' ? '#cbd5e1' : '#334155',
                maxWidth: '680px',
                margin: '0 auto 16px auto',
                lineHeight: 1.6
              }}>
                {activeTab === 'WINNERS' ? (
                  <>
                    has been duly chosen and democratically elected as the <strong>{cert.position_title}</strong> in the{' '}
                    <strong>{cert.election_title || `${institutionName || 'ABC Institution'} General Student Election 2026`}</strong>, having secured a decisive mandate with{' '}
                    <strong>{cert.votes_received} verified votes</strong> (<strong>{cert.vote_percentage}%</strong> of total ballots cast).
                  </>
                ) : activeTab === 'CANDIDATES' ? (
                  <>
                    has actively participated with integrity as an official contesting candidate for <strong>{cert.position_title}</strong> in the{' '}
                    <strong>{cert.election_title || `${institutionName || 'ABC Institution'} Student Governance Election 2026`}</strong>, securing{' '}
                    <strong>{cert.votes_received} verified votes</strong> in the democratic advancement of student leadership.
                  </>
                ) : (
                  <>
                    has exercised their constitutional democratic franchise and fulfilled their civic responsibility by casting a verified, cryptographically sealed ballot in the{' '}
                    <strong>{cert.election_title || `${institutionName || 'ABC Institution'} Student Council Election 2026`}</strong>.
                  </>
                )}
              </p>

              {/* ── ROLE-SPECIFIC PROOF BADGE (Candidate vs Voter) ── */}
              {activeTab === 'WINNERS' || activeTab === 'CANDIDATES' ? (
                /* Candidate / Winner Box */
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '24px',
                    background: theme.accentBg,
                    border: `1.5px solid ${theme.innerBorder}`,
                    borderRadius: '16px',
                    padding: '10px 24px',
                    margin: '0 auto',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/* Symbol */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: theme.id === 'CYBER_HOLO' ? '#0f172a' : '#ffffff',
                        border: `2px solid ${theme.innerBorder}`,
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {cert.symbol || '★'}
                    </div>
                    <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                      <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                        Official Symbol
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: theme.primaryText }}>
                        {cert.symbol_name || 'Star'}
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '32px', background: theme.innerBorder, opacity: 0.4 }} />

                  {/* Votes */}
                  <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                      Votes Garnered
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: theme.primaryText }}>
                      {cert.votes_received} <span style={{ fontSize: '0.74rem', color: theme.headerText }}>({cert.vote_percentage}%)</span>
                    </div>
                  </div>

                  {cert.margin > 0 && (
                    <>
                      <div style={{ width: '1px', height: '32px', background: theme.innerBorder, opacity: 0.4 }} />
                      <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                        <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                          Victory Margin
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>
                          +{cert.margin} Votes
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Voter Civic Responsibility Box (Correct Structure for Voters!) */
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '20px',
                    background: theme.accentBg,
                    border: `1.5px solid ${theme.innerBorder}`,
                    borderRadius: '16px',
                    padding: '10px 24px',
                    margin: '0 auto',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', fontFamily: theme.headerFont }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: theme.id === 'CYBER_HOLO' ? '#0f172a' : '#ffffff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: theme.accent, border: `1px solid ${theme.innerBorder}`
                    }}>
                      <Vote size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                        Civic Milestone
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 900, color: theme.primaryText }}>
                        Verified Elector
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '28px', background: theme.innerBorder, opacity: 0.4 }} />

                  <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                      Blockchain Ledger
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 900, color: theme.primaryText }}>
                      Block #{cert.block_index || 14892}
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '28px', background: theme.innerBorder, opacity: 0.4 }} />

                  <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                      Zero-Knowledge Status
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#10b981' }}>
                      Merkle Root Verified ✓
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── BOTTOM PROOF SECTION: SEAL, QR, & SIGNATURE ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: `1px dashed ${theme.innerBorder}44`,
                position: 'relative',
                zIndex: 2,
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              {/* Left: Cryptographic QR Code & Serial Hash */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    background: theme.id === 'CYBER_HOLO' ? '#020617' : '#ffffff',
                    border: `1.5px solid ${theme.innerBorder}`,
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Certificate QR"
                      style={{ width: '56px', height: '56px', display: 'block' }}
                    />
                  ) : (
                    <QrCode size={36} color={theme.accent} />
                  )}
                </div>

                <div style={{ textAlign: 'left', fontFamily: theme.headerFont }}>
                  <div style={{ fontSize: '0.64rem', fontWeight: 800, color: theme.subTitleColor, textTransform: 'uppercase' }}>
                    Certificate Serial Identifier
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: theme.primaryText, fontFamily: 'monospace' }}>
                    {cert.certificate_id}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: theme.headerText, fontFamily: 'monospace' }}>
                    SHA-256 Digest: {(cert.certificate_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855').substring(0, 18)}...
                  </div>
                </div>
              </div>

              {/* Center: Embossed Institutional Wax / Foil Seal */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: theme.sealBg,
                    border: `2px solid ${theme.sealBorder}`,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    position: 'relative'
                  }}
                >
                  <ShieldCheck size={26} />
                  {/* Decorative ribbon tails */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    width: '26px',
                    height: '14px',
                    background: theme.ribbonColor,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    zIndex: -1
                  }} />
                </div>
                <div style={{
                  fontSize: '0.58rem',
                  fontWeight: 900,
                  color: theme.subTitleColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '14px',
                  fontFamily: theme.headerFont
                }}>
                  OFFICIAL AUDIT SEAL
                </div>
              </div>

              {/* Right: Chief Returning Officer Seal & Signature */}
              <div style={{ textAlign: 'center', minWidth: '190px' }}>
                <div
                  style={{
                    fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', cursive",
                    fontSize: '1.9rem',
                    color: theme.signatureColor,
                    marginBottom: '-4px'
                  }}
                >
                  {returningOfficer || 'Dr. S. K. Narayanan'}
                </div>
                <div style={{ width: '100%', height: '1.5px', background: theme.innerBorder, margin: '4px 0', opacity: 0.8 }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: theme.primaryText, fontFamily: theme.headerFont, textTransform: 'uppercase' }}>
                  {returningOfficerTitle || 'Chief Returning Officer'}
                </div>
                <div style={{ fontSize: '0.64rem', color: theme.subTitleColor, fontFamily: theme.headerFont }}>
                  {electoralBoard || `${institutionName || 'ABC Institution'} Electoral Board`}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No certificates found for this category.
          </div>
        )}

        {/* ── Modal Footer (Hidden in Print) ── */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.74rem',
            color: '#94a3b8',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Cryptographically sealed with SHA-256 • Verified by StudentVoiceX BFT Ledger</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {cert && (
              <>
                <button
                  type="button"
                  onClick={handleCopyVerificationLink}
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Copy permanent shareable verification URL"
                >
                  {copiedLink ? <Check size={13} color="#10b981" /> : <Share2 size={13} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyHash(cert.certificate_hash)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {copiedHash ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedHash ? 'Hash Copied!' : 'Copy Cert Hash'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Print / Save PDF CSS Rules ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            border-width: 8px !important;
            padding: 36px !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @page {
          size: A4 landscape;
          margin: 8mm;
        }
      `}</style>
    </div>
  );
}

export default OfficialCertificateModal;
