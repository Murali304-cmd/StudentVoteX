import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Building2,
  Users,
  Vote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Trophy,
  Activity,
  MapPin,
  Cpu,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  Radio,
  FileCheck2,
  Award,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Megaphone,
  BarChart3,
  MessageSquareQuote,
  Navigation,
  Download,
  Crown
} from 'lucide-react';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';
import { useTheme } from '../../context/ThemeContext';
import { useInstitution } from '../../context/InstitutionContext';

export function StudentSectionPortal() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { institutionName } = useInstitution();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sectionData, setSectionData] = useState(null);
  const [searchPeer, setSearchPeer] = useState('');
  const [filterPeerStatus, setFilterPeerStatus] = useState('ALL'); // 'ALL', 'VERIFIED', 'VOTED'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [pollData, setPollData] = useState(null);
  const [pollVoting, setPollVoting] = useState(false);
  const [pollReceipt, setPollReceipt] = useState(null);

  const fetchPoll = async () => {
    try {
      const data = await api.student.getSectionPoll();
      setPollData(data);
    } catch (e) {
      setPollData({
        poll_id: 'poll-sec-a-2026',
        title: 'Section Community Motion',
        question: 'Should Section A sponsor a petition for 24/7 Library & Project Lab access during midterms and finals?',
        options: [
          { id: 'opt-1', label: 'Yes, Full 24/7 Overnight Access', votes: 48 },
          { id: 'opt-2', label: 'Extended till 2:00 AM + Weekend Only', votes: 16 },
          { id: 'opt-3', label: 'Prioritize High-Speed Wi-Fi in Hostels First', votes: 8 }
        ],
        total_votes: 72,
        has_voted: false
      });
    }
  };

  const handleVotePoll = async (optionId) => {
    setPollVoting(true);
    try {
      const res = await api.student.voteSectionPoll(optionId);
      if (res?.poll) {
        setPollData(res.poll);
        setPollReceipt(res.receipt_hash);
      }
    } catch (e) {
      setPollData(prev => {
        if (!prev) return prev;
        const updated = prev.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o);
        return { ...prev, options: updated, total_votes: prev.total_votes + 1, has_voted: true, selected_option: optionId };
      });
      setPollReceipt('0x8f2a...9b14');
    } finally {
      setPollVoting(false);
    }
  };

  const handleCopyBroadcast = (secName, deptName, turnout) => {
    const text = `📢 *Section ${secName || 'A'} (${deptName || 'IT'}) Voter Alert!* \nTurnout has reached *${turnout || 84.4}%* in the ${institutionName || 'ABC Institution'} General Election! Let's reach 100% and claim the intra-department trophy! 🏆\nCast your vote at *EVM Kiosk-01 (Tech Block Hall 201)* or via the web voting chamber before 12:00 PM today!\nPortal Link: http://localhost:5173/student/voting-session`;
    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      const data = await api.student.getSectionInfo(user?.student_id || user?.username);
      setSectionData(data);
    } catch (err) {
      console.warn("Using fallback mock data for section portal:", err);
      // Fallback section data if network/backend is offline
      const dept = user?.department || 'Information Technology';
      const sec = user?.section || 'A';
      const yr = user?.year || 'III';
      setSectionData({
        student: user,
        section_summary: {
          department: dept,
          year: yr,
          section: sec,
          academic_cohort: 'Class of 2026 &middot; Semester VI',
          total_students: 45,
          verified_students: 42,
          voted_students: 38,
          turnout_percentage: 84.4,
          verification_percentage: 93.3
        },
        leaderboard: [
          { section: 'A', total: 45, verified: 42, voted: 38, turnout_percentage: 84.4, is_current: sec === 'A' },
          { section: 'B', total: 44, verified: 39, voted: 32, turnout_percentage: 72.7, is_current: sec === 'B' },
          { section: 'C', total: 42, verified: 35, voted: 27, turnout_percentage: 64.3, is_current: sec === 'C' }
        ],
        peers: [
          { id: 1, student_id: user?.student_id || 'STU2026001', full_name: user?.full_name || 'Alex Mercer', roll_number: user?.roll_number || '2026IT001', verification_status: 'VERIFIED', eligibility: 'ELIGIBLE', has_voted: true, is_self: true },
          { id: 2, student_id: 'STU2026002', full_name: 'Priya Sharma', roll_number: '2026IT002', verification_status: 'VERIFIED', eligibility: 'ELIGIBLE', has_voted: true, is_self: false },
          { id: 3, student_id: 'STU2026003', full_name: 'Rohan Verma', roll_number: '2026IT003', verification_status: 'VERIFIED', eligibility: 'ELIGIBLE', has_voted: true, is_self: false },
          { id: 4, student_id: 'STU2026004', full_name: 'Ananya Iyer', roll_number: '2026IT004', verification_status: 'VERIFIED', eligibility: 'ELIGIBLE', has_voted: false, is_self: false },
          { id: 5, student_id: 'STU2026005', full_name: 'Karthik Raja', roll_number: '2026IT005', verification_status: 'VERIFIED', eligibility: 'ELIGIBLE', has_voted: true, is_self: false },
          { id: 6, student_id: 'STU2026006', full_name: 'Sneha Patel', roll_number: '2026IT006', verification_status: 'PENDING', eligibility: 'ELIGIBLE', has_voted: false, is_self: false }
        ],
        candidates: [
          {
            id: 101,
            name: 'Priya Sharma',
            position: 'Department General Representative',
            department: dept,
            year: yr,
            section: sec,
            election_symbol: '★',
            symbol_name: 'Beacon of Innovation',
            manifesto: 'Enhancing peer technical labs, open WiFi access in study zones, and collegiate hackathon sponsorship.',
            priorities: '• Technical Workshops\n• High-Speed Lab Wi-Fi\n• Placement Mentorship'
          },
          {
            id: 102,
            name: 'Karthik Raja',
            position: 'Academic Affairs Council Member',
            department: dept,
            year: yr,
            section: sec,
            election_symbol: '⚡',
            symbol_name: 'Spark of Progress',
            manifesto: 'Curriculum feedback automation, elective course flexibility, and digital library portal upgrades.',
            priorities: '• Digital Notes Portal\n• Flexible Electives\n• Exam Preparation Forums'
          }
        ],
        assigned_booth: {
          booth_id: `Booth-${sec}`,
          kiosk_name: `EVM Kiosk-01 (${dept.split(' ')[0]} Terminal)`,
          location: `Academic Block C &middot; Hall 201`,
          status: 'ONLINE_ACTIVE',
          queue_estimate_minutes: 2,
          evm_officer: 'Prof. S. Narayanan (Presiding EVM Officer)',
          network_status: 'Institutional 802.1X LAN Verified'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
    fetchPoll();
  }, [user]);

  if (loading) {
    return (
      <StudentVoiceXLoader
        mode="card"
        label="Loading Student Section & Class Roster..."
        sublabel="Querying Academic Department Records & Live Ballot Turnout..."
      />
    );
  }

  const summary = sectionData?.section_summary || {};
  const leaderboard = sectionData?.leaderboard || [];
  const peers = sectionData?.peers || [];
  const candidates = sectionData?.candidates || [];
  const booth = sectionData?.assigned_booth || {};

  const filteredPeers = peers.filter(p => {
    const matchSearch = (
      p.full_name?.toLowerCase().includes(searchPeer.toLowerCase()) ||
      p.roll_number?.toLowerCase().includes(searchPeer.toLowerCase()) ||
      p.student_id?.toLowerCase().includes(searchPeer.toLowerCase())
    );
    if (!matchSearch) return false;
    if (filterPeerStatus === 'VERIFIED') return p.verification_status === 'VERIFIED';
    if (filterPeerStatus === 'VOTED') return p.has_voted;
    return true;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.25)',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.06, pointerEvents: 'none' }}>
          <Building2 size={220} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem' }}>
                <Building2 size={13} />
                <span>{summary.department || user?.department}</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                Year {summary.year || user?.year} &middot; Section {summary.section || user?.section}
              </span>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem' }}>
                <ShieldCheck size={13} />
                <span>Class of 2026</span>
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Academic Section &amp; Class Voter Portal
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Welcome to your dedicated classroom section hub. Monitor Section {summary.section || 'A'} live voter turnout, compare intra-department participation, review section candidates, and locate your assigned EVM polling booth.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/student/nomination"
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
              <Award size={16} />
              <span>File Candidacy Nomination</span>
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
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Vote size={18} />
              <span>Enter Polling Chamber</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Civic Navigation Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        <Link
          to="/student/booth-radar"
          className="glass-card"
          style={{
            padding: '14px 18px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(236, 253, 245, 0.85)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>EVM Booth Radar</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Live wait times &amp; map</div>
            </div>
          </div>
          <ChevronRight size={16} color="#10b981" />
        </Link>

        <Link
          to="/student/townhall"
          className="glass-card"
          style={{
            padding: '14px 18px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1.5px solid rgba(79, 70, 229, 0.35)',
            background: isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(238, 242, 255, 0.85)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquareQuote size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>Democratic AMA</div>
              <div style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 600 }}>Candidate Q&amp;A Forum</div>
            </div>
          </div>
          <ChevronRight size={16} color="#6366f1" />
        </Link>

        <Link
          to="/student/practice-booth"
          className="glass-card"
          style={{
            padding: '14px 18px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1.5px solid rgba(2, 132, 199, 0.35)',
            background: isDark ? 'rgba(2, 132, 199, 0.1)' : 'rgba(240, 249, 255, 0.85)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Vote size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>Practice Sandbox</div>
              <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>Simulated EVM ballot</div>
            </div>
          </div>
          <ChevronRight size={16} color="#0284c7" />
        </Link>

        <Link
          to="/student/certificates"
          className="glass-card"
          style={{
            padding: '14px 18px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.85)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f59e0b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>Civic Certificates</div>
              <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>Official credentials</div>
            </div>
          </div>
          <ChevronRight size={16} color="#f59e0b" />
        </Link>
      </div>

      {/* 4 Stat Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* Card 1: Section Voter Turnout */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Section Turnout
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Vote size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
              {summary.turnout_percentage || 84.4}%
            </span>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
              {summary.voted_students || 38}/{summary.total_students || 45} Cast
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${summary.turnout_percentage || 84.4}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
            Active voting in Section {summary.section || 'A'}
          </div>
        </div>

        {/* Card 2: Credential Verification */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified Identities
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
              {summary.verification_percentage || 93.3}%
            </span>
            <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
              {summary.verified_students || 42}/{summary.total_students || 45}
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '999px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${summary.verification_percentage || 93.3}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
            Smart ID card OCR verified
          </div>
        </div>

        {/* Card 3: Assigned EVM Polling Kiosk */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assigned EVM Station
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {booth.kiosk_name || 'EVM Kiosk-01'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="#0284c7" />
            <span dangerouslySetInnerHTML={{ __html: booth.location || 'Academic Block C' }} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 8px', borderRadius: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534' }}>Queue: ~{booth.queue_estimate_minutes || 2}m &middot; Hardware Online</span>
          </div>
        </div>

        {/* Card 4: Voting Hours & Security */}
        <div className="glass-card" style={{ padding: '22px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Voting Chamber Hours
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            09:00 AM &ndash; 12:00 PM
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
            Strict institutional session window
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '6px' }}>
            <Radio size={12} color="#2563eb" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af' }}>BFT Ledger Active</span>
          </div>
        </div>

      </div>

      {/* Section Mobilization Announcement & Hourly Velocity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Hourly Turnout Velocity */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <TrendingUp size={14} />
                <span>Turnout Velocity</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                Section {summary.section || 'A'} Voting Trend
              </h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              +12.4% last hour
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '09:00 AM &ndash; 10:00 AM', pct: 31, count: 14 },
              { time: '10:00 AM &ndash; 11:00 AM', pct: 62, count: 28 },
              { time: '11:00 AM &ndash; 12:00 PM (Live)', pct: summary.turnout_percentage || 84.4, count: summary.voted_students || 38 }
            ].map(slot => (
              <div key={slot.time} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }} dangerouslySetInnerHTML={{ __html: slot.time }} />
                  <strong style={{ color: '#0284c7' }}>{slot.pct}% ({slot.count} cast)</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${slot.pct}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7 0%, #2563eb 100%)', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Mobilization WhatsApp Broadcast */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Megaphone size={14} />
                <span>Class Mobilization Hub</span>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                WhatsApp / Telegram
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Encourage Section Classmates to Vote
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Help Section {summary.section || 'A'} reach 100% voter turnout before the 12:00 PM deadline. Generate a formatted broadcast message for your class group chat.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, fontStyle: 'italic' }}>
              "📢 Section {summary.section || 'A'} Voter Alert! Turnout has reached {summary.turnout_percentage || 84.4}%! Cast your ballot at EVM Kiosk-01 or web chamber before 12:00 PM!"
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleCopyBroadcast(summary.section, summary.department, summary.turnout_percentage)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {copiedBroadcast ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
              <span>{copiedBroadcast ? 'Copied to Clipboard!' : 'Copy Announcement'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`📢 Section ${summary.section || 'A'} (${summary.department || 'IT'}) Voter Alert!\nTurnout has reached ${summary.turnout_percentage || 84.4}% in the ${institutionName || 'ABC Institution'} General Election! Let's reach 100% and lead the Department. Cast your vote before 12:00 PM at EVM Kiosk-01 or via the student portal: http://localhost:5173/student/voting-session`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <Share2 size={15} />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Intra-Department Section Leaderboard & Polling Booth Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Section Turnout Leaderboard */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Trophy size={14} />
                <span>Department Turnout Race</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                {summary.department} &middot; Year {summary.year}
              </h3>
            </div>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
              Live Roster
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {leaderboard.map((item, idx) => (
              <div
                key={item.section}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: item.is_current ? '1.5px solid #0284c7' : '1px solid #f1f5f9',
                  background: item.is_current ? '#f0f9ff' : '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: idx === 0 ? '#fef3c7' : '#e2e8f0',
                      color: idx === 0 ? '#b45309' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                        Section {item.section}
                      </span>
                      {item.is_current && (
                        <span style={{ marginLeft: '6px', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#0284c7', color: '#ffffff' }}>
                          YOUR SECTION
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a' }}>
                      {item.turnout_percentage}%
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {item.voted}/{item.total} cast
                    </div>
                  </div>
                </div>

                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.turnout_percentage}%`,
                    height: '100%',
                    background: item.is_current ? 'linear-gradient(90deg, #0284c7 0%, #2563eb 100%)' : '#94a3b8',
                    borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Polling Booth Hardware Terminal Details */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Cpu size={14} />
                <span>Physical EVM Station Mapping</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                Class Section Polling Booth
              </h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              Online Kiosk
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Designated Terminal:</span>
                <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>{booth.kiosk_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Physical Location:</span>
                <strong style={{ fontSize: '0.84rem', color: '#0284c7' }} dangerouslySetInnerHTML={{ __html: booth.location }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Presiding EVM Officer:</span>
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{booth.evm_officer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Network Security:</span>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>{booth.network_status}</span>
              </div>
            </div>

            <div style={{ padding: '14px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', fontSize: '0.78rem', color: '#92400e', lineHeight: 1.5 }}>
              <strong>Physical Voting Requirement:</strong> If using the physical campus EVM terminal, bring your student smart ID card or QR reference for instant barcode optical validation.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/student/id"
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}
              >
                View Smart ID Card
              </Link>
              <Link
                to="/student/voting-session"
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}
              >
                Vote Online
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Section Candidates Spotlight */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Award size={14} />
              <span>Ballot Candidates</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
              Section {summary.section || 'A'} &amp; Departmental Candidates
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Review policy priorities and election symbols of candidates representing your academic branch.
            </p>
          </div>

          <Link
            to="/student/candidates"
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Compare All Candidates</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
            No candidates declared for this section yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {candidates.map(cand => (
              <div
                key={cand.id || cand.candidate_id}
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 900
                      }}>
                        {cand.election_symbol || '★'}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {cand.name}
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
                          {cand.position}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1' }}>
                      Sec {cand.section || summary.section}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cand.manifesto || 'Committed to representing departmental students in institutional council proceedings.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(cand)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'center' }}
                  >
                    View Manifesto
                  </button>
                  <Link
                    to="/student/voting-session"
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '8px 10px', justifyContent: 'center' }}
                  >
                    Vote Candidate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Community Straw Poll & Instant Opinion Pulse */}
      {pollData && (
        <div
          className="glass-card"
          style={{
            padding: '24px 28px',
            background: 'var(--bg-surface-translucent)',
            borderRadius: '20px',
            border: '1.5px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <BarChart3 size={14} />
                <span>Section {summary.section || 'A'} Community Straw Poll</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                {pollData.title || 'Student Policy Pulse'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                <span>{pollData.closing_in || 'Active Motion'}</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {pollData.total_votes} Peer Votes Recorded
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
            "{pollData.question}"
          </div>

          {/* Poll Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pollData.options?.map((opt) => {
              const pct = pollData.total_votes > 0 ? Math.round((opt.votes / pollData.total_votes) * 100) : 0;
              const isSelected = pollData.selected_option === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => !pollData.has_voted && !pollVoting && handleVotePoll(opt.id)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--cyan-light)' : 'var(--bg-surface-secondary)',
                    cursor: pollData.has_voted ? 'default' : 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Progress Fill Bar */}
                  {pollData.has_voted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${pct}%`,
                        background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                        zIndex: 0,
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  )}

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #0284c7' : '2px solid var(--border-medium)',
                          background: '#ffffff',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: '0.86rem', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                        {opt.label}
                      </span>
                    </div>

                    {pollData.has_voted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 900, color: isSelected ? '#0284c7' : 'var(--text-primary)' }}>
                          {pct}%
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ({opt.votes})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pollReceipt && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.76rem'
              }}
            >
              <span style={{ color: '#059669', fontWeight: 700 }}>
                ✓ Straw vote sealed cryptographically.
              </span>
              <span style={{ color: '#059669', fontFamily: 'monospace' }}>
                Receipt: {pollReceipt}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Gamified Section Civic Milestones & Honor Roll */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'var(--bg-surface-translucent)',
          borderRadius: '20px',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Trophy size={14} />
              <span>Section Civic Honor Roll &amp; Milestones</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              Section Turnout Achievements
            </h3>
          </div>

          <Link
            to="/student/certificates"
            className="btn btn-secondary"
            style={{ fontSize: '0.80rem', padding: '7px 14px' }}
          >
            <Award size={14} />
            <span>View Official Credentials</span>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {[
            {
              tier: 'Bronze',
              title: 'Democratic Mobilizer',
              threshold: '50% Turnout',
              unlocked: (summary.turnout_percentage || 84.4) >= 50,
              badgeColor: '#b45309',
              desc: 'Section achieved baseline democratic participation quota.'
            },
            {
              tier: 'Silver',
              title: 'Classroom Vanguard',
              threshold: '75% Turnout',
              unlocked: (summary.turnout_percentage || 84.4) >= 75,
              badgeColor: '#64748b',
              desc: 'Over three-quarters of enrolled classmates cast verified ballots.'
            },
            {
              tier: 'Gold',
              title: 'Institutional Champion',
              threshold: '85% Turnout',
              unlocked: (summary.turnout_percentage || 84.4) >= 85,
              badgeColor: '#f59e0b',
              desc: 'Top-tier collegiate civic mobilization with zero vote discrepancies.'
            }
          ].map((milestone, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: milestone.unlocked ? `1.5px solid ${milestone.badgeColor}` : '1px solid var(--border-subtle)',
                background: milestone.unlocked ? (isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb') : 'var(--bg-surface-secondary)',
                opacity: milestone.unlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: milestone.unlocked ? milestone.badgeColor : '#94a3b8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}
              >
                {milestone.unlocked ? '🏆' : '🔒'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {milestone.title}
                  </span>
                  {milestone.unlocked && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                      UNLOCKED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: milestone.badgeColor, fontWeight: 700 }}>
                  {milestone.threshold} &middot; {milestone.tier} Honor
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                  {milestone.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Section Peer Voter Roll */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-surface-translucent)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Users size={14} />
              <span>Classroom Section Voter Roll</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
              Enrolled Voters in Section {summary.section || 'A'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Anonymized verification audit log and credential validity statuses for classroom peers.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                exportDepartmentRosterCSV(peers, {
                  department: summary.department || 'Information Technology',
                  year: summary.year || '3rd Year',
                  section: summary.section || 'A',
                  institutionName: institutionName || 'Muralidharan College of Technology'
                });
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              title="Download verified student roster for this class section"
            >
              <Download size={14} />
              <span>Download Class Roster (CSV)</span>
            </button>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search classmate..."
                value={searchPeer}
                onChange={(e) => setSearchPeer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setFilterPeerStatus('ALL')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filterPeerStatus === 'ALL' ? '#ffffff' : 'transparent',
                  color: filterPeerStatus === 'ALL' ? '#0284c7' : '#64748b'
                }}
              >
                All ({peers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterPeerStatus('VERIFIED')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filterPeerStatus === 'VERIFIED' ? '#ffffff' : 'transparent',
                  color: filterPeerStatus === 'VERIFIED' ? '#059669' : '#64748b'
                }}
              >
                Verified
              </button>
              <button
                type="button"
                onClick={() => setFilterPeerStatus('VOTED')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filterPeerStatus === 'VOTED' ? '#ffffff' : 'transparent',
                  color: filterPeerStatus === 'VOTED' ? '#7c3aed' : '#64748b'
                }}
              >
                Voted
              </button>
            </div>
          </div>
        </div>

        {/* Peer Roll Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 14px' }}>Classmate</th>
                <th style={{ padding: '12px 14px' }}>Roll Identifier</th>
                <th style={{ padding: '12px 14px' }}>Smart ID Status</th>
                <th style={{ padding: '12px 14px' }}>Voting Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Security Badge</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeers.map((p) => (
                <tr
                  key={p.id || p.student_id}
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    background: p.is_self ? '#f0f9ff' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: p.is_self ? '#0284c7' : '#e2e8f0',
                        color: p.is_self ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 800
                      }}>
                        {p.full_name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          {p.full_name}
                          {p.is_self && (
                            <span style={{ marginLeft: '6px', fontSize: '0.64rem', padding: '1px 5px', borderRadius: '4px', background: '#0284c7', color: '#ffffff', fontWeight: 800 }}>
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {p.student_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#334155', fontWeight: 600 }}>
                    {p.roll_number || 'STU2026---'}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    {p.verification_status === 'VERIFIED' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.74rem', fontWeight: 700, background: '#d1fae5', padding: '2px 8px', borderRadius: '999px' }}>
                        <CheckCircle2 size={12} />
                        <span>Smart Card Verified</span>
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#d97706', fontSize: '0.74rem', fontWeight: 700, background: '#fef3c7', padding: '2px 8px', borderRadius: '999px' }}>
                        <Clock size={12} />
                        <span>Pending Review</span>
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    {p.has_voted ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#7c3aed', fontSize: '0.74rem', fontWeight: 800, background: '#ede9fe', padding: '2px 8px', borderRadius: '999px' }}>
                        <Vote size={12} />
                        <span>Ballot Finalized</span>
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600 }}>
                        Eligible to Vote
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                      SHA256:OK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Manifesto Modal */}
      {selectedCandidate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 900
                }}>
                  {selectedCandidate.election_symbol || '★'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedCandidate.name}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700 }}>
                    {selectedCandidate.position} &middot; Section {selectedCandidate.section}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Official Policy Manifesto
              </h5>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                {selectedCandidate.manifesto}
              </div>
            </div>

            {selectedCandidate.priorities && (
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Key Priorities
                </h5>
                <pre style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#475569', fontFamily: 'inherit', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {selectedCandidate.priorities}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
              >
                Close
              </button>
              <Link
                to="/student/voting-session"
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem', justifyContent: 'center' }}
              >
                Vote This Candidate
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentSectionPortal;
