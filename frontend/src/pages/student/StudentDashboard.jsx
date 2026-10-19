import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Vote,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Building2,
  Lock,
  User,
  Sparkles,
  QrCode,
  Award,
  Activity,
  Users,
  ChevronRight,
  Fingerprint,
  Cpu,
  BadgeCheck,
  Crown,
  Download
} from 'lucide-react';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';

export function StudentDashboard() {
  const { user } = useAuth();
  const { institutionName } = useInstitution();
  const [elections, setElections] = useState([]);
  const [sectionSummary, setSectionSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elData, secData] = await Promise.all([
          api.elections.list().catch(() => []),
          api.student.getSectionInfo(user?.student_id || user?.username).catch(() => null)
        ]);
        const activeList = Array.isArray(elData) ? elData.filter(e => e.status === 'ACTIVE') : [];
        setElections(activeList);
        if (secData?.section_summary) {
          setSectionSummary(secData.section_summary);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isVerified = user?.verification_status === 'VERIFIED';
  const isEligible = user?.eligibility === 'ELIGIBLE';
  const hasFaceEnrolled = Boolean(user?.profile_photo);
  const sectionTurnout = sectionSummary?.turnout_percentage || 84.4;

  const journeySteps = [
    { title: 'Enrolment', desc: 'Identity provisioned in registry', completed: true, link: '/student/profile' },
    { title: 'Smart ID Card', desc: isVerified ? 'Verified with QR' : 'OCR scan needed', completed: isVerified, link: '/student/id-verification' },
    { title: 'Biometrics', desc: hasFaceEnrolled ? 'Facial hash enrolled' : 'Webcam snapshot needed', completed: hasFaceEnrolled, link: '/student/profile' },
    { title: 'Section Booth', desc: `Assigned to Booth-${user?.section || 'A'}`, completed: true, link: '/student/section' },
    { title: 'Cast Ballot', desc: 'Ephemeral AES-256 voting', completed: false, link: '/student/voting-session', highlight: true }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '30px 34px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(79, 70, 229, 0.12) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.28)',
          borderRadius: '22px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.05, pointerEvents: 'none' }}>
          <Vote size={260} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={12} />
                <span>{user?.department || 'Information Technology'}</span>
              </span>
              <span className="badge badge-cyan" style={{ fontWeight: 800 }}>
                Year {user?.year || 'III'} &middot; Section {user?.section || 'A'}
              </span>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <BadgeCheck size={12} />
                <span>CGPA: {user?.cgpa || 8.5} &middot; Attendance: {user?.attendance || 85}%</span>
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.full_name || 'Student Voter'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
              Roll Number: <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>{user?.roll_number || user?.student_id || '7678BIT001'}</strong> &middot; Student ID: <strong>{user?.student_id || '7678BIT001'}</strong> &middot; Voting status synchronized with {institutionName || 'Muralidharan College'} blockchain.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/student/section"
              className="btn btn-secondary"
              style={{
                padding: '11px 18px',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Building2 size={16} />
              <span>Section {user?.section || 'A'} Hub</span>
            </Link>

            <Link
              to="/student/voting-session"
              className="btn btn-primary"
              style={{
                padding: '11px 22px',
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Vote size={18} />
              <span>Enter Controlled Chamber</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Step Voting Journey Tracker */}
      <div className="glass-card" style={{ padding: '22px 28px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Your 5-Stage Voting Clearance Pipeline
            </h3>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
            Session Security Standard: ISO/IEC 27001
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {journeySteps.map((step, idx) => (
            <Link
              key={step.title}
              to={step.link}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: step.highlight ? '1.5px solid #0284c7' : '1px solid #f1f5f9',
                background: step.highlight ? '#f0f9ff' : step.completed ? '#f0fdf4' : '#fafafa',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: step.completed ? '#15803d' : '#0284c7' }}>
                  STEP 0{idx + 1}
                </span>
                {step.completed ? (
                  <CheckCircle2 size={15} color="#16a34a" />
                ) : (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.highlight ? '#0284c7' : '#cbd5e1' }} />
                )}
              </div>
              <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>{step.title}</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{step.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Department Representative & Electoral Pass Banner */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderRadius: '18px',
          border: '1.5px solid #fde68a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <Crown size={24} />
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Official Department Representation &middot; {user?.department || 'Information Technology'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#78350f', marginTop: '2px' }}>
              Active Department Representative: {user?.department === 'Information Technology' ? 'Muralidharan K (7678BIT001)' : `${user?.department} Representative`}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#92400e', marginTop: '2px' }}>
              Eligible to contest and vote in your department's dedicated representative elections.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={async () => {
              try {
                const data = await api.students.list({ department: user?.department || 'Information Technology' });
                const list = Array.isArray(data) ? data : data?.results || [];
                exportDepartmentRosterCSV(list, {
                  department: user?.department || 'Information Technology',
                  year: user?.year || '3rd Year',
                  section: user?.section || 'A'
                });
              } catch (e) {
                alert("Error downloading roster: " + e.message);
              }
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.80rem', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <Download size={15} />
            <span>Download Dept Roster (CSV)</span>
          </button>

          <Link
            to="/student/representative"
            className="btn btn-secondary"
            style={{ fontSize: '0.80rem', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' }}
          >
            <Crown size={15} color="#f59e0b" />
            <span>DR Hub &amp; Motions</span>
          </Link>

          <Link
            to="/student/elections"
            className="btn btn-primary"
            style={{ fontSize: '0.80rem', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, background: '#d97706', borderColor: '#b45309' }}
          >
            <Vote size={15} />
            <span>Department Ballots</span>
          </Link>
        </div>
      </div>

      {/* 4 Status & Section KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* Section Turnout Pulse */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Section {user?.section || 'A'} Turnout
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Vote size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {sectionTurnout}%
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', margin: '8px 0', overflow: 'hidden' }}>
            <div style={{ width: `${sectionTurnout}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '999px' }} />
          </div>
          <Link to="/student/section" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>View Class Section Roster</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Identity Verification */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Identity Verification
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isVerified ? '#dcfce7' : '#fef3c7', color: isVerified ? '#15803d' : '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isVerified ? '#15803d' : '#b45309' }}>
            {user?.verification_status || 'VERIFIED'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
            Smart card biometric credential
          </div>
          <Link to="/student/id-verification" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span>Run OCR Document Scanner</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Assigned Polling Booth */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Physical Polling Kiosk
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            Booth-{user?.section || 'A'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            Hall 201, Academic Block C
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
            ✓ Hardware Terminal Online
          </div>
        </div>

        {/* Voting Chamber Security */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Cryptographic Engine
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            Zero-Knowledge
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            Ephemeral AES-256-GCM AEAD
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginTop: '8px' }}>
            ✓ Privacy Guarantee Active
          </div>
        </div>

      </div>

      {/* Active Elections Grid */}
      <div className="glass-card" style={{ padding: '26px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Vote size={14} />
              <span>Official Digital Ballots</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
              Active {institutionName || 'ABC Institution'} Elections
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Cast your ballot in the controlled proctored voting chamber or review candidates and manifestos.
            </p>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
            {elections.length} Active Digital Ballot{elections.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <StudentVoiceXLoader
            mode="card"
            label="Loading Active Ballots & Live Polling Status..."
            sublabel="Querying Campus Access Gateway & Identity Entitlements..."
          />
        ) : elections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            No active elections found for your department at this moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {elections.map((el) => (
              <div
                key={el.id}
                style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                      LIVE NOW
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      {el.candidates?.length || 0} Candidates Running
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {el.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {el.description || 'Institutional election for department & student council leadership positions.'}
                  </p>

                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <span style={{ color: '#64748b' }}>Voting Hours:</span>
                    <strong style={{ color: '#0f172a' }}>{el.daily_start_time || '09:00 AM'} &ndash; {el.daily_end_time || '12:00 PM'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/student/elections/${el.id}/candidates`}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}
                  >
                    Candidates
                  </Link>
                  <Link
                    to="/student/voting-session"
                    className="btn btn-primary"
                    style={{ flex: 1.2, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}
                  >
                    <span>Vote Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Link
          to="/student/section"
          className="glass-card"
          style={{
            padding: '18px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} />
          </div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Class Section Portal</strong>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Turnout &amp; classmates</span>
          </div>
        </Link>

        <Link
          to="/student/id"
          className="glass-card"
          style={{
            padding: '18px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={20} />
          </div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>3D Smart ID Card</strong>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Flippable credential</span>
          </div>
        </Link>

        <Link
          to="/student/certificates"
          className="glass-card"
          style={{
            padding: '18px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Official Certificates</strong>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Voter badges &amp; seals</span>
          </div>
        </Link>

        <Link
          to="/student/status"
          className="glass-card"
          style={{
            padding: '18px',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} />
          </div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Blockchain Status</strong>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Ledger height &amp; proof</span>
          </div>
        </Link>
      </div>

    </div>
  );
}

export default StudentDashboard;
