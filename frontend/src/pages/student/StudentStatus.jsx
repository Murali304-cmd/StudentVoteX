import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { OfficialCertificateModal } from '../../components/certificates/OfficialCertificateModal';
import { ElectionCountdownTimer } from '../../components/common/ElectionCountdownTimer';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Vote,
  Layers,
  ArrowRight,
  Award,
  Trophy,
  Printer,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentStatus() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCertData, setSelectedCertData] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [statsData, elData, certData] = await Promise.all([
          api.blockchain.getStats(),
          api.elections.list(),
          api.certificates.getMyCertificates().catch(() => ({ certificates: [] }))
        ]);
        setStats(statsData);
        setElections(elData);
        setMyCertificates(certData?.certificates || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleOpenCertificate = (cert) => {
    const isWinner = cert.certificate_type === 'WINNER';
    const isCandidate = cert.certificate_type === 'CANDIDATE';
    setSelectedCertData({
      winners: isWinner ? [cert] : [],
      candidates: isCandidate ? [cert] : [],
      voters: !isWinner && !isCandidate ? [cert] : []
    });
    setIsCertModalOpen(true);
  };

  if (loading && !stats) {
    return (
      <StudentVoiceXLoader
        label="Loading Student Participation Status & Verified Certificates..."
        sublabel="Querying Blockchain Witness Ledger & Cryptographic Seals..."
        mode="card"
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Election & Participation Status
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Live turnout tracking, certified participation badges, and personal verification status for ABC Institution.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>IDENTITY STATUS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-primary)', marginTop: '4px' }}>
            {user?.verification_status || 'VERIFIED'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            ABC Institution Smart Card
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VOTING ELIGIBILITY</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-primary)', marginTop: '4px' }}>
            {user?.eligibility || 'ELIGIBLE'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Registered Voter
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MY CERTIFICATES</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--indigo-primary)', marginTop: '4px' }}>
            {myCertificates.length} Issued
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Permanently Sealed on Chain
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>BLOCKCHAIN HEIGHT</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-primary)', marginTop: '4px' }}>
            #{stats?.blockchainHeight || 2}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            BFT Consensus Finality
          </div>
        </div>
      </div>

      {/* My Verified Certificates Gallery */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#0284c7" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              My Official Verified Certificates & Awards
            </h2>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
            {myCertificates.length} Certified
          </span>
        </div>

        {myCertificates.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <Award size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: 0 }}>
              No certificates issued yet
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Participate as a candidate or cast your ballot in an election to receive your cryptographically signed certificate of democratic participation!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {myCertificates.map((cert) => {
              const isWinner = cert.certificate_type === 'WINNER';
              const isCandidate = cert.certificate_type === 'CANDIDATE';
              return (
                <div
                  key={cert.certificate_id}
                  style={{
                    background: isWinner
                      ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(254, 252, 232, 0.9) 100%)'
                      : '#f8fafc',
                    border: isWinner ? '1.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isWinner ? '0 4px 14px rgba(245, 158, 11, 0.15)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span className={`badge ${isWinner ? 'badge-amber' : isCandidate ? 'badge-indigo' : 'badge-emerald'}`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        {isWinner ? '🏆 VICTORY' : isCandidate ? '🎖️ CANDIDACY' : '📜 CIVIC DUTY'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                        Block #{cert.block_index || 1}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isWinner ? '#f59e0b' : '#0284c7',
                          color: '#fff',
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {cert.symbol || '★'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                          {cert.position_title || cert.election_title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {cert.votes_received > 0 ? `${cert.votes_received} Votes (${cert.vote_percentage}%)` : 'Ballot Cast'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCertificate(cert)}
                    className="btn btn-primary"
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Award size={14} />
                    <span>View & Download Certificate</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Ballots Schedule */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          Active Ballots Schedule
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {elections.map((el) => (
            <div key={el.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {el.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Scope: {el.department === 'ALL' ? 'Campus-Wide Common' : el.department} • {el.candidates?.length || 0} Registered Candidates
                  </div>
                </div>

                <Link to="/student/voting-session" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Enter Chamber</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <ElectionCountdownTimer election={el} compact={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <OfficialCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificatesData={selectedCertData}
        defaultTab={selectedCertData?.winners?.length ? 'WINNERS' : selectedCertData?.candidates?.length ? 'CANDIDATES' : 'VOTERS'}
      />
    </div>
  );
}

export default StudentStatus;
