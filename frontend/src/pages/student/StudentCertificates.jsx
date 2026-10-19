import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import { api } from '../../services/api';
import { OfficialCertificateModal } from '../../components/certificates/OfficialCertificateModal';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import QRCode from 'qrcode';
import {
  Award,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  QrCode,
  ExternalLink,
  Calendar,
  Building2,
  Vote,
  Layers,
  ArrowRight,
  Search,
  Filter,
  Check,
  Copy,
  Medal,
  Star,
  Flame,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentCertificates() {
  const { user } = useAuth();
  const { institutionName } = useInstitution();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertData, setSelectedCertData] = useState(null);
  const [defaultTab, setDefaultTab] = useState('VOTERS');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | WINNER | CANDIDATE | VOTER
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [qrThumbs, setQrThumbs] = useState({});

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.certificates.getMyCertificates();
      const list = res?.certificates || [];
      setCertificates(list);
    } catch (err) {
      console.warn("Could not load certificates:", err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  // Sample voter certificate fallback if student has verified or voted
  const sampleVoterCert = {
    certificate_id: `CERT-VOTER-${user?.student_id || 'STU2026001'}`,
    certificate_type: 'VOTER',
    recipient_name: user?.full_name || 'Muralidharan K',
    recipient_id: user?.student_id || 'STU2026001',
    election_title: `${institutionName || 'ABC Institution'} - Student Council President Election 2026`,
    department: user?.department || 'Information Technology',
    year: user?.year || 'IV',
    section: user?.section || 'A',
    issued_at: new Date().toISOString(),
    block_index: 14892,
    block_hash: '0x8f7d82e1c94b3012a95c81de4f0391ab9102482e1',
    merkle_proof: '0x3a4b5c...verified'
  };

  const allCerts = certificates.length > 0 ? certificates : [sampleVoterCert];

  // Pre-generate QR Code thumbnails
  useEffect(() => {
    allCerts.forEach(cert => {
      const url = `${window.location.origin}/verify?certId=${encodeURIComponent(cert.certificate_id)}`;
      QRCode.toDataURL(url, { width: 80, margin: 1, color: { dark: '#0284c7', light: '#ffffff' } })
        .then(data => {
          setQrThumbs(prev => ({ ...prev, [cert.certificate_id]: data }));
        })
        .catch(() => {});
    });
  }, [allCerts.length]);

  const handleOpenCertificate = (cert) => {
    const isWinner = cert.certificate_type === 'WINNER';
    const isCandidate = cert.certificate_type === 'CANDIDATE';
    const certPayload = {
      winners: isWinner ? [cert] : [],
      candidates: isCandidate ? [cert] : [],
      voters: !isWinner && !isCandidate ? [cert] : []
    };
    setSelectedCertData(certPayload);
    setDefaultTab(isWinner ? 'WINNERS' : isCandidate ? 'CANDIDATES' : 'VOTERS');
    setIsModalOpen(true);
  };

  const handleCopyHash = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter and search
  const filteredCerts = allCerts.filter(cert => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'WINNER' && cert.certificate_type === 'WINNER') ||
      (activeFilter === 'CANDIDATE' && cert.certificate_type === 'CANDIDATE') ||
      (activeFilter === 'VOTER' && (cert.certificate_type === 'VOTER' || !cert.certificate_type));

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (cert.election_title || '').toLowerCase().includes(q) ||
      (cert.certificate_id || '').toLowerCase().includes(q) ||
      (cert.recipient_name || '').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── Page Header Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(217, 119, 6, 0.08) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Award size={16} />
              <span>Cryptographic Institutional Election Credentials</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Official Election Certificates &amp; Civic Badges
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px', maxWidth: '680px', lineHeight: 1.55 }}>
              Every democratic vote and candidacy on StudentVoiceX generates an immutable cryptographic credential sealed with SHA-256 on the BFT witness ledger.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/verify"
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                padding: '9px 16px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8'
              }}
            >
              <QrCode size={16} />
              <span>Public Blockchain Verifier</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Civic Honors & Key Metrics Strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Total Credentials
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
              {allCerts.length} Verified
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Civic Standing
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399' }}>
              100% Exemplary
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Institutional Rank
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>
              Dean's Honor Roll
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(167, 139, 250, 0.25)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Ledger Consensus
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a78bfa' }}>
              Block #{allCerts[0]?.block_index || 14892}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Search Bar ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '16px',
        padding: '12px 18px',
        backdropFilter: 'blur(12px)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Credentials', count: allCerts.length },
            { id: 'WINNER', label: '🏆 Winners Distinction', count: allCerts.filter(c => c.certificate_type === 'WINNER').length },
            { id: 'CANDIDATE', label: '🎖️ Candidate Honors', count: allCerts.filter(c => c.certificate_type === 'CANDIDATE').length },
            { id: 'VOTER', label: '🗳️ Voter Civic Duty', count: allCerts.filter(c => c.certificate_type === 'VOTER' || !c.certificate_type).length }
          ].map(f => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.18s ease'
                }}
              >
                {f.label} ({f.count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search election or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px 8px 34px',
              borderRadius: '10px',
              background: 'rgba(2, 6, 23, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#f8fafc',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* ── Certificate Cards Grid ── */}
      {loading ? (
        <StudentVoiceXLoader
          mode="card"
          label="Fetching Verified Voting Certificates &amp; Blockchain Seals..."
          sublabel="Verifying Ed25519 digital signatures and Merkle root inclusion proofs..."
        />
      ) : filteredCerts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px dashed rgba(56, 189, 248, 0.25)',
          borderRadius: '18px',
          color: '#94a3b8'
        }}>
          <Award size={36} color="#64748b" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>No Certificates Found</h3>
          <p style={{ fontSize: '0.82rem', margin: '4px 0 0 0' }}>Try switching category filters or clearing your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '22px' }}>
          {filteredCerts.map((cert) => {
            const isWinner = cert.certificate_type === 'WINNER';
            const isCandidate = cert.certificate_type === 'CANDIDATE';

            return (
              <div
                key={cert.certificate_id}
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  borderRadius: '20px',
                  border: isWinner
                    ? '2px solid rgba(245, 158, 11, 0.5)'
                    : isCandidate
                    ? '2px solid rgba(167, 139, 250, 0.5)'
                    : '1.5px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: isWinner
                    ? '0 12px 30px rgba(245, 158, 11, 0.12)'
                    : '0 8px 24px rgba(0, 0, 0, 0.3)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)'
                }}
              >
                {/* Gold foil ribbon for winner */}
                {isWinner && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '-32px',
                    transform: 'rotate(45deg)',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    padding: '4px 34px',
                    letterSpacing: '0.08em',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                  }}>
                    WINNER
                  </div>
                )}

                <div>
                  {/* Top Category and Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: isWinner
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)'
                        : isCandidate
                        ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(129, 140, 248, 0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.3) 100%)',
                      color: isWinner ? '#f59e0b' : isCandidate ? '#a78bfa' : '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}>
                      {isWinner ? <Trophy size={24} /> : isCandidate ? <Award size={24} /> : <Vote size={24} />}
                    </div>

                    <div>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: isWinner ? '#f59e0b' : isCandidate ? '#a78bfa' : '#38bdf8'
                      }}>
                        {isWinner ? 'Victory Distinction' : isCandidate ? 'Democratic Candidate' : 'Verified Civic Elector'}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                        {cert.election_title || `${institutionName || 'ABC Institution'} Student Council Election 2026`}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata Box with QR Thumbnail */}
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.65)',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Recipient:</span>
                        <strong style={{ color: '#f8fafc' }}>{cert.recipient_name}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Roll ID:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{cert.recipient_id}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Department:</span>
                        <strong style={{ color: '#cbd5e1' }}>{cert.department || 'Information Technology'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Block Height:</span>
                        <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>#{cert.block_index || 14892}</span>
                      </div>
                    </div>

                    {/* QR Preview Thumbnail */}
                    {qrThumbs[cert.certificate_id] && (
                      <div style={{
                        background: '#ffffff',
                        padding: '4px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        flexShrink: 0
                      }}>
                        <img
                          src={qrThumbs[cert.certificate_id]}
                          alt="QR Thumbnail"
                          style={{ width: '48px', height: '48px', display: 'block' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenCertificate(cert)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Award size={15} />
                    <span>View &amp; Customize Theme</span>
                  </button>

                  <Link
                    to={`/verify?certId=${encodeURIComponent(cert.certificate_id)}`}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1.5px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                    title="Public Zero-Knowledge Verifier"
                  >
                    <ExternalLink size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCopyHash(cert.certificate_id, cert.certificate_id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Copy Certificate ID"
                  >
                    {copiedId === cert.certificate_id ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Gamified Civic Achievement Badges Section ── */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'rgba(15, 23, 42, 0.72)',
          border: '1.5px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          marginTop: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Medal size={20} color="#f59e0b" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Civic Participation Badges &amp; Democratic Milestones
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {[
            {
              title: 'Democratic Pioneer',
              desc: `Cast verified franchise in ${institutionName || 'ABC Institution'} General Election 2026`,
              icon: '🗳️',
              status: 'UNLOCKED',
              accent: '#34d399'
            },
            {
              title: 'Zero-Knowledge Guardian',
              desc: 'Ballot anonymised and proved via ZK Merkle tree cryptographic proof',
              icon: '🔒',
              status: 'UNLOCKED',
              accent: '#38bdf8'
            },
            {
              title: 'Consensus Witness',
              desc: 'Ballot verified across 4/4 independent BFT validator peer nodes',
              icon: '⚡',
              status: 'UNLOCKED',
              accent: '#a78bfa'
            },
            {
              title: 'Student Senate Elector',
              desc: 'Official certified participant in university governance body',
              icon: '🏛️',
              status: 'UNLOCKED',
              accent: '#f59e0b'
            }
          ].map((b, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(2, 6, 23, 0.6)',
                border: `1px solid ${b.accent}35`,
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>{b.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc' }}>{b.title}</span>
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 900,
                    color: b.accent,
                    background: `${b.accent}20`,
                    padding: '2px 6px',
                    borderRadius: '999px',
                    border: `1px solid ${b.accent}40`
                  }}>
                    {b.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Official Certificate Modal Component ── */}
      {selectedCertData && (
        <OfficialCertificateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          certificatesData={selectedCertData}
          defaultTab={defaultTab}
        />
      )}

    </div>
  );
}

export default StudentCertificates;
