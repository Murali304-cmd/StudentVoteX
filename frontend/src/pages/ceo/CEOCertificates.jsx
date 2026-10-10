import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import {
  Award,
  Crown,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  QrCode,
  Sparkles,
  Download,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Users,
  Check,
  Sparkle
} from 'lucide-react';

export function CEOCertificates() {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Certificate categories: 'WINNER' | 'CANDIDATE' | 'VOTER'
  const [certType, setCertType] = useState('WINNER');

  // Live Certificates from Backend API
  const [certificatesData, setCertificatesData] = useState({
    winners: [],
    candidates: [],
    voters: [],
    totalIssued: 0
  });

  const [selectedCertIndex, setSelectedCertIndex] = useState(0);

  // Active Certificate details (auto-selected from API or custom overridden)
  const [activeCert, setActiveCert] = useState({
    candidateName: 'Aditya Sengupta',
    rollNumber: 'STU2026IT001',
    department: 'Information Technology',
    position: 'Department Representative (IT & CS)',
    electionTitle: 'Department Representative Election 2026',
    voteCount: 148,
    totalVotes: 210,
    votePercentage: 70.5,
    voteMargin: '+38 votes',
    symbolName: 'Star',
    symbolImage: '',
    symbolEmoji: '★',
    certId: 'SVX-WIN-2026-9041',
    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    blockIndex: 2,
    blockHash: '0x8f2d9e1a3bc89174df83427189a0b1c2e3f4d5e6a7b8c9d0e1f2a3b4c5d6e7f8',
    merkleRoot: '0x17d9a302be45fc789901412e87c0a911db7460fa1103c8b417e201bc6f4091ae',
    qrPayload: 'STUDENTVOICEX-CERT:SVX-WIN-2026-9041:VERIFIED',
    ceoSignature: 'Dr. R. K. Sharma (Chief Election Officer)',
    registrarSignature: 'Prof. Ananya Sen (Returning Officer)'
  });

  const fetchCertificates = async (electionId) => {
    try {
      setLoading(true);
      const res = await api.certificates.getByElection(electionId);
      if (res) {
        const winners = res.winners || [];
        const candidates = res.candidates || [];
        const voters = res.voters || [];

        setCertificatesData({
          winners,
          candidates,
          voters,
          totalIssued: res.totalCertificatesIssued || (winners.length + candidates.length + voters.length)
        });

        // Auto-select first winner if available
        if (winners.length > 0) {
          syncActiveCertFromModel(winners[0], 'WINNER');
        } else if (candidates.length > 0) {
          syncActiveCertFromModel(candidates[0], 'CANDIDATE');
        } else if (voters.length > 0) {
          syncActiveCertFromModel(voters[0], 'VOTER');
        }
      }
    } catch (err) {
      console.warn("Could not load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncActiveCertFromModel = (cert, type) => {
    if (!cert) return;
    setActiveCert(prev => ({
      ...prev,
      candidateName: cert.recipient_name || prev.candidateName,
      rollNumber: cert.recipient_id || prev.rollNumber,
      department: cert.department || prev.department,
      position: cert.position_title || prev.position,
      electionTitle: cert.election_title || (elections.find(e => e.id === Number(selectedElectionId))?.title) || prev.electionTitle,
      voteCount: cert.votes_received ?? prev.voteCount,
      totalVotes: cert.total_votes_cast ?? prev.totalVotes,
      votePercentage: cert.vote_percentage ?? prev.votePercentage,
      voteMargin: cert.margin ? `+${cert.margin} votes` : prev.voteMargin,
      symbolName: cert.symbol_name || prev.symbolName,
      symbolImage: cert.symbol_image || '',
      symbolEmoji: cert.symbol || '★',
      certId: cert.certificate_id || prev.certId,
      issueDate: cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : prev.issueDate,
      blockIndex: cert.block_index ?? prev.blockIndex,
      blockHash: cert.block_hash || prev.blockHash,
      qrPayload: cert.qr_payload || `STUDENTVOICEX-CERT:${cert.certificate_id}:VERIFIED`,
      ceoSignature: 'Dr. R. K. Sharma (Chief Election Officer Central)',
      registrarSignature: 'Prof. Ananya Sen (Registrar & Returning Officer)'
    }));
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const list = await api.elections.list();
        if (Array.isArray(list) && list.length > 0) {
          setElections(list);
          setSelectedElectionId(list[0].id);
          await fetchCertificates(list[0].id);
        }
      } catch (err) {
        console.error("Failed to load elections:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleElectionChange = async (eId) => {
    setSelectedElectionId(eId);
    await fetchCertificates(eId);
  };

  // Re-generate official blockchain certificates
  const handleRegenerateCertificates = async () => {
    if (!selectedElectionId) return;
    setGenerating(true);
    try {
      await api.certificates.generate(selectedElectionId);
      await fetchCertificates(selectedElectionId);
      alert("✓ Official Certificates generated and sealed on blockchain with latest vote counts and Merkle roots!");
    } catch (err) {
      alert("Failed to generate certificates: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  const currentList = certType === 'WINNER'
    ? certificatesData.winners
    : certType === 'CANDIDATE'
      ? certificatesData.candidates
      : certificatesData.voters;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* ── PRINT CSS STYLES INJECTION ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
            border: 14px solid #b45309 !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── HEADER CONTROLS (HIDDEN ON PRINT) ── */}
      <div className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', boxShadow: '0 6px 18px rgba(180, 83, 9, 0.35)'
            }}>
              <Award size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Executive Certificate &amp; Proclamation Studio
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, marginTop: '2px' }}>
                Chief Election Officer Directorate &middot; Certified BFT Blockchain Diplomas
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleRegenerateCertificates}
              disabled={generating}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 800 }}
            >
              <Sparkles size={15} color="#f59e0b" />
              <span>{generating ? 'Sealing on Chain...' : 'Re-Seal Certificates on Chain'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', border: 'none',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Printer size={16} />
              <span>Print Official Certificate (A4 Landscape)</span>
            </button>
          </div>
        </div>

        {/* ── TOOLBAR / SELECTION CARD ── */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', alignItems: 'center' }}>
            {/* Election Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Target Election Ballot
              </label>
              <select
                value={selectedElectionId}
                onChange={(e) => handleElectionChange(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700,
                  background: '#ffffff', color: '#0f172a'
                }}
              >
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.title} ({el.department}) [{el.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* Certificate Category Switcher */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Certificate Classification
              </label>
              <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCertType('WINNER');
                    if (certificatesData.winners.length > 0) syncActiveCertFromModel(certificatesData.winners[0], 'WINNER');
                  }}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: '9px', border: 'none',
                    background: certType === 'WINNER' ? '#ffffff' : 'transparent',
                    color: certType === 'WINNER' ? '#b45309' : '#64748b',
                    fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    boxShadow: certType === 'WINNER' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  👑 Winner ({certificatesData.winners.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCertType('CANDIDATE');
                    if (certificatesData.candidates.length > 0) syncActiveCertFromModel(certificatesData.candidates[0], 'CANDIDATE');
                  }}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: '9px', border: 'none',
                    background: certType === 'CANDIDATE' ? '#ffffff' : 'transparent',
                    color: certType === 'CANDIDATE' ? '#0284c7' : '#64748b',
                    fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    boxShadow: certType === 'CANDIDATE' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  🏅 Candidate ({certificatesData.candidates.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCertType('VOTER');
                    if (certificatesData.voters.length > 0) syncActiveCertFromModel(certificatesData.voters[0], 'VOTER');
                  }}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: '9px', border: 'none',
                    background: certType === 'VOTER' ? '#ffffff' : 'transparent',
                    color: certType === 'VOTER' ? '#059669' : '#64748b',
                    fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                    boxShadow: certType === 'VOTER' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  🗳️ Voter ({certificatesData.voters.length})
                </button>
              </div>
            </div>

            {/* Recipient Picker within selected Category */}
            {currentList.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Select Recipient
                </label>
                <select
                  value={selectedCertIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedCertIndex(idx);
                    syncActiveCertFromModel(currentList[idx], certType);
                  }}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700,
                    background: '#ffffff', color: '#0f172a'
                  }}
                >
                  {currentList.map((item, idx) => (
                    <option key={item.id || idx} value={idx}>
                      {item.recipient_name} ({item.recipient_id})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          PRINTABLE HIGH-RES EXECUTIVE CERTIFICATE CONTAINER
          ═════════════════════════════════════════════════════════ */}
      <div
        id="printable-certificate"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '16px solid #f8fafc',
          outline: '4px solid #b45309',
          outlineOffset: '-10px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)',
          padding: '54px 50px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {/* Guilloché Subtle Background Lattice */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.04) 0%, rgba(2, 132, 199, 0.02) 50%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Decorative Gold Corner Ornaments */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', width: '38px', height: '38px', borderTop: '4px solid #b45309', borderLeft: '4px solid #b45309' }} />
        <div style={{ position: 'absolute', top: '20px', right: '20px', width: '38px', height: '38px', borderTop: '4px solid #b45309', borderRight: '4px solid #b45309' }} />
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '38px', height: '38px', borderBottom: '4px solid #b45309', borderLeft: '4px solid #b45309' }} />
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '38px', height: '38px', borderBottom: '4px solid #b45309', borderRight: '4px solid #b45309' }} />

        {/* ── DIPLOMA HEADER ── */}
        <div style={{ textAlign: 'center', borderBottom: '2.5px solid #f1f5f9', paddingBottom: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', boxShadow: '0 8px 24px rgba(180, 83, 9, 0.35)'
            }}>
              <Crown size={36} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                ABC Institution of Technology
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Directorate of the Chief Election Officer &middot; Democratic Charter 2026
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            background: certType === 'WINNER' ? '#fffbeb' : (certType === 'CANDIDATE' ? '#f0f9ff' : '#ecfdf5'),
            border: `2px solid ${certType === 'WINNER' ? '#fde68a' : (certType === 'CANDIDATE' ? '#bae6fd' : '#a7f3d0')}`,
            padding: '6px 26px', borderRadius: '999px',
            fontSize: '0.84rem', fontWeight: 900,
            color: certType === 'WINNER' ? '#b45309' : (certType === 'CANDIDATE' ? '#0369a1' : '#065f46'),
            letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '6px'
          }}>
            {certType === 'WINNER'
              ? '★ OFFICIAL PROCLAMATION OF ELECTION VICTORY ★'
              : certType === 'CANDIDATE'
                ? '★ CERTIFICATE OF CIVIC LEADERSHIP & CONTESTATION ★'
                : '★ CRYPTOGRAPHIC CERTIFICATE OF DEMOCRATIC CIVIC PARTICIPATION ★'}
          </div>
        </div>

        {/* ── BODY SECTION ── */}
        <div style={{ textAlign: 'center', padding: '0 30px' }}>
          <p style={{ fontSize: '1rem', color: '#64748b', fontStyle: 'italic', margin: '0 0 16px 0' }}>
            Be it formally attested unto all faculties, scholars, and officers that
          </p>

          {/* Recipient Full Name */}
          <h2 style={{
            fontSize: '2.8rem', fontWeight: 900, color: '#0f172a',
            margin: '0 0 8px 0', letterSpacing: '-0.03em', lineHeight: 1.1
          }}>
            {activeCert.candidateName}
          </h2>

          {/* Department & Roll Number */}
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#475569', marginBottom: '22px' }}>
            Student Roll ID: <span style={{ color: '#0284c7', fontFamily: 'monospace' }}>{activeCert.rollNumber}</span> &middot; {activeCert.department}
          </div>

          {/* Body Proclamation Text */}
          {certType === 'WINNER' ? (
            <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.65, maxWidth: '820px', margin: '0 auto 28px' }}>
              having contested with honor in the <strong>{activeCert.electionTitle}</strong> and having secured a verified plurality of{' '}
              <strong style={{ color: '#b45309' }}>{activeCert.voteCount} ballots ({activeCert.votePercentage}% of total ballots cast)</strong>, is hereby duly proclaimed and certified as the elected:
            </p>
          ) : certType === 'CANDIDATE' ? (
            <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.65, maxWidth: '820px', margin: '0 auto 28px' }}>
              is hereby commended and certified for civic leadership, academic engagement, and democratic candidacy in the{' '}
              <strong>{activeCert.electionTitle}</strong> for the position of <strong>{activeCert.position}</strong>.
            </p>
          ) : (
            <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.65, maxWidth: '820px', margin: '0 auto 28px' }}>
              is hereby commended for executing sovereign democratic franchise in the <strong>{activeCert.electionTitle}</strong>. Ballot inclusion is mathematically proven on the Byzantine Fault Tolerant ledger with zero linkage to individual identity.
            </p>
          )}

          {/* Position / Title Highlight Banner */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
            border: '2px solid #cbd5e1', borderRadius: '18px',
            padding: '16px 36px', marginBottom: '32px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Office &amp; Mandate
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
              {activeCert.position}
            </div>
          </div>

          {/* Candidate Campaign Symbol Highlight (If Winner or Candidate) */}
          {(certType === 'WINNER' || certType === 'CANDIDATE') && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{
                width: '74px', height: '74px', borderRadius: '50%',
                background: '#ffffff', border: '3px solid #b45309',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(180, 83, 9, 0.25)', overflow: 'hidden'
              }}>
                {activeCert.symbolImage ? (
                  <img src={activeCert.symbolImage} alt={activeCert.symbolName} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '2.4rem', color: '#b45309' }}>{activeCert.symbolEmoji}</span>
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                  Official Electoral Symbol
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                  {activeCert.symbolName}
                </div>
                {certType === 'WINNER' && (
                  <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 800 }}>
                    Victory Margin: {activeCert.voteMargin}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER: CRYPTOGRAPHIC TRUST, QR CODE, & DUAL SIGNATURES ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          gap: '24px', alignItems: 'center',
          borderTop: '2px solid #f1f5f9', paddingTop: '28px', marginTop: '16px'
        }}>
          {/* Left: Chief Election Officer Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
              fontSize: '2.1rem', color: '#0f172a', marginBottom: '2px', lineHeight: 1
            }}>
              R. K. Sharma
            </div>
            <div style={{ width: '180px', height: '1.5px', background: '#94a3b8', margin: '6px auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>
              Dr. R. K. Sharma
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Chief Election Officer &middot; Central Commission
            </div>
          </div>

          {/* Center: Official Golden Seal & Live Verification QR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '84px', height: '84px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              border: '4px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(180, 83, 9, 0.4)', color: '#fff',
              position: 'relative'
            }}>
              <ShieldCheck size={44} />
            </div>

            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Official Institutional Seal
            </div>
          </div>

          {/* Right: Returning Officer Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
              fontSize: '2.1rem', color: '#0f172a', marginBottom: '2px', lineHeight: 1
            }}>
              Ananya Sen
            </div>
            <div style={{ width: '180px', height: '1.5px', background: '#94a3b8', margin: '6px auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>
              Prof. Ananya Sen
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Registrar &middot; Returning Board
            </div>
          </div>
        </div>

        {/* ── BOTTOM SUB-FOOTER: BLOCKCHAIN SPECIFICATION ── */}
        <div style={{
          marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f8fafc',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace', flexWrap: 'wrap', gap: '8px'
        }}>
          <div>
            CERTIFICATE ID: <strong style={{ color: '#0f172a' }}>{activeCert.certId}</strong>
          </div>
          <div>
            LEDGER SEAL: BLOCK #{activeCert.blockIndex} ({activeCert.blockHash.slice(0, 18)}...)
          </div>
          <div>
            DATE OF PROCLAMATION: {activeCert.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CEOCertificates;
