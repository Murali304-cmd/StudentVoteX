import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';
import { useInstitution } from '../../context/InstitutionContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building2,
  AlertCircle,
  RefreshCw,
  Eye,
  Lock,
  CreditCard,
  QrCode,
  Building,
  Wifi,
  Sparkles,
  Download,
  RotateCw,
  Crown,
  Printer,
  FileText,
  Check,
  Copy,
  X
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

export function AdminStudents() {
  const { institutionName } = useInstitution();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');
  const [repFilter, setRepFilter] = useState('ALL'); // 'ALL' | 'REP_ONLY'

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchDept, setBatchDept] = useState('Information Technology');
  const [batchYear, setBatchYear] = useState('3rd Year');
  const [batchSection, setBatchSection] = useState('A');
  const [batchCount, setBatchCount] = useState(5);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingIdStudent, setViewingIdStudent] = useState(null);
  const [viewingIdQr, setViewingIdQr] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [copiedRoll, setCopiedRoll] = useState(null);

  // Live Preview QR in Add/Edit modal
  const [livePreviewQr, setLivePreviewQr] = useState('');
  const [livePreviewHash, setLivePreviewHash] = useState('');

  // Form State
  const initialForm = {
    student_id: '',
    roll_number: '',
    full_name: '',
    department: 'Information Technology',
    year: '3rd Year',
    section: 'A',
    email: '',
    phone: '',
    username: '',
    temporary_password: 'Student@123',
    id_card_number: '',
    eligibility: 'ELIGIBLE',
    status: 'ACTIVE',
    verification_status: 'VERIFIED',
    is_representative: false,
    representative_title: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter && deptFilter !== 'ALL') params.department = deptFilter;
      if (yearFilter && yearFilter !== 'ALL') params.year = yearFilter;
      if (sectionFilter && sectionFilter !== 'ALL') params.section = sectionFilter;
      if (eligibilityFilter && eligibilityFilter !== 'ALL') params.eligibility = eligibilityFilter;
      const data = await api.students.list(params);
      const list = Array.isArray(data) ? data : data?.results || [];
      setStudents(list);
    } catch (e) {
      console.error("Error fetching students:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [deptFilter, yearFilter, sectionFilter, eligibilityFilter]);

  // Live QR and Hash generation for the modal
  useEffect(() => {
    const sId = formData.roll_number || formData.student_id || '7678BIT001';
    const sName = formData.full_name || 'STUDENT NAME';
    const payload = `MCT-VERIFY:${sId}`;

    QRCode.toDataURL(payload, {
      width: 180,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    }).then(setLivePreviewQr).catch(console.error);

    const rawData = `${sId}:${sName}:MURALIDHARAN-COLLEGE`;
    const encoder = new TextEncoder();
    crypto.subtle.digest('SHA-256', encoder.encode(rawData)).then((buf) => {
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setLivePreviewHash(hash);
    });
  }, [formData.student_id, formData.roll_number, formData.full_name, formData.department]);

  // When opening ID Card view modal for an existing student
  useEffect(() => {
    if (!viewingIdStudent) {
      setViewingIdQr('');
      return;
    }
    const payload = viewingIdStudent.id_card_qr_ref || `MCT-VERIFY:${viewingIdStudent.roll_number || viewingIdStudent.student_id}`;
    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    }).then(setViewingIdQr).catch(console.error);
  }, [viewingIdStudent]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Auto-generate roll number in 7678BIT001, 7678BCS001 format
  const handleAutoGenerateIDs = (dept) => {
    const d = dept || formData.department;
    let prefix = '7678BIT';
    const found = DEPARTMENTS_LIST.find(item => item.name.toLowerCase() === d.toLowerCase());
    if (found) {
      prefix = found.prefix;
    } else {
      if (d.includes('Computer')) prefix = '7678BCS';
      else if (d.includes('Electronics') || d.includes('Communication')) prefix = '7678BEC';
      else if (d.includes('Mechanical')) prefix = '7678BME';
      else if (d.includes('Artificial') || d.includes('Data')) prefix = '7678BAD';
      else if (d.includes('Electrical')) prefix = '7678BEE';
      else if (d.includes('Civil')) prefix = '7678BCE';
    }

    const nextSeq = String(Math.floor(10 + Math.random() * 89)).padStart(3, '0');
    const fullRoll = `${prefix}${nextSeq}`;
    setFormData((prev) => ({
      ...prev,
      student_id: fullRoll,
      roll_number: fullRoll,
      username: fullRoll,
      id_card_number: fullRoll,
      department: d
    }));
  };

  // Batch Provision Class Handler
  const handleBatchGenerate = async (e) => {
    e.preventDefault();
    setIsBatchGenerating(true);
    try {
      const foundDept = DEPARTMENTS_LIST.find(d => d.name.toLowerCase() === batchDept.toLowerCase());
      const prefix = foundDept ? foundDept.prefix : '7678BIT';
      
      const existing = students.filter(s => (s.roll_number || s.student_id || '').startsWith(prefix));
      let maxSeq = 0;
      existing.forEach(s => {
        const numPart = (s.roll_number || s.student_id || '').replace(prefix, '');
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed) && parsed > maxSeq) maxSeq = parsed;
      });

      const sampleNames = [
        'Vigneshwaran M', 'Divya Bharathi R', 'Siddharth V', 'Ananya S', 'Praveen Kumar K',
        'Soundarya N', 'Karthikeyan B', 'Nithya Shree T', 'Madhavan E', 'Keerthana P'
      ];

      for (let i = 1; i <= Number(batchCount); i++) {
        const seqNum = maxSeq + i;
        const seq = String(seqNum).padStart(3, '0');
        const roll = `${prefix}${seq}`;
        const name = sampleNames[(seqNum - 1) % sampleNames.length] || `Student ${seq}`;
        await api.students.create({
          username: roll,
          password: 'Student@123',
          email: `${roll.toLowerCase()}@abc.edu`,
          full_name: name,
          student_id: roll,
          roll_number: roll,
          department: batchDept,
          year: batchYear,
          section: batchSection,
          role: 'STUDENT',
          cgpa: (8.0 + (i % 15) * 0.1).toFixed(2),
          attendance: 80 + (i % 18),
          verification_status: 'VERIFIED',
          eligibility: 'ELIGIBLE'
        });
      }

      setShowBatchModal(false);
      await fetchStudents();
    } catch (err) {
      alert('Batch provision error: ' + err.message);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const prefix = '7678BIT';
    const nextSeq = String(students.length + 1).padStart(3, '0');
    const fullRoll = `${prefix}${nextSeq}`;
    setFormData({
      ...initialForm,
      student_id: fullRoll,
      roll_number: fullRoll,
      username: fullRoll,
      id_card_number: fullRoll,
      department: 'Information Technology'
    });
    setModalError('');
    setModalSuccess('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id || student.roll_number || '',
      roll_number: student.roll_number || student.student_id || '',
      full_name: student.full_name || '',
      department: student.department || 'Information Technology',
      year: student.year || '3rd Year',
      section: student.section || 'A',
      email: student.email || '',
      phone: student.phone || '',
      username: student.username || student.roll_number || student.student_id || '',
      temporary_password: student.temporary_password || 'Student@123',
      id_card_number: student.id_card_number || student.roll_number || student.student_id || '',
      eligibility: student.eligibility || 'ELIGIBLE',
      status: student.status || 'ACTIVE',
      verification_status: student.verification_status || 'VERIFIED',
      is_representative: Boolean(student.is_representative),
      representative_title: student.representative_title || ''
    });
    setModalError('');
    setModalSuccess('');
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    try {
      if (editingStudent) {
        await api.students.update(editingStudent.id, formData);
        setModalSuccess('Student credential record updated successfully!');
      } else {
        await api.students.create(formData);
        setModalSuccess('Student successfully enrolled and smartcard issued!');
      }
      setTimeout(() => {
        setShowAddModal(false);
        fetchStudents();
      }, 900);
    } catch (err) {
      setModalError(err.message || 'Operation failed');
    }
  };

  const handleToggleRepresentative = async (student) => {
    const newStatus = !student.is_representative;
    const defaultTitle = newStatus ? `${student.department} Representative (DR)` : '';
    try {
      await api.students.update(student.id, {
        ...student,
        is_representative: newStatus,
        representative_title: defaultTitle
      });
      fetchStudents();
    } catch (e) {
      alert("Failed to update representative status: " + e.message);
    }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await api.students.update(student.id, { ...student, status: newStatus });
      fetchStudents();
    } catch (e) {
      alert("Failed to toggle status: " + e.message);
    }
  };

  const handleResetPassword = async (student) => {
    const newPass = prompt(`Reset password for ${student.full_name}:`, "Student@123");
    if (!newPass) return;
    try {
      await api.students.update(student.id, { ...student, temporary_password: newPass });
      alert(`Password updated for ${student.student_id}.`);
      fetchStudents();
    } catch (e) {
      alert("Failed to reset password: " + e.message);
    }
  };

  const handleDelete = async (student) => {
    const ident = student.id || student.roll_number || student.student_id;
    if (confirm(`Are you sure you want to permanently delete student ${student.full_name} (${student.roll_number || student.student_id})?`)) {
      try {
        await api.students.delete(ident);
        setStudents(prev => prev.filter(s => s.id !== student.id && s.student_id !== student.student_id));
        fetchStudents();
      } catch (e) {
        alert("Failed to delete student: " + e.message);
      }
    }
  };

  const handleCopyRoll = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRoll(text);
    setTimeout(() => setCopiedRoll(null), 2000);
  };

  // Filter students based on representative status
  const displayedStudents = students.filter(s => {
    if (repFilter === 'REP_ONLY') return s.is_representative;
    return true;
  });

  // Download official CSV roster
  const handleDownloadCSV = () => {
    exportDepartmentRosterCSV(displayedStudents, {
      department: deptFilter || 'All Departments',
      year: yearFilter || 'All Years',
      section: sectionFilter || 'All Sections',
      institutionName: institutionName || 'Muralidharan College of Technology'
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4px 0' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            <Building2 size={15} />
            Institutional Student Roster &amp; Department Directorate
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Student Registry &amp; Department Representatives
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
            Manage collegiate student voter IDs (format: <code style={{ color: '#0284c7', fontWeight: 800 }}>7678BIT001, 7678BCS001...</code>), appoint Department Representatives (DR), and export verifiable electoral rolls.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            title="Download CSV list of filtered department students"
          >
            <Download size={16} />
            <span>Download Voter Roll ({displayedStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            title="Open printable official department roster sheet"
          >
            <Printer size={16} />
            <span>Print Official Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', borderColor: '#bae6fd' }}
            title="Provision a batch of students with sequential roll numbers"
          >
            <Sparkles size={16} />
            <span>Batch Provision Class</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
          >
            <UserPlus size={16} />
            <span>Provision Student</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter & Search Bar with Separate Class & Section */}
      <div className="glass-card" style={{ padding: '20px 22px', marginBottom: '22px', borderRadius: '18px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Keyword Search */}
          <div style={{ flex: '1.4', minWidth: '220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px', width: '100%' }}
              placeholder="Search by Name, Roll No (e.g. 7678BIT001), or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '190px', flex: '1' }}>
            <select
              className="input-field"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: '100%', fontWeight: 600 }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS_LIST.map(d => (
                <option key={d.code} value={d.name}>{d.name} ({d.prefix})</option>
              ))}
            </select>
          </div>

          {/* Separate Class / Year Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              className="input-field"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year (I)</option>
              <option value="2nd Year">2nd Year (II)</option>
              <option value="3rd Year">3rd Year (III)</option>
              <option value="4th Year">4th Year (IV)</option>
            </select>
          </div>

          {/* Separate Section Filter */}
          <div style={{ minWidth: '120px' }}>
            <select
              className="input-field"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Representative Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="input-field"
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="ALL">All Students</option>
              <option value="REP_ONLY">👑 Representatives Only</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} />
            <span>Filter</span>
          </button>

          {(search || deptFilter || yearFilter || sectionFilter || repFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setDeptFilter('');
                setYearFilter('');
                setSectionFilter('');
                setRepFilter('ALL');
                setEligibilityFilter('');
                fetchStudents();
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 12px' }}
              title="Reset all filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </form>

        {/* Quick Department Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, alignSelf: 'center', marginRight: '4px' }}>
            Quick Dept:
          </span>
          {DEPARTMENTS_LIST.map(d => {
            const isSelected = deptFilter === d.name;
            return (
              <button
                key={d.code}
                type="button"
                onClick={() => setDeptFilter(isSelected ? '' : d.name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #0284c7' : '1px solid var(--border-medium)',
                  background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-secondary)',
                  color: isSelected ? '#0284c7' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {d.code} ({d.prefix})
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container" style={{ borderRadius: '18px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Institutional Roll No</th>
              <th>Full Name &amp; Contact</th>
              <th>Department, Year &amp; Sec</th>
              <th>Department Representative</th>
              <th>Smartcard Badge</th>
              <th>Verification</th>
              <th>Eligibility</th>
              <th>Account</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px' }}>
                  <StudentVoiceXLoader
                    mode="card"
                    size={48}
                    label="Loading Institutional Department Roster..."
                    sublabel="Synchronizing Cryptographic Roll Keys (7678B...) & Verification Digests..."
                  />
                </td>
              </tr>
            ) : displayedStudents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <Building2 size={36} style={{ color: '#94a3b8', margin: '0 auto 10px auto', display: 'block' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>No student records found</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try clearing your department or class filters.</div>
                </td>
              </tr>
            ) : (
              displayedStudents.map((stu) => {
                const rollVal = stu.roll_number || stu.student_id;
                const isCopied = copiedRoll === rollVal;
                return (
                  <tr key={stu.id} style={{ transition: 'background 0.15s' }}>
                    {/* Roll No */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          fontSize: '0.92rem',
                          color: '#0284c7',
                          letterSpacing: '0.03em',
                          background: 'rgba(2, 132, 199, 0.08)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(2, 132, 199, 0.2)'
                        }}>
                          {rollVal}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRoll(rollVal)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: isCopied ? '#10b981' : '#94a3b8', padding: '2px' }}
                          title="Copy Roll Number"
                        >
                          {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        ID: {stu.student_id}
                      </div>
                    </td>

                    {/* Name & Contact */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {stu.full_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {stu.email || `${rollVal.toLowerCase()}@muralidharan.edu`}
                      </div>
                    </td>

                    {/* Department, Year & Section */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {stu.department}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                        {stu.year} &middot; <strong style={{ color: '#0f172a' }}>Sec {stu.section}</strong>
                      </div>
                    </td>

                    {/* Department Representative Badge */}
                    <td>
                      {stu.is_representative ? (
                        <span
                          className="badge badge-amber"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
                          }}
                        >
                          <Crown size={12} color="#f59e0b" />
                          <span>{stu.representative_title || 'Department Rep'}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Student Voter
                        </span>
                      )}
                    </td>

                    {/* Smartcard */}
                    <td>
                      <button
                        type="button"
                        onClick={() => setViewingIdStudent(stu)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#e0f2fe',
                          border: '1px solid #bae6fd',
                          color: '#0284c7',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Inspect Smartcard QR & Cryptographic Hash"
                      >
                        <CreditCard size={13} />
                        <span>{rollVal}</span>
                      </button>
                    </td>

                    {/* Verification */}
                    <td>
                      <span className={`badge ${
                        stu.verification_status === 'VERIFIED' ? 'badge-emerald' :
                        stu.verification_status === 'UNDER_REVIEW' ? 'badge-indigo' :
                        stu.verification_status === 'REJECTED' ? 'badge-rose' : 'badge-amber'
                      }`}>
                        {stu.verification_status}
                      </span>
                    </td>

                    {/* Eligibility */}
                    <td>
                      <span className={`badge ${stu.eligibility === 'ELIGIBLE' ? 'badge-cyan' : 'badge-rose'}`}>
                        {stu.eligibility}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td>
                      <button
                        onClick={() => handleToggleStatus(stu)}
                        className={`badge ${stu.status === 'ACTIVE' ? 'badge-emerald' : 'badge-rose'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {stu.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '5px' }}>
                        {/* Toggle Representative */}
                        <button
                          type="button"
                          onClick={() => handleToggleRepresentative(stu)}
                          className="btn btn-secondary"
                          style={{
                            padding: '5px 7px',
                            background: stu.is_representative ? '#fef3c7' : undefined,
                            borderColor: stu.is_representative ? '#fcd34d' : undefined
                          }}
                          title={stu.is_representative ? "Relieve Department Representative" : "Appoint as Department Representative"}
                        >
                          <Crown size={13} color={stu.is_representative ? '#b45309' : '#64748b'} />
                        </button>

                        <button
                          onClick={() => setViewingIdStudent(stu)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 7px' }}
                          title="View & Inspect ID Card"
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          onClick={() => handleResetPassword(stu)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 7px' }}
                          title="Reset Password"
                        >
                          <KeyRound size={13} />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(stu)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 7px' }}
                          title="Edit Student"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          onClick={() => handleDelete(stu)}
                          className="btn btn-danger"
                          style={{ padding: '5px 7px' }}
                          title="Delete Student"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════════════
          PRINTABLE OFFICIAL ELECTORAL ROSTER MODAL
          ════════════════════════════════════════ */}
      {showPrintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '2px solid #0284c7'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Printer size={20} color="#0284c7" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Official Electoral Roster &amp; Polling Verification Sheet
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Standard ISO/IEC 27001 Cryptographic Polling Station Roll
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, color: '#0f172a' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '18px' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {institutionName || 'MURALIDHARAN COLLEGE OF TECHNOLOGY'}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                  ELECTORAL COMMISSION &middot; DEPARTMENT VOTER ROLL 2026
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.78rem', color: '#475569', marginTop: '8px' }}>
                  <span>Department: <strong>{deptFilter || 'All Departments'}</strong></span>
                  <span>&middot;</span>
                  <span>Class: <strong>{yearFilter || 'All Years'}</strong></span>
                  <span>&middot;</span>
                  <span>Section: <strong>{sectionFilter || 'All Sections'}</strong></span>
                  <span>&middot;</span>
                  <span>Total Voters: <strong>{displayedStudents.length}</strong></span>
                </div>
              </div>

              {/* Roster Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #0f172a' }}>
                    <th style={{ padding: '8px', textAlign: 'center', width: '40px' }}>S.No</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Roll Number</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Student Name</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Department &amp; Class</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Role / Status</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Eligibility</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '140px' }}>Voter Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((s, idx) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '7px 8px', fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>{s.roll_number || s.student_id}</td>
                      <td style={{ padding: '7px 8px', fontWeight: 700 }}>{s.full_name}</td>
                      <td style={{ padding: '7px 8px', color: '#475569' }}>{s.department} ({s.year} - {s.section})</td>
                      <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                        {s.is_representative ? <strong style={{ color: '#d97706' }}>👑 DR</strong> : 'Voter'}
                      </td>
                      <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
                        {s.eligibility}
                      </td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px dashed #cbd5e1' }}></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Presiding Signatures Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #cbd5e1', fontSize: '0.8rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', borderBottom: '1px solid #0f172a', marginBottom: '6px' }}></div>
                  <span>Presiding EVM Officer Signature</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', borderBottom: '1px solid #0f172a', marginBottom: '6px' }}></div>
                  <span>Department Representative (DR)</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', borderBottom: '1px solid #0f172a', marginBottom: '6px' }}></div>
                  <span>Dean / Chief Election Officer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          ADD / EDIT STUDENT MODAL (With 7678B... Auto-Generation)
          ════════════════════════════════════════ */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1.5px solid var(--border-medium)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  {editingStudent ? `Edit Student: ${formData.roll_number || formData.student_id}` : 'Enroll New Student & Issue Smartcard'}
                </h3>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Assign official institutional roll numbers in format: <strong style={{ color: '#0284c7' }}>7678BIT001, 7678BCS001...</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
                style={{ padding: '6px' }}
              >
                <X size={16} />
              </button>
            </div>

            {modalError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', marginBottom: '14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} />
                <span>{modalSuccess}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', alignItems: 'start' }}>
              {/* Form Column */}
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                    Identity &amp; Department Credentials
                  </span>
                  {!editingStudent && (
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateIDs()}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: '#e0f2fe',
                        color: '#0284c7',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ Next Roll No (7678B...)
                    </button>
                  )}
                </div>

                {/* Roll Number & ID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Roll Number * (e.g. 7678BIT001)
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="7678BIT001"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value, student_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Student ID Ref
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="7678BIT001"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Full Student Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                {/* Department, Year & Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Department
                    </label>
                    <select
                      className="input-field"
                      value={formData.department}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setFormData({ ...formData, department: newDept });
                        if (!editingStudent) handleAutoGenerateIDs(newDept);
                      }}
                    >
                      {DEPARTMENTS_LIST.map(d => (
                        <option key={d.code} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Year
                    </label>
                    <select
                      className="input-field"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Section
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="A"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="student@muralidharan.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="+91 98450 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Representative Toggle & Title */}
                <div style={{
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '14px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 800, color: '#b45309' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_representative}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          is_representative: checked,
                          representative_title: checked ? `${formData.department} Representative (DR)` : ''
                        });
                      }}
                      style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }}
                    />
                    <span>Designate as Department Representative (DR)</span>
                  </label>

                  {formData.is_representative && (
                    <input
                      type="text"
                      className="input-field"
                      style={{ marginTop: '8px', fontSize: '0.8rem' }}
                      placeholder="e.g. IT Department Representative (DR)"
                      value={formData.representative_title}
                      onChange={(e) => setFormData({ ...formData, representative_title: e.target.value })}
                    />
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingStudent ? 'Save Modifications' : 'Enroll & Issue Smartcard'}
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>

              {/* Live Preview Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '16px',
                padding: '18px',
                color: '#ffffff',
                border: '1.5px solid #0284c7',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
                    {institutionName ? institutionName.toUpperCase() : 'MURALIDHARAN COLLEGE OF TECHNOLOGY'}
                  </span>
                  <span style={{ fontSize: '0.62rem', background: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    SMART ID
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '54px',
                    height: '66px',
                    borderRadius: '8px',
                    background: '#334155',
                    border: '1.5px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#38bdf8'
                  }}>
                    {formData.full_name ? formData.full_name.charAt(0) : 'S'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#f8fafc' }}>
                      {formData.full_name || 'STUDENT NAME'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>
                      {formData.roll_number || '7678BIT001'}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#cbd5e1' }}>
                      {formData.department}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                      Year {formData.year} &middot; Sec {formData.section}
                    </div>
                  </div>

                  {livePreviewQr && (
                    <div style={{ background: '#ffffff', padding: '3px', borderRadius: '6px' }}>
                      <img src={livePreviewQr} alt="QR" style={{ width: '48px', height: '48px', display: 'block' }} />
                    </div>
                  )}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.62rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                  SHA-256: <span style={{ color: '#38bdf8' }}>{livePreviewHash.slice(0, 24)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          VIEW STUDENT SMART ID CARD MODAL
          ════════════════════════════════════════ */}
      {viewingIdStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid #0284c7'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#0284c7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Cryptographic Smart ID Card
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingIdStudent(null)}
                className="btn btn-secondary"
                style={{ padding: '6px' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Smartcard Surface */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '16px',
              padding: '20px',
              color: '#ffffff',
              border: '2px solid #38bdf8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.04em' }}>
                  {institutionName ? institutionName.toUpperCase() : 'MURALIDHARAN COLLEGE OF TECHNOLOGY'}
                </span>
                <span className={`badge ${viewingIdStudent.verification_status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  {viewingIdStudent.verification_status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 70px', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '70px', height: '84px', borderRadius: '10px', background: '#1e293b', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
                  {viewingIdStudent.full_name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{viewingIdStudent.full_name}</div>
                  <div style={{ fontSize: '0.80rem', color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>
                    Roll: {viewingIdStudent.roll_number || viewingIdStudent.student_id}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{viewingIdStudent.department}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Year {viewingIdStudent.year} &middot; Sec {viewingIdStudent.section}</div>
                  {viewingIdStudent.is_representative && (
                    <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.62rem', background: '#f59e0b', color: '#000000', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>
                      👑 {viewingIdStudent.representative_title || 'Department Rep'}
                    </span>
                  )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '3px', background: '#ffffff', borderRadius: '6px', display: 'inline-block' }}>
                    {viewingIdQr && <img src={viewingIdQr} alt="QR" style={{ width: '64px', height: '64px', display: 'block' }} />}
                  </div>
                  <div style={{ fontSize: '0.52rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>EVM VERIFY</div>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.64rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                Hash: <span style={{ color: '#38bdf8' }}>{viewingIdStudent.id_card_hash || 'SHA256:VERIFIED'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                Print Badge
              </button>
              <button
                type="button"
                onClick={() => setViewingIdStudent(null)}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Provision Class Modal */}
      {showBatchModal && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                  Batch Provision Class Cohort
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Auto-generate student roll numbers (e.g. <code style={{ color: '#0284c7', fontWeight: 800 }}>7678BIT001...</code>) with default verification.
                </p>
              </div>
            </div>

            <form onSubmit={handleBatchGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Target Department *
                </label>
                <select
                  className="input-field"
                  value={batchDept}
                  onChange={(e) => setBatchDept(e.target.value)}
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  {DEPARTMENTS_LIST.map(d => (
                    <option key={d.code} value={d.name}>{d.name} ({d.prefix})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Class / Year *
                  </label>
                  <select
                    className="input-field"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="1st Year">1st Year (I)</option>
                    <option value="2nd Year">2nd Year (II)</option>
                    <option value="3rd Year">3rd Year (III)</option>
                    <option value="4th Year">4th Year (IV)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Section *
                  </label>
                  <select
                    className="input-field"
                    value={batchSection}
                    onChange={(e) => setBatchSection(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Number of Students to Provision (1 to 20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontWeight: 800 }}
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.76rem', color: '#64748b' }}>
                <div>🔑 Default Password: <strong style={{ color: '#0f172a' }}>Student@123</strong></div>
                <div>🛡️ Verification Status: <strong style={{ color: '#059669' }}>VERIFIED (Auto Clearance)</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="btn btn-secondary"
                  disabled={isBatchGenerating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isBatchGenerating}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isBatchGenerating ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
                  <span>{isBatchGenerating ? 'Provisioning...' : `Generate ${batchCount} Students`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminStudents;
