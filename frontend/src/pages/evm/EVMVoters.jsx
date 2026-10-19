import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';
import {
  UserCheck,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Building2,
  Crown,
  RefreshCw
} from 'lucide-react';

const DEPARTMENTS_LIST = [
  { code: 'IT', name: 'Information Technology', prefix: '7678BIT' },
  { code: 'CSE', name: 'Computer Science & Engineering', prefix: '7678BCS' },
  { code: 'ECE', name: 'Electronics & Communication', prefix: '7678BEC' },
  { code: 'MECH', name: 'Mechanical Engineering', prefix: '7678BME' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science', prefix: '7678BAD' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering', prefix: '7678BEE' },
  { code: 'CIVIL', name: 'Civil Engineering', prefix: '7678BCE' }
];

export function EVMVoters() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [secFilter, setSecFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (deptFilter && deptFilter !== 'ALL') params.department = deptFilter;
      if (yearFilter && yearFilter !== 'ALL') params.year = yearFilter;
      if (secFilter && secFilter !== 'ALL') params.section = secFilter;
      const res = await api.students.list(params);
      setStudents(Array.isArray(res) ? res : res?.results || res?.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [deptFilter, yearFilter, secFilter]);

  const filtered = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const roll = (s.roll_number || s.student_id || '').toLowerCase();
    const name = (s.full_name || '').toLowerCase();
    const dept = (s.department || '').toLowerCase();
    return name.includes(term) || roll.includes(term) || dept.includes(term);
  });

  const handleDownloadCSV = () => {
    exportDepartmentRosterCSV(filtered, {
      department: deptFilter || 'All Departments',
      year: yearFilter || 'All Years',
      section: secFilter || 'All Sections',
      institutionName: 'Muralidharan College of Technology - EVM Polling Kiosk'
    });
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '6px 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            <Building2 size={15} />
            EVM Presiding Officer Station &middot; Voter Verification Roster
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Department Electoral Roster &amp; Polling Check-In
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px' }}>
            Search student roll numbers (format: <code style={{ color: '#0284c7', fontWeight: 800 }}>7678BIT001, 7678BCS001...</code>), filter by department and class section, and export offline polling sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
          title="Download CSV polling check-in sheet for this department"
        >
          <Download size={16} />
          <span>Download Polling Sheet ({filtered.length})</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1.4, minWidth: '220px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Roll No (e.g. 7678BIT001) or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Department Filter */}
        <div style={{ minWidth: '180px', flex: 1 }}>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS_LIST.map(d => (
              <option key={d.code} value={d.name}>{d.name} ({d.prefix})</option>
            ))}
          </select>
        </div>

        {/* Class Year Filter */}
        <div style={{ minWidth: '130px' }}>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year (I)</option>
            <option value="2nd Year">2nd Year (II)</option>
            <option value="3rd Year">3rd Year (III)</option>
            <option value="4th Year">4th Year (IV)</option>
          </select>
        </div>

        {/* Section Filter */}
        <div style={{ minWidth: '120px' }}>
          <select
            value={secFilter}
            onChange={(e) => setSecFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {(searchTerm || deptFilter || yearFilter || secFilter) && (
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setDeptFilter(''); setYearFilter(''); setSecFilter(''); loadStudents(); }}
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 18px' }}>Roll Number</th>
              <th style={{ padding: '12px 18px' }}>Student Name</th>
              <th style={{ padding: '12px 18px' }}>Department &amp; Class</th>
              <th style={{ padding: '12px 18px' }}>Department Representative</th>
              <th style={{ padding: '12px 18px' }}>Verification Status</th>
              <th style={{ padding: '12px 18px' }}>Voting Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  Loading department voter roster...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No student voters found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const roll = s.roll_number || s.student_id;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        color: '#0284c7',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        background: '#f0f9ff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bae6fd'
                      }}>
                        {roll}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>
                      {s.full_name}
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#475569' }}>
                      <div style={{ fontWeight: 600 }}>{s.department}</div>
                      <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>{s.year} &middot; Sec {s.section}</div>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      {s.is_representative ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          <Crown size={12} color="#f59e0b" />
                          <span>{s.representative_title || 'Department Rep'}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Student Voter</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
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
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: s.eligibility === 'ELIGIBLE' ? '#10b981' : '#e11d48' }}>
                        ● {s.eligibility}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EVMVoters;
