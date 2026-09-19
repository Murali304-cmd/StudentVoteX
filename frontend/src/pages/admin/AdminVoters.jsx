import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  Activity
} from 'lucide-react';

export function AdminVoters() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVoters = async () => {
      setLoading(true);
      try {
        const data = await api.students.list({ eligibility: 'ELIGIBLE' });
        setStudents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const filtered = students.filter(s =>
    !search ||
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Voter Registry & Participation Status
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Official list of verified and eligible student voters across all ABC Institution departments.
          </p>
        </div>

        <div className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
          <CheckCircle2 size={15} />
          <span>Total Eligible Voters: {students.length}</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px' }}
            placeholder="Search eligible voters by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Year / Section</th>
              <th>ID Verification</th>
              <th>Eligibility</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                  <StudentVoiceXLoader
                    mode="card"
                    size={48}
                    label="Loading Voter Eligibility Roster..."
                    sublabel="Verifying Smartcard Registration & Ballot Authorization..."
                  />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No voters found matching search.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.student_id}</strong></td>
                  <td>{s.full_name}</td>
                  <td>{s.department}</td>
                  <td>Year {s.year} ({s.section})</td>
                  <td>
                    <span className={`badge ${
                      s.verification_status === 'VERIFIED' ? 'badge-emerald' :
                      s.verification_status === 'UNDER_REVIEW' ? 'badge-indigo' : 'badge-amber'
                    }`}>
                      {s.verification_status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-cyan">{s.eligibility}</span>
                  </td>
                  <td>
                    <span className={`badge ${s.status === 'ACTIVE' ? 'badge-emerald' : 'badge-rose'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
