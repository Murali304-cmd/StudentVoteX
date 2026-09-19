import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  User
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await api.elections.list();
        setElections(data.filter(e => e.status === 'ACTIVE'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const isVerified = user?.verification_status === 'VERIFIED';
  const isEligible = user?.eligibility === 'ELIGIBLE';

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="glass-card" style={{ padding: '28px 32px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(240, 253, 244, 0.9) 100%)', border: '1.5px solid #0284c7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-indigo">ABC Institution Student Voter</span>
              <span className="badge badge-cyan">{user?.department}</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome, {user?.full_name || 'Student Voter'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Student ID: <strong>{user?.student_id}</strong> • Year {user?.year} (Sec {user?.section})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/student/voting-session" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <Vote size={18} />
              <span>Enter Controlled Voting Chamber</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Status Check Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        {/* ID Verification Status */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>IDENTITY VERIFICATION</span>
            <div style={{ background: isVerified ? '#d1fae5' : '#fef3c7', padding: '6px', borderRadius: '8px', color: isVerified ? '#059669' : '#d97706' }}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isVerified ? '#059669' : '#d97706' }}>
            {user?.verification_status || 'NOT_SUBMITTED'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {isVerified ? (
              <span>✓ Institution Smart Card Verified</span>
            ) : (
              <Link to="/student/id-verification" style={{ color: '#0284c7', fontWeight: 600 }}>
                Upload ID Card for Approval &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Eligibility Status */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>VOTER ELIGIBILITY</span>
            <div style={{ background: isEligible ? '#e0f2fe' : '#ffe4e6', padding: '6px', borderRadius: '8px', color: isEligible ? '#0284c7' : '#e11d48' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isEligible ? '#0284c7' : '#e11d48' }}>
            {user?.eligibility || 'ELIGIBLE'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Authorized for ABC Institution 2026 Elections
          </div>
        </div>

        {/* Security Environment */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>SESSION SECURITY</span>
            <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '8px', color: '#4f46e5' }}>
              <Lock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4f46e5' }}>
            Controlled Chamber
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Fullscreen lock & Live Camera active
          </div>
        </div>
      </div>

      {/* Active Elections Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Active ABC Institution Elections
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Select an election to view candidates and proceed to the controlled voting chamber.
            </p>
          </div>

          <span className="badge badge-emerald">
            {elections.length} Active Digital Ballot{elections.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <StudentVoiceXLoader
                mode="card"
                label="Loading Active Ballots & Live Polling Status..."
                sublabel="Querying Campus Access Gateway & Identity Entitlements..."
              />
            </div>
          ) : elections.map((el) => (
            <div key={el.id} style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>ACTIVE</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {el.candidates?.length || 0} Candidates
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                  {el.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {el.description}
                </p>
              </div>

              <Link
                to="/student/voting-session"
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.84rem' }}
              >
                <span>Vote Now (Controlled Mode)</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
