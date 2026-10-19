import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstitution } from '../../context/InstitutionContext';
import { api } from '../../services/api';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';
import {
  Crown,
  Building2,
  Users,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  FileText,
  Mail,
  UserCheck,
  ShieldCheck,
  Award,
  Vote,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export function StudentDepartmentRepHub() {
  const { user } = useAuth();
  const { institutionName } = useInstitution();

  const [departmentData, setDepartmentData] = useState(null);
  const [students, setStudents] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state for class and section
  const [yearFilter, setYearFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // DR Grievance / Class Motion Form State
  const [motionTopic, setMotionTopic] = useState('');
  const [motionCategory, setMotionCategory] = useState('ACADEMIC_LABS');
  const [motionDescription, setMotionDescription] = useState('');
  const [motionSubmitted, setMotionSubmitted] = useState(false);
  const [motionList, setMotionList] = useState([
    {
      id: 1,
      topic: 'Request for Extra GPU Lab Access during Election Hackathon',
      category: 'Lab Infrastructure',
      author: 'Student Class Council (Sec A)',
      status: 'UNDER_DR_REVIEW',
      date: 'Today, 10:15 AM'
    },
    {
      id: 2,
      topic: 'Class Representative Voting Kiosk Scheduling (Room 302)',
      category: 'EVM Logistics',
      author: 'Class 3rd Year Reps',
      status: 'APPROVED_BY_DR',
      date: 'Yesterday, 04:30 PM'
    }
  ]);

  // DR Official Broadcast Notice (Only visible/editable by DR)
  const isUserDR = user?.is_representative;
  const [broadcastNotice, setBroadcastNotice] = useState(
    'All department students are requested to complete ID card verification before voting. Polling booths in Lab 301 will operate from 09:00 AM to 12:00 PM.'
  );
  const [editingBroadcast, setEditingBroadcast] = useState(false);
  const [tempNotice, setTempNotice] = useState(broadcastNotice);

  const deptName = user?.department || 'Information Technology';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptsRes, studentsRes, electionsRes] = await Promise.all([
          api.departments.list().catch(() => []),
          api.students.list({ department: deptName }).catch(() => []),
          api.elections.list().catch(() => [])
        ]);

        const deptList = Array.isArray(deptsRes) ? deptsRes : deptsRes?.results || [];
        const currentDept = deptList.find(d => d.name.toLowerCase() === deptName.toLowerCase()) || {
          name: deptName,
          code: 'IT',
          roll_prefix: '7678BIT',
          representative_name: 'Muralidharan K',
          representative_roll: '7678BIT001',
          contact_email: 'it.representative@abc.edu'
        };
        setDepartmentData(currentDept);

        const sList = Array.isArray(studentsRes) ? studentsRes : studentsRes?.results || [];
        setStudents(sList);

        const elList = Array.isArray(electionsRes) ? electionsRes : electionsRes?.results || [];
        const deptElections = elList.filter(e => 
          e.department?.toLowerCase() === deptName.toLowerCase() ||
          e.title?.toLowerCase().includes('department') ||
          e.title?.toLowerCase().includes(deptName.toLowerCase())
        );
        setElections(deptElections);

      } catch (err) {
        console.error('Failed to load DR Hub data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deptName]);

  // Filter students based on year, section, and search
  const filteredStudents = students.filter(s => {
    const matchYear = !yearFilter || s.year === yearFilter;
    const matchSec = !sectionFilter || s.section === sectionFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch = !term ||
      (s.full_name || '').toLowerCase().includes(term) ||
      (s.roll_number || s.student_id || '').toLowerCase().includes(term);
    return matchYear && matchSec && matchSearch;
  });

  const handleDownloadRoster = (yr = yearFilter, sec = sectionFilter) => {
    exportDepartmentRosterCSV(filteredStudents, {
      department: deptName,
      year: yr || 'All Classes',
      section: sec || 'All Sections',
      institutionName: institutionName || 'Muralidharan College of Technology'
    });
  };

  const handleAddMotion = (e) => {
    e.preventDefault();
    if (!motionTopic.trim() || !motionDescription.trim()) return;

    const newMotion = {
      id: Date.now(),
      topic: motionTopic.trim(),
      category: motionCategory === 'ACADEMIC_LABS' ? 'Academic Labs' : motionCategory === 'EVM_LOGISTICS' ? 'EVM Logistics' : 'General Welfare',
      author: `${user?.full_name || 'Student'} (${user?.roll_number || user?.student_id || '7678BIT001'})`,
      status: 'SUBMITTED_TO_DR',
      date: 'Just now'
    };

    setMotionList([newMotion, ...motionList]);
    setMotionTopic('');
    setMotionDescription('');
    setMotionSubmitted(true);
    setTimeout(() => setMotionSubmitted(false), 5000);
  };

  const handleSaveBroadcast = () => {
    setBroadcastNotice(tempNotice);
    setEditingBroadcast(false);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Top Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(2, 132, 199, 0.12) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '22px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.06, pointerEvents: 'none' }}>
          <Crown size={280} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              <Crown size={16} color="#f59e0b" />
              Department Directorate &middot; {deptName}
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Department Representative &amp; Electoral Directorate
            </h1>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: '6px 0 0 0', maxWidth: '650px' }}>
              Official democratic hub for <strong>{deptName}</strong>. Roll sequence: <code style={{ color: '#0284c7', fontWeight: 800 }}>{departmentData?.roll_prefix || '7678BIT'}001, {departmentData?.roll_prefix || '7678BIT'}002...</code> Connect with your DR, download class rosters, and submit class motions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleDownloadRoster()}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                padding: '11px 18px',
                background: '#ffffff'
              }}
              title="Download official department voter roster CSV"
            >
              <Download size={16} />
              <span>Download Dept Roster ({filteredStudents.length})</span>
            </button>

            {isUserDR ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '11px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.86rem',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
              }}>
                <Crown size={18} />
                <span>You are the Elected DR</span>
              </span>
            ) : (
              <a
                href="#submit-motion"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  padding: '11px 20px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                  textDecoration: 'none'
                }}
              >
                <Send size={15} />
                <span>Submit Motion to DR</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* DR Spotlight Card & Official Circular */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>

        {/* 1. Elected Representative Profile Card */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={22} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Elected Department Representative (DR)
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Academic Session 2026–2027 &middot; Collegiate Council
                </span>
              </div>
            </div>

            <span style={{
              background: '#ecfdf5',
              color: '#059669',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid #a7f3d0'
            }}>
              OFFICIALLY APPOINTED
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.7rem',
              fontWeight: 900,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              flexShrink: 0
            }}>
              {departmentData?.representative_name ? departmentData.representative_name.charAt(0) : 'M'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#92400e' }}>
                {departmentData?.representative_name || 'Muralidharan K'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>
                ROLL: {departmentData?.representative_roll || '7678BIT001'} &middot; Year III
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78350f', marginTop: '4px', fontWeight: 600 }}>
                {user?.representative_title || 'Head Department Representative (Electoral DR)'}
              </div>
            </div>
          </div>

          {/* Quick Rep Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>REPRESENTED</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{students.length || 23}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Voters</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ACTIVE CLASSES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>4 Years</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Sec A, B, C</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>MOTIONS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{motionList.length}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Resolved</div>
            </div>
          </div>
        </div>

        {/* 2. Official DR Circular / Broadcast */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Official DR Department Circular
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Broadcast to All Classes &amp; Sections ({deptName})
                  </span>
                </div>
              </div>

              {isUserDR && !editingBroadcast && (
                <button
                  type="button"
                  onClick={() => { setTempNotice(broadcastNotice); setEditingBroadcast(true); }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '5px 10px', fontWeight: 700 }}
                >
                  Edit Notice
                </button>
              )}
            </div>

            {editingBroadcast ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  className="input-field"
                  rows={4}
                  value={tempNotice}
                  onChange={(e) => setTempNotice(e.target.value)}
                  style={{ width: '100%', fontSize: '0.86rem', resize: 'vertical' }}
                  placeholder="Enter official circular text for your department students..."
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingBroadcast(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBroadcast}
                    className="btn btn-primary"
                    style={{ fontSize: '0.76rem', padding: '6px 14px' }}
                  >
                    Publish to Department
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '0.86rem',
                color: '#334155',
                lineHeight: 1.6,
                fontStyle: 'italic',
                position: 'relative'
              }}>
                <div style={{ fontSize: '1.4rem', color: '#94a3b8', lineHeight: 0.5, marginBottom: '6px' }}>“</div>
                {broadcastNotice}
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', fontStyle: 'normal' }}>
                  <span>Published by {departmentData?.representative_name || 'Department Representative'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Today, 09:00 AM
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Roster Download by Class */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              1-Click Class Roster Downloads (CSV)
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    const classList = students.filter(s => s.year === yr);
                    exportDepartmentRosterCSV(classList, {
                      department: deptName,
                      year: yr,
                      institutionName: institutionName || 'Muralidharan College of Technology'
                    });
                  }}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.72rem',
                    padding: '6px 10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={12} />
                  <span>{yr}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Class & Section Electoral Roster Section */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#0284c7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Department Student Name List &amp; Voter Roster
              </h3>
            </div>
            <p style={{ fontSize: '0.80rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Filter by individual Class (Year I–IV) and Section (A, B, C) with standardized roll IDs ({departmentData?.roll_prefix || '7678BIT'}...).
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadRoster()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.84rem' }}
          >
            <Download size={16} />
            <span>Export Filtered Roster ({filteredStudents.length} Students)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <div style={{ flex: 1.5, minWidth: '200px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px', fontSize: '0.84rem' }}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              className="input-field"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              <option value="">All Classes (I - IV)</option>
              <option value="1st Year">1st Year (I)</option>
              <option value="2nd Year">2nd Year (II)</option>
              <option value="3rd Year">3rd Year (III)</option>
              <option value="4th Year">4th Year (IV)</option>
            </select>
          </div>

          <div style={{ minWidth: '130px' }}>
            <select
              className="input-field"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Table of Students */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Roll Number</th>
                <th style={{ padding: '12px 16px' }}>Student Name</th>
                <th style={{ padding: '12px 16px' }}>Class / Year</th>
                <th style={{ padding: '12px 16px' }}>Section</th>
                <th style={{ padding: '12px 16px' }}>Representative Role</th>
                <th style={{ padding: '12px 16px' }}>Voter Clearance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No students match the selected class or section filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const roll = s.roll_number || s.student_id;
                  const isDR = s.is_representative;
                  return (
                    <tr
                      key={s.id || idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isDR ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>
                        {roll}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                        {s.full_name}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        {s.year || '3rd Year'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 700 }}>
                        Sec {s.section || 'A'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isDR ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            border: '1px solid #fde68a'
                          }}>
                            <Crown size={12} color="#f59e0b" />
                            <span>Dept Representative</span>
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>Voter</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#ecfdf5',
                          color: '#059669',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.72rem'
                        }}>
                          <CheckCircle2 size={12} />
                          <span>{s.verification_status || 'VERIFIED'}</span>
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

      {/* Class Motion & Grievance Portal to DR */}
      <div id="submit-motion" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Submit Form */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Submit Class Motion / Grievance to DR
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Direct petition to your elected Department Representative
              </span>
            </div>
          </div>

          {motionSubmitted && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>Your motion has been transmitted to {departmentData?.representative_name || 'the DR'} desk!</span>
            </div>
          )}

          <form onSubmit={handleAddMotion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Motion Title / Topic
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Request extension of lab hours before election..."
                value={motionTopic}
                onChange={(e) => setMotionTopic(e.target.value)}
                style={{ width: '100%', fontSize: '0.84rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                className="input-field"
                value={motionCategory}
                onChange={(e) => setMotionCategory(e.target.value)}
                style={{ width: '100%', fontSize: '0.84rem' }}
              >
                <option value="ACADEMIC_LABS">Academic &amp; Lab Infrastructure</option>
                <option value="EVM_LOGISTICS">EVM Polling Booth Logistics</option>
                <option value="STUDENT_WELFARE">Class &amp; Student Welfare</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Detailed Description &amp; Resolution Requested
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Explain the background and specific action requested from your DR..."
                value={motionDescription}
                onChange={(e) => setMotionDescription(e.target.value)}
                style={{ width: '100%', fontSize: '0.84rem', resize: 'vertical' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800, marginTop: '4px' }}
            >
              <Send size={15} />
              <span>Transmit Motion to DR Desk</span>
            </button>
          </form>
        </div>

        {/* Existing Motions Feed */}
        <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Active Department Class Motions
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Live transparent petition registry
                </span>
              </div>
            </div>

            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
              {motionList.length} Motions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {motionList.map((m) => (
              <div
                key={m.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    {m.topic}
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: m.status === 'APPROVED_BY_DR' ? '#ecfdf5' : '#fef3c7',
                    color: m.status === 'APPROVED_BY_DR' ? '#059669' : '#b45309',
                    border: m.status === 'APPROVED_BY_DR' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                  }}>
                    {m.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>{m.author} &middot; <strong style={{ color: '#0284c7' }}>{m.category}</strong></span>
                  <span>{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
