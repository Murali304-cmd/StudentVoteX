import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Building2,
  FileCheck2,
  ShieldCheck,
  KeyRound,
  Phone,
  Mail,
  Calendar,
  Layers
} from 'lucide-react';

export function StudentProfile() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Student Voter Profile
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Official student credentials and institutional identity records on ABC Institution election system.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Profile Card */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '14px',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)'
          }}>
            {user?.full_name?.charAt(0) || 'S'}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {user?.full_name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Student ID: <strong>{user?.student_id}</strong>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <span className="badge badge-indigo">{user?.department}</span>
            <span className={`badge ${user?.verification_status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'}`}>
              {user?.verification_status}
            </span>
          </div>
        </div>

        {/* Right Details Grid */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
            Academic & Verification Metadata
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Academic Department</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.department}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Academic Year & Section</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>Year {user?.year} • Section {user?.section}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Institutional Email</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.email || `${user?.student_id?.toLowerCase()}@abcinstitution.edu`}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Smart ID Card</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{user?.id_card_number || `ABC-ID-${user?.student_id}`}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Voting Eligibility Status</div>
              <div style={{ fontWeight: 600, color: 'var(--emerald-primary)', marginTop: '4px' }}>✓ {user?.eligibility}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Account Provisioning</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>Admin Provisioned (Active)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
