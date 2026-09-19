import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { UserCheck, Search, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function EVMVoters() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await api.students.list();
        setStudents(res.data?.results || res.data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Student Voter Roster & Eligibility
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Check institutional verification status and on-campus voting eligibility records.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 20px' }}>Student Name</th>
              <th style={{ padding: '14px 20px' }}>Institution ID</th>
              <th style={{ padding: '14px 20px' }}>Department & Year</th>
              <th style={{ padding: '14px 20px' }}>Verification Status</th>
              <th style={{ padding: '14px 20px' }}>Voting Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{s.full_name}</td>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 700 }}>{s.student_id}</td>
                <td style={{ padding: '14px 20px', color: '#475569' }}>{s.department} • {s.year}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: s.verification_status === 'VERIFIED' ? '#d1fae5' : '#fef3c7',
                      color: s.verification_status === 'VERIFIED' ? '#059669' : '#d97706'
                    }}
                  >
                    {s.verification_status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.eligibility === 'ELIGIBLE' ? '#10b981' : '#e11d48' }}>
                    ● {s.eligibility}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMVoters;
