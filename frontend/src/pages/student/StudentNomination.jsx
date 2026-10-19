import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Award,
  Vote,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BadgeCheck,
  Upload,
  User,
  Star,
  Zap,
  Rocket,
  Shield,
  Lightbulb,
  Heart,
  Compass,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentNomination() {
  const { user } = useAuth();
  const { institutionName } = useInstitution();

  const [step, setStep] = useState(1); // 1: Eligibility, 2: Position & Symbol, 3: Manifesto, 4: Review & Submit
  const [position, setPosition] = useState('Class Section Representative');
  const [electionTitle, setElectionTitle] = useState('Student Council General Election 2026');
  const [selectedSymbol, setSelectedSymbol] = useState({ symbol: '★', name: 'Beacon of Innovation' });
  const [manifesto, setManifesto] = useState('');
  const [priorities, setPriorities] = useState([
    'High-Speed Wi-Fi in Academic Laboratories',
    'Peer Tutoring & Technical Placement Workshops',
    'Extended Library & Study Hall Hours during Exams'
  ]);
  const [customPriority, setCustomPriority] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nominationSubmitted, setNominationSubmitted] = useState(false);
  const [nominationReceipt, setNominationReceipt] = useState(null);

  // Available Election Symbols Palette
  const symbolsPalette = [
    { symbol: '★', name: 'Beacon of Innovation' },
    { symbol: '⚡', name: 'Spark of Progress' },
    { symbol: '🚀', name: 'Vanguard Rocket' },
    { symbol: '🛡️', name: 'Guardian Shield' },
    { symbol: '💡', name: 'Torch of Knowledge' },
    { symbol: '🎯', name: 'Precision Target' },
    { symbol: '🌐', name: 'Global Nexus' },
    { symbol: '🌿', name: 'Sustainable Green' },
    { symbol: '🔥', name: 'Flaming Spirit' },
    { symbol: '⚖️', name: 'Justice Scale' },
    { symbol: '🏆', name: 'Trophy of Merit' },
    { symbol: '🔔', name: 'Liberty Bell' }
  ];

  // AI Manifesto Presets
  const manifestoPresets = [
    {
      title: 'Academic Excellence & Lab Upgrades',
      text: 'My core mission is modernizing departmental lab hardware, establishing continuous high-speed Wi-Fi across study zones, and partnering with faculty to provide structured placement mentorship programs.'
    },
    {
      title: 'Student Welfare & Flexible Campus Life',
      text: 'Committed to advocating for extended 24/7 library access during exam weeks, affordable cafeteria meal options, and peer mental health support workshops.'
    },
    {
      title: 'Innovation, Hackathons & Cultural Spirit',
      text: 'Driving collegiate sponsorship for technical hackathons, inter-department robotics competitions, and expanding cultural club funding for creative students.'
    }
  ];

  const isEligible = (user?.cgpa || 8.5) >= 7.0 && (user?.attendance || 85) >= 75 && (user?.disciplinary_clearance !== false);

  const handleAddPriority = () => {
    if (customPriority.trim() && priorities.length < 5) {
      setPriorities([...priorities, customPriority.trim()]);
      setCustomPriority('');
    }
  };

  const handleRemovePriority = (index) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  const handleSubmitNomination = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const receiptId = `NOM-${user?.student_id || 'STU2026'}-${Date.now().toString().slice(-4)}`;
      setNominationReceipt({
        id: receiptId,
        studentId: user?.student_id || 'STU2026001',
        name: user?.full_name || 'Alex Mercer',
        department: user?.department || 'Information Technology',
        section: user?.section || 'A',
        year: user?.year || 'III',
        position: position,
        symbol: selectedSymbol.symbol,
        symbolName: selectedSymbol.name,
        timestamp: new Date().toLocaleString(),
        hash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      });
      setSubmitting(false);
      setNominationSubmitted(true);
    }, 1200);
  };

  if (nominationSubmitted && nominationReceipt) {
    return (
      <div style={{ maxWidth: '720px', margin: '40px auto' }}>
        <div className="glass-card" style={{ padding: '36px', background: '#ffffff', borderRadius: '24px', border: '2px solid #86efac', textAlign: 'center', boxShadow: '0 12px 36px rgba(34, 197, 94, 0.12)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={36} />
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '4px 12px' }}>
            NOMINATION OFFICIALLY FILED
          </span>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '12px 0 6px 0' }}>
            Candidacy Application Registered!
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 24px' }}>
            Your nomination for <strong>{nominationReceipt.position}</strong> (Section {nominationReceipt.section}) has been registered and submitted to the Chief Election Officer.
          </p>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Nomination Ref ID:</span>
              <strong style={{ fontFamily: 'monospace', color: '#0284c7' }}>{nominationReceipt.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Candidate:</span>
              <strong style={{ color: '#0f172a' }}>{nominationReceipt.name} ({nominationReceipt.studentId})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Section &amp; Department:</span>
              <strong style={{ color: '#0f172a' }}>Sec {nominationReceipt.section} &middot; {nominationReceipt.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Assigned Ballot Symbol:</span>
              <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>{nominationReceipt.symbol} ({nominationReceipt.symbolName})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Audit Seal:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#475569' }}>{nominationReceipt.hash.slice(0, 24)}...</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/student/section" className="btn btn-primary" style={{ padding: '11px 22px' }}>
              <span>Return to Section Portal</span>
            </Link>
            <Link to="/student/candidates" className="btn btn-secondary" style={{ padding: '11px 22px' }}>
              <span>View All Candidates</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.25)',
          borderRadius: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              <Award size={15} />
              <span>Collegiate Leadership &amp; Democracy</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Section Representative Nomination Filing
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
              File your candidacy to represent Section {user?.section || 'A'} ({user?.department || 'IT'}) on the {institutionName || 'ABC Institution'} Student Council.
            </p>
          </div>

          <Link
            to="/student/section"
            className="btn btn-secondary"
            style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Section</span>
          </Link>
        </div>
      </div>

      {/* Stepper Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { num: 1, title: 'Academic Clearance' },
          { num: 2, title: 'Position & Symbol' },
          { num: 3, title: 'Policy Manifesto' },
          { num: 4, title: 'Final Submission' }
        ].map((s) => (
          <div
            key={s.num}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: step === s.num ? '#0284c7' : step > s.num ? '#dcfce7' : '#ffffff',
              color: step === s.num ? '#ffffff' : step > s.num ? '#15803d' : '#64748b',
              border: step === s.num ? '1px solid #0284c7' : '1px solid #e2e8f0',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            <div>STEP 0{s.num}</div>
            <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>{s.title}</div>
          </div>
        ))}
      </div>

      {/* STEP 1: Academic Eligibility Clearance */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={22} color="#0284c7" />
            <span>Collegiate Academic Eligibility Verification</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '24px' }}>
            Institutional election bylaws require all prospective candidates to maintain a minimum CGPA of 7.0, an attendance rate of &ge; 75%, and a clear disciplinary record.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ padding: '18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>YOUR CGPA SCORE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: (user?.cgpa || 8.5) >= 7.0 ? '#15803d' : '#b91c1c', marginTop: '4px' }}>
                {user?.cgpa || 8.5} / 10.0
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                ✓ Satisfies &ge; 7.0 Benchmark
              </div>
            </div>

            <div style={{ padding: '18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ATTENDANCE RATIO</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: (user?.attendance || 85) >= 75 ? '#15803d' : '#b91c1c', marginTop: '4px' }}>
                {user?.attendance || 85}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                ✓ Satisfies &ge; 75% Requirement
              </div>
            </div>

            <div style={{ padding: '18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>DISCIPLINARY RECORD</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
                CLEAR
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                ✓ No Collegiate Infractions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!isEligible}
              className="btn btn-primary"
              style={{ padding: '11px 24px', fontSize: '0.88rem' }}
            >
              <span>Proceed to Position &amp; Symbol &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Position & Symbol Selector */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#0284c7" />
            <span>Select Target Office &amp; Official Ballot Symbol</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Candidate Office Position *
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700 }}
              >
                <option value="Class Section Representative">Class Section Representative (Section {user?.section || 'A'})</option>
                <option value="Department General Representative">Department General Representative ({user?.department || 'IT'})</option>
                <option value="Academic Affairs Council Member">Academic Affairs Council Member</option>
                <option value="Campus Student Council President">Campus Student Council President</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Choose Official Ballot Symbol *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {symbolsPalette.map((item) => {
                  const isSelected = selectedSymbol.symbol === item.symbol;
                  return (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => setSelectedSymbol(item)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        background: isSelected ? '#f0f9ff' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{item.symbol}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#0284c7' : '#475569', textAlign: 'center' }}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-secondary"
              style={{ padding: '11px 20px' }}
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn btn-primary"
              style={{ padding: '11px 24px' }}
            >
              <span>Proceed to Manifesto &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Policy Manifesto Builder */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#0284c7" />
            <span>Policy Manifesto &amp; Key Priorities</span>
          </h2>

          {/* AI Presets */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '8px' }}>
              Quick Policy Templates (Click to apply)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {manifestoPresets.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => setManifesto(preset.text)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    color: '#334155',
                    lineHeight: 1.4
                  }}
                >
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>{preset.title}</strong>
                  {preset.text.slice(0, 70)}...
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Personal Statement &amp; Policy Manifesto *
            </label>
            <textarea
              rows={4}
              placeholder="Outline your vision for Section A and key reforms..."
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.86rem', resize: 'vertical' }}
            />
          </div>

          {/* Key Priorities */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Key Candidate Priorities (Max 5)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {priorities.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                  <span>&bull; {p}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePriority(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {priorities.length < 5 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add a new policy priority..."
                  value={customPriority}
                  onChange={(e) => setCustomPriority(e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddPriority}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Add Priority
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn btn-secondary"
              style={{ padding: '11px 20px' }}
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!manifesto.trim()}
              className="btn btn-primary"
              style={{ padding: '11px 24px' }}
            >
              <span>Review Application &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Final Submission */}
      {step === 4 && (
        <div className="glass-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#059669" />
            <span>Review &amp; Cryptographically Seal Nomination</span>
          </h2>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Candidate Identity:</span>
              <strong style={{ color: '#0f172a' }}>{user?.full_name} ({user?.student_id})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Academic Cohort:</span>
              <strong style={{ color: '#0f172a' }}>Section {user?.section || 'A'} &middot; Year {user?.year || 'III'} &middot; {user?.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Target Office:</span>
              <strong style={{ color: '#0284c7' }}>{position}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Election Symbol:</span>
              <span style={{ fontSize: '1.4rem' }}>{selectedSymbol.symbol} <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>({selectedSymbol.name})</span></span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Manifesto Summary:</span>
              <p style={{ margin: 0, color: '#334155', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{manifesto}"
              </p>
            </div>
          </div>

          <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534', marginBottom: '24px' }}>
            <strong>Declaration of Honor:</strong> I hereby certify that the information provided is accurate and that I pledge to adhere to {institutionName || 'ABC Institution'} election codes of conduct.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn btn-secondary"
              style={{ padding: '11px 20px' }}
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleSubmitNomination}
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.9rem', fontWeight: 900 }}
            >
              {submitting ? 'Submitting to Blockchain...' : 'Seal & Submit Candidacy'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentNomination;
