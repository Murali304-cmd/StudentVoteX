import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
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
  RotateCw
} from 'lucide-react';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingIdStudent, setViewingIdStudent] = useState(null);
  const [viewingIdQr, setViewingIdQr] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

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
    verification_status: 'VERIFIED'
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department = deptFilter;
      if (eligibilityFilter) params.eligibility = eligibilityFilter;
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
  }, [deptFilter, eligibilityFilter]);

  // Live QR and Hash generation for the modal
  useEffect(() => {
    const sId = formData.student_id || 'STU2026001';
    const sName = formData.full_name || 'STUDENT NAME';
    const payload = `ABC-VERIFY:${sId}`;

    QRCode.toDataURL(payload, {
      width: 180,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    }).then(setLivePreviewQr).catch(console.error);

    // Compute live SHA-256 hash
    const rawData = `${sId}:${sName}:ABC-INSTITUTION`;
    const encoder = new TextEncoder();
    crypto.subtle.digest('SHA-256', encoder.encode(rawData)).then((buf) => {
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setLivePreviewHash(hash);
    });
  }, [formData.student_id, formData.full_name, formData.department]);

  // When opening ID Card view modal for an existing student
  useEffect(() => {
    if (!viewingIdStudent) {
      setViewingIdQr('');
      return;
    }
    const payload = viewingIdStudent.id_card_qr_ref || `ABC-VERIFY:${viewingIdStudent.student_id}`;
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

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const nextSeq = String(students.length + 1).padStart(3, '0');
    setFormData({
      ...initialForm,
      student_id: `ABC-IT-2026-${nextSeq}`,
      roll_number: `2024IT${nextSeq}`,
      username: `STU2026${nextSeq}`,
      id_card_number: `ABC-IT-2026-${nextSeq}`
    });
    setModalError('');
    setModalSuccess('');
    setShowAddModal(true);
  };

  const handleAutoGenerateIDs = (dept) => {
    const d = dept || formData.department;
    let code = 'IT';
    if (d.includes('Computer')) code = 'CS';
    else if (d.includes('Electronics') || d.includes('Communication')) code = 'EE';
    else if (d.includes('Mechanical')) code = 'ME';
    else if (d.includes('Civil')) code = 'CV';
    else if (d.includes('Bio')) code = 'BT';

    const nextSeq = String(Math.floor(100 + Math.random() * 899));
    setFormData((prev) => ({
      ...prev,
      student_id: `ABC-${code}-2026-${nextSeq}`,
      roll_number: `2024${code}${nextSeq}`,
      username: `STU2026${nextSeq}`,
      id_card_number: `ABC-${code}-2026-${nextSeq}`,
      department: d
    }));
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id || '',
      roll_number: student.roll_number || student.student_id || '',
      full_name: student.full_name || '',
      department: student.department || 'Information Technology',
      year: student.year || '3rd Year',
      section: student.section || 'A',
      email: student.email || '',
      phone: student.phone || '',
      username: student.username || student.student_id || '',
      temporary_password: student.temporary_password || 'Student@123',
      id_card_number: student.id_card_number || student.student_id || '',
      eligibility: student.eligibility || 'ELIGIBLE',
      status: student.status || 'ACTIVE',
      verification_status: student.verification_status || 'VERIFIED'
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
      }, 1000);
    } catch (err) {
      setModalError(err.message || 'Operation failed');
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
    const newPass = prompt(`Reset temporary password for ${student.full_name}:`, "Student@ABC2026");
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
    if (confirm(`Are you sure you want to delete student ${student.full_name} (${student.student_id})?`)) {
      try {
        await api.students.delete(student.id);
        fetchStudents();
      } catch (e) {
        alert("Failed to delete student: " + e.message);
      }
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Student Registry & Credential Management
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Authorized student provisioning for ABC Institution elections with dynamic cryptographic smartcard issuance.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} />
          <span>Provision New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by Name, Roll No, Student ID, or Username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '220px' }}>
            <select
              className="input-field"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science & Engineering">Computer Science & Eng</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <select
              className="input-field"
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
            >
              <option value="">All Eligibility</option>
              <option value="ELIGIBLE">Eligible</option>
              <option value="INELIGIBLE">Ineligible</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary">
            <Filter size={15} />
            <span>Apply</span>
          </button>

          {(search || deptFilter || eligibilityFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setDeptFilter(''); setEligibilityFilter(''); fetchStudents(); }}
              className="btn btn-secondary"
              style={{ padding: '8px' }}
              title="Reset"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Student Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID / Roll No</th>
              <th>Full Name</th>
              <th>Department & Year</th>
              <th>Digital Smartcard</th>
              <th>Verification Status</th>
              <th>Eligibility</th>
              <th>Account Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                  <StudentVoiceXLoader
                    mode="card"
                    size={48}
                    label="Loading Student Smartcard & Identity Registry..."
                    sublabel="Synchronizing Cryptographic Keys & Verification Digests..."
                  />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No student records found matching filter criteria.
                </td>
              </tr>
            ) : (
              students.map((stu) => (
                <tr key={stu.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{stu.student_id || stu.username}</div>
                    <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700 }}>
                      Roll: {stu.roll_number || stu.student_id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{stu.full_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stu.email || `${(stu.student_id || 'stu').toLowerCase()}@abcinstitution.edu`}</div>
                  </td>
                  <td>
                    <div>{stu.department}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stu.year} • Sec {stu.section}</div>
                  </td>
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
                      title="Inspect Student Smart ID Card"
                    >
                      <CreditCard size={13} />
                      <span>{stu.id_card_number || stu.student_id}</span>
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${
                      stu.verification_status === 'VERIFIED' ? 'badge-emerald' :
                      stu.verification_status === 'UNDER_REVIEW' ? 'badge-indigo' :
                      stu.verification_status === 'REJECTED' ? 'badge-rose' : 'badge-amber'
                    }`}>
                      {stu.verification_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${stu.eligibility === 'ELIGIBLE' ? 'badge-cyan' : 'badge-rose'}`}>
                      {stu.eligibility}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(stu)}
                      className={`badge ${stu.status === 'ACTIVE' ? 'badge-emerald' : 'badge-rose'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle account status"
                    >
                      {stu.status}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setViewingIdStudent(stu)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                        title="View & Inspect ID Card"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleResetPassword(stu)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                        title="Reset Credentials"
                      >
                        <KeyRound size={13} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(stu)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                        title="Edit Student"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(stu)}
                        className="btn btn-danger"
                        style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                        title="Delete Student"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ----------------- Provision / Edit Modal with Live Card Preview ----------------- */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '960px', padding: '28px', maxHeight: '92vh', overflowY: 'auto', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingStudent ? 'Edit Student Credential' : 'Provision New Student & Issue Smartcard'}
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Live cryptographic ID card generator with SHA-256 integrity checksum & EVM QR encoding
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 700 }}>
                ✕
              </button>
            </div>

            {modalError && (
              <div className="badge-rose" style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="badge-emerald" style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} />
                <span>{modalSuccess}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Left Column: Form Controls */}
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                    Student Information
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
                      ⚡ Auto-Generate IDs
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Student ID *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingStudent}
                      className="input-field"
                      placeholder="e.g. ABC-IT-2026-011"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value, id_card_number: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g. 2024IT011"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Student Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
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
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computer Science & Engineering">Computer Science & Eng</option>
                      <option value="Electronics & Communication">Electronics & Comm</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
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
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="student@abcinstitution.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Voting Eligibility
                    </label>
                    <select
                      className="input-field"
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    >
                      <option value="ELIGIBLE">Eligible</option>
                      <option value="INELIGIBLE">Ineligible</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Verification Status
                    </label>
                    <select
                      className="input-field"
                      value={formData.verification_status}
                      onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                    >
                      <option value="VERIFIED">Verified</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingStudent ? 'Save Credential Changes' : 'Enroll Student & Issue Card'}
                  </button>
                </div>
              </form>

              {/* Right Column: Live Interactive Smartcard Preview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                    Live ID Smartcard Preview
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>
                    ⚡ Real-time Generated
                  </span>
                </div>

                {/* PVC Card Render */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0369a1 100%)',
                    borderRadius: '16px',
                    padding: '18px',
                    color: '#ffffff',
                    boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.4)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={16} color="#38bdf8" />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>ABC INSTITUTION</div>
                        <div style={{ fontSize: '0.58rem', color: '#93c5fd' }}>STUDENT SMART VOTER CARD</div>
                      </div>
                    </div>
                    <div style={{ width: '24px', height: '18px', borderRadius: '3px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: '1px solid #78350f' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '62px 1fr 64px', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '62px', height: '74px', borderRadius: '8px', background: '#1e293b', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                      {(formData.full_name || 'S').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                        {formData.full_name || 'STUDENT FULL NAME'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                        Roll No: <span style={{ color: '#ffffff' }}>{formData.roll_number || '2024IT000'}</span>
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#cbd5e1', marginTop: '1px' }}>
                        {formData.department}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                        {formData.year} • Sec {formData.section}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                        {formData.student_id || 'ABC-ID-2026'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ padding: '2px', background: '#ffffff', borderRadius: '6px', display: 'inline-block' }}>
                        {livePreviewQr ? (
                          <img src={livePreviewQr} alt="QR" style={{ width: '54px', height: '54px', display: 'block' }} />
                        ) : (
                          <div style={{ width: '54px', height: '54px', background: '#e2e8f0' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.52rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                        EVM QR
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 8px', fontSize: '0.62rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      SHA-256: <span style={{ color: '#38bdf8' }}>{livePreviewHash ? livePreviewHash.substring(0, 24) + '...' : 'Calculating...'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Cryptographic Binding:</div>
                  Upon submitting, this credential will be cryptographically signed with the ABC Institution Genesis seed and registered on the voting blockchain ledger.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Single Student ID Card Quick View Modal ----------------- */}
      {viewingIdStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '26px', borderRadius: '20px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>ABC INSTITUTION</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>Official Smart ID Card</h3>
              </div>
              <button onClick={() => setViewingIdStudent(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 700 }}>
                ✕
              </button>
            </div>

            {/* Smartcard View */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0369a1 100%)',
                borderRadius: '16px',
                padding: '20px',
                color: '#ffffff',
                boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={16} color="#38bdf8" />
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>ABC INSTITUTION OF TECHNOLOGY</div>
                </div>
                <span className={`badge ${viewingIdStudent.verification_status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  {viewingIdStudent.verification_status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 70px', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '70px', height: '84px', borderRadius: '10px', background: '#1e293b', border: '2px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
                  {viewingIdStudent.full_name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{viewingIdStudent.full_name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>Roll: {viewingIdStudent.roll_number || viewingIdStudent.student_id}</div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>{viewingIdStudent.department}</div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Year {viewingIdStudent.year} • Sec {viewingIdStudent.section}</div>
                  <div style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>{viewingIdStudent.student_id}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ padding: '2px', background: '#ffffff', borderRadius: '6px', display: 'inline-block' }}>
                    {viewingIdQr && <img src={viewingIdQr} alt="QR" style={{ width: '60px', height: '60px', display: 'block' }} />}
                  </div>
                  <div style={{ fontSize: '0.52rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>EVM SCAN</div>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.64rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                Hash: <span style={{ color: '#38bdf8' }}>{viewingIdStudent.id_card_hash || '3f8a9b2c7d...'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                Print Badge
              </button>
              <button
                type="button"
                onClick={() => setViewingIdStudent(null)}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
