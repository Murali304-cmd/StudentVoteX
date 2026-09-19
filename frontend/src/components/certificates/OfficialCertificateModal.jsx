import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

export function OfficialCertificateModal({ isOpen, onClose, certificatesData, defaultTab = 'WINNERS' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'WINNERS' | 'CANDIDATES' | 'VOTERS'
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen || !certificatesData) return null;

  const winners = certificatesData.winners || [];
  const candidates = certificatesData.candidates || [];
  const voters = certificatesData.voters || [];

  const currentList =
    activeTab === 'WINNERS'
      ? winners
      : activeTab === 'CANDIDATES'
      ? candidates
      : voters;

  const cert = currentList[selectedCertIndex] || currentList[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '94vh',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Header & Tabs (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={22} color="#0284c7" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Certified Institutional Election Certificates
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Cryptographically audited credentials for ABC Institution student governance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Category Tabs & Selector (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { setActiveTab('WINNERS'); setSelectedCertIndex(0); }}
              className={`btn ${activeTab === 'WINNERS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Trophy size={14} />
              <span>Winners Distinction ({winners.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('CANDIDATES'); setSelectedCertIndex(0); }}
              className={`btn ${activeTab === 'CANDIDATES' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Award size={14} />
              <span>Candidate Participation ({candidates.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('VOTERS'); setSelectedCertIndex(0); }}
              className={`btn ${activeTab === 'VOTERS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Users size={14} />
              <span>Voter Civic Duty ({voters.length})</span>
            </button>
          </div>

          {/* Selection Dropdown if multiple in category */}
          {currentList.length > 1 && (
            <select
              className="input-field"
              style={{ width: '260px', fontSize: '0.78rem', padding: '6px 10px' }}
              value={selectedCertIndex}
              onChange={(e) => setSelectedCertIndex(Number(e.target.value))}
            >
              {currentList.map((item, idx) => (
                <option key={item.certificate_id || idx} value={idx}>
                  {item.recipient_name} — {item.position_title} ({item.votes_received} votes)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* -------------------------------------------------------------
            THE PRINTABLE / VIEWABLE OFFICIAL CERTIFICATE DOCUMENT
            ------------------------------------------------------------- */}
        {cert ? (
          <div
            id="printable-certificate"
            style={{
              flex: 1,
              background: '#fefefe',
              border: '10px double #d97706',
              borderRadius: '16px',
              padding: '36px 40px',
              position: 'relative',
              boxShadow: 'inset 0 0 30px rgba(217, 119, 6, 0.08), 0 8px 24px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              fontFamily: 'Georgia, serif'
            }}
          >
            {/* Background Watermark Crest */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18rem',
                opacity: 0.035,
                fontWeight: 900,
                color: '#0284c7',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              ★
            </div>

            {/* Top Institutional Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #fde68a', paddingBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0369a1', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                ABC INSTITUTION • OFFICE OF STUDENT GOVERNANCE
              </div>
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: activeTab === 'WINNERS' ? '#92400e' : '#1e3a8a',
                  letterSpacing: '0.02em',
                  margin: '6px 0 2px 0',
                  textTransform: 'uppercase'
                }}
              >
                {activeTab === 'WINNERS'
                  ? 'Certificate of Election Victory'
                  : activeTab === 'CANDIDATES'
                  ? 'Certificate of Democratic Candidacy'
                  : 'Certificate of Civic Participation'}
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, fontStyle: 'italic' }}>
                "Your Voice Builds Tomorrow." — Certified by StudentVoiceX BFT Blockchain Ledger
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <p style={{ fontSize: '0.92rem', color: '#475569', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                This is officially certified and permanently recorded on the institutional immutable ledger that
              </p>

              <div
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  textDecoration: 'underline',
                  textDecorationColor: '#f59e0b',
                  textUnderlineOffset: '6px',
                  margin: '8px 0'
                }}
              >
                {cert.recipient_name}
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0369a1', fontFamily: 'sans-serif', marginBottom: '14px' }}>
                ID: {cert.recipient_id} • Department of {cert.department} • Class of {cert.academic_year}
              </div>

              <p style={{ fontSize: '0.94rem', color: '#334155', maxWidth: '680px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                {activeTab === 'WINNERS' ? (
                  <>
                    has been duly chosen and elected as the <strong>{cert.position_title}</strong> in the{' '}
                    <strong>{cert.election_title || 'ABC Institution Election 2026'}</strong>, having received{' '}
                    <strong>{cert.votes_received} verified votes</strong> (<strong>{cert.vote_percentage}%</strong> of total ballots cast).
                  </>
                ) : activeTab === 'CANDIDATES' ? (
                  <>
                    has actively participated as a certified contesting candidate for <strong>{cert.position_title}</strong>, securing{' '}
                    <strong>{cert.votes_received} verified votes</strong> in democratic pursuit of student leadership.
                  </>
                ) : (
                  <>
                    has exercised their democratic franchise and fulfilled their civic responsibility by casting a verified ballot in the{' '}
                    <strong>{cert.election_title || 'Student Senate Election'}</strong>.
                  </>
                )}
              </p>

              {/* Candidate Symbol & Votes Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #ede9fe 100%)',
                  border: '1.5px solid #d97706',
                  borderRadius: '16px',
                  padding: '12px 28px',
                  margin: '0 auto',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.15)'
                }}
              >
                {/* Symbol Circle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '2px solid #d97706',
                      fontSize: '1.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    {cert.symbol || '★'}
                  </div>
                  <div style={{ textAlign: 'left', fontFamily: 'sans-serif' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                      Official Symbol
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                      {cert.symbol_name || 'Star'}
                    </div>
                  </div>
                </div>

                <div style={{ width: '1px', height: '36px', background: '#d97706', opacity: 0.4 }} />

                {/* Votes Count */}
                <div style={{ textAlign: 'left', fontFamily: 'sans-serif' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                    Votes Garnered
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                    {cert.votes_received} <span style={{ fontSize: '0.78rem', color: '#0284c7' }}>({cert.vote_percentage}%)</span>
                  </div>
                </div>

                {cert.margin > 0 && (
                  <>
                    <div style={{ width: '1px', height: '36px', background: '#d97706', opacity: 0.4 }} />
                    <div style={{ textAlign: 'left', fontFamily: 'sans-serif' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                        Victory Margin
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10b981' }}>
                        +{cert.margin} Votes
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Proof Section: Signatures & QR Verification */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '32px',
                paddingTop: '18px',
                borderTop: '1px dashed #cbd5e1'
              }}
            >
              {/* Left: Cryptographic QR Code & Hash */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    background: '#0f172a',
                    borderRadius: '10px',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <QrCode size={36} color="#38bdf8" />
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px', fontFamily: 'sans-serif' }}>
                    VERIFIED
                  </span>
                </div>

                <div style={{ textAlign: 'left', fontFamily: 'sans-serif' }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Certificate Serial No.
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    {cert.certificate_id}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                    Block #{cert.block_index || 1} • SHA-256 Digest: {cert.certificate_hash?.substring(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Right: Returning Officer Seal & Signature */}
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <div
                  style={{
                    fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                    fontSize: '1.8rem',
                    color: '#1e3a8a',
                    marginBottom: '-4px'
                  }}
                >
                  Dr. S. K. Narayanan
                </div>
                <div style={{ width: '100%', height: '1.5px', background: '#334155', margin: '4px 0' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
                  Chief Returning Officer
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'sans-serif' }}>
                  ABC Institution Electoral Board
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No certificates found for this category.
          </div>
        )}

        {/* Bottom Bar (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Cryptographically sealed with SHA-256 • Verified by StudentVoiceX Ledger</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {cert && (
              <button
                type="button"
                onClick={() => handleCopyHash(cert.certificate_hash)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedHash ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copiedHash ? 'Hash Copied!' : 'Copy Cert Hash'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print Specific CSS */}
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
            border: 8px double #d97706 !important;
            padding: 40px !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default OfficialCertificateModal;
