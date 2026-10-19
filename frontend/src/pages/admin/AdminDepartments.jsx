import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Building2,
  Plus,
  Hash,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Layers,
  Send,
  RefreshCw,
  Search,
  ExternalLink,
  Crown,
  Download,
  Trash2
} from 'lucide-react';
import { exportDepartmentRosterCSV } from '../../utils/exportRoster';

export function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatedIdData, setGeneratedIdData] = useState(null);
  const [generatingForDept, setGeneratingForDept] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);

  // DR & Class Roster Modal States
  const [drModalDept, setDrModalDept] = useState(null);
  const [drStudents, setDrStudents] = useState([]);
  const [selectedDrRoll, setSelectedDrRoll] = useState('');
  const [selectedDrName, setSelectedDrName] = useState('');
  const [selectedDrTitle, setSelectedDrTitle] = useState('Head Department Representative (Electoral DR)');
  const [isUpdatingDr, setIsUpdatingDr] = useState(false);

  const [rosterModalDept, setRosterModalDept] = useState(null);
  const [rosterDeptStudents, setRosterDeptStudents] = useState([]);
  const [loadingRosterData, setLoadingRosterData] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [rollPrefix, setRollPrefix] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.departments.list();
      setDepartments(Array.isArray(res) ? res : res.results || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Open DR appointment modal
  const handleOpenDrModal = async (dept) => {
    setDrModalDept(dept);
    setSelectedDrRoll(dept.representative_roll || '');
    setSelectedDrName(dept.representative_name || '');
    setSelectedDrTitle('Head Department Representative (Electoral DR)');
    try {
      const res = await api.students.list({ department: dept.name });
      const list = Array.isArray(res) ? res : res?.results || [];
      setDrStudents(list);
    } catch (e) {
      setDrStudents([]);
    }
  };

  const handleSaveDr = async (e) => {
    e.preventDefault();
    if (!selectedDrRoll.trim() || !selectedDrName.trim()) {
      alert('Please enter Representative Name and Roll Number.');
      return;
    }
    try {
      setIsUpdatingDr(true);
      await api.departments.update({
        code: drModalDept.code,
        representative_name: selectedDrName.trim(),
        representative_roll: selectedDrRoll.trim().toUpperCase(),
        representative_title: selectedDrTitle.trim()
      });
      setDrModalDept(null);
      await fetchDepartments();
    } catch (err) {
      alert('Failed to appoint DR: ' + err.message);
    } finally {
      setIsUpdatingDr(false);
    }
  };

  // Open Class Roster download modal
  const handleOpenRosterModal = async (dept) => {
    setRosterModalDept(dept);
    setLoadingRosterData(true);
    try {
      const res = await api.students.list({ department: dept.name });
      const list = Array.isArray(res) ? res : res?.results || [];
      setRosterDeptStudents(list);
    } catch (e) {
      setRosterDeptStudents([]);
    } finally {
      setLoadingRosterData(false);
    }
  };

  const handleDownloadFilteredRoster = (yr = '', sec = '') => {
    if (!rosterModalDept) return;
    const filtered = rosterDeptStudents.filter(s => {
      const matchYr = !yr || s.year === yr;
      const matchSec = !sec || s.section === sec;
      return matchYr && matchSec;
    });

    exportDepartmentRosterCSV(filtered, {
      department: rosterModalDept.name,
      year: yr || 'All Classes',
      section: sec || 'All Sections',
      institutionName: 'Muralidharan College of Technology'
    });
  };

  const handleDeleteDepartment = async (dept) => {
    if (!confirm(`Are you sure you want to permanently delete department "${dept.name}" (${dept.code})?`)) {
      return;
    }
    try {
      await api.departments.delete(dept.code);
      setDepartments(prev => prev.filter(d => d.code !== dept.code));
      fetchDepartments();
    } catch (err) {
      alert("Failed to delete department: " + err.message);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !rollPrefix.trim()) {
      setFormError('Please fill in all required fields (Code, Name, and Roll Prefix).');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      await api.departments.create({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        roll_prefix: rollPrefix.trim().toUpperCase(),
        head_of_department_email: hodEmail.trim() || `${code.toLowerCase()}.hod@abc.edu`
      });

      setShowAddModal(false);
      setCode('');
      setName('');
      setRollPrefix('');
      setHodEmail('');
      await fetchDepartments();
    } catch (err) {
      setFormError(err.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateStudentId = async (deptCode) => {
    try {
      setGeneratingForDept(deptCode);
      const res = await api.departments.generateId(deptCode);
      setGeneratedIdData(res);
      // Refresh list to update current sequence
      await fetchDepartments();
    } catch (err) {
      alert("Error generating Student ID: " + err.message);
    } finally {
      setGeneratingForDept(null);
    }
  };

  const handleCopyId = (val) => {
    navigator.clipboard.writeText(val);
    alert(`Copied "${val}" to clipboard!`);
  };

  const filteredDepts = departments.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.code?.toLowerCase().includes(search.toLowerCase()) ||
    d.roll_prefix?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <Building2 size={16} />
            Academic Registry &middot; Roll Identity Sequencing
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Institutional Departments &amp; Student ID Sequences
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
            Manage collegiate departments, configure unique department roll prefixes, and auto-generate unique cryptographic student identifiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchDepartments}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Generated ID Alert Banner */}
      {generatedIdData && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1.5px solid #86efac',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#22c55e', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                Successfully Generated Unique Student ID ({generatedIdData.department})
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', letterSpacing: '0.04em', marginTop: '2px' }}>
                {generatedIdData.student_id}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#166534' }}>
                Sequence #{generatedIdData.sequence_number} &middot; Prefix: {generatedIdData.prefix}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleCopyId(generatedIdData.student_id)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Copy size={14} />
              <span>Copy ID</span>
            </button>
            <button
              type="button"
              onClick={() => setGeneratedIdData(null)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search & Statistics Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search departments or prefix..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748b' }}>
          <div><strong>Total Depts:</strong> {departments.length}</div>
          <div>&middot;</div>
          <div><strong>Mailing Lists:</strong> Automated Active</div>
        </div>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading departments &amp; identity sequences...
        </div>
      ) : filteredDepts.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
          <Building2 size={40} style={{ margin: '0 auto 12px auto', color: '#94a3b8' }} />
          <p style={{ fontWeight: 700, margin: 0 }}>No departments found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredDepts.map((dept) => (
            <div
              key={dept.id || dept.code}
              className="glass-card"
              style={{
                padding: '22px',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.95rem'
                    }}>
                      {dept.code}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {dept.name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        Code: <strong>{dept.code}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      border: '1px solid #bae6fd'
                    }}>
                      {dept.student_count || 0} Students
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteDepartment(dept)}
                      className="btn btn-sm"
                      style={{
                        padding: '3px 7px',
                        fontSize: '0.7rem',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title="Permanently Delete Department"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Info List */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Roll No Prefix:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#0f172a', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                      {dept.roll_prefix}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Current Sequence:</span>
                    <strong style={{ color: '#0f172a' }}>#{dept.current_count || dept.current_sequence_number || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Crown size={13} color="#f59e0b" /> Department Rep:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#92400e', fontSize: '0.76rem' }}>
                        {dept.representative_name ? `${dept.representative_name} (${dept.representative_roll})` : 'Awaiting Appointment'}
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleOpenDrModal(dept)}
                        style={{
                          border: '1px solid #fde68a',
                          background: '#fef3c7',
                          color: '#92400e',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          padding: '2px 7px',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}
                        title="Appoint or edit Department Representative"
                      >
                        Edit DR
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Dept Mail Broadcast:</span>
                    <span style={{ color: '#0284c7', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} />
                      {dept.contact_email || dept.head_of_department_email || `${dept.code.toLowerCase()}.hod@abc.edu`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleGenerateStudentId(dept.code)}
                  disabled={generatingForDept === dept.code}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: '#0284c7',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd'
                  }}
                  title="Generate next sequential student ID in this department"
                >
                  <Sparkles size={14} />
                  <span>Next {dept.code} ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenRosterModal(dept)}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                  title="Download class and section rosters for this department"
                >
                  <Download size={14} />
                  <span>Class Rosters</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appoint / Edit Department Representative (DR) Modal */}
      {drModalDept && (
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
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={24} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                  Appoint Department Representative (DR)
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {drModalDept.name} &middot; Prefix: <code style={{ color: '#0284c7', fontWeight: 800 }}>{drModalDept.roll_prefix}</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveDr} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Quick Select from existing students */}
              {drStudents.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Select from Registered Department Students
                  </label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const found = drStudents.find(s => (s.roll_number || s.student_id) === e.target.value);
                      if (found) {
                        setSelectedDrRoll(found.roll_number || found.student_id);
                        setSelectedDrName(found.full_name);
                      }
                    }}
                    value={selectedDrRoll}
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  >
                    <option value="">-- Choose a student or enter manually below --</option>
                    {drStudents.map(s => (
                      <option key={s.id} value={s.roll_number || s.student_id}>
                        {s.roll_number || s.student_id} - {s.full_name} ({s.year || '3rd Year'} Sec {s.section || 'A'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muralidharan K"
                  value={selectedDrName}
                  onChange={(e) => setSelectedDrName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Representative Roll Number * (e.g. {drModalDept.roll_prefix}001)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${drModalDept.roll_prefix}001`}
                  value={selectedDrRoll}
                  onChange={(e) => setSelectedDrRoll(e.target.value.toUpperCase())}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Official DR Title / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head Department Representative (Electoral DR)"
                  value={selectedDrTitle}
                  onChange={(e) => setSelectedDrTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDrModalDept(null)}
                  className="btn btn-secondary"
                  disabled={isUpdatingDr}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdatingDr}
                  style={{ background: '#d97706', borderColor: '#b45309' }}
                >
                  {isUpdatingDr ? 'Saving...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class & Section Electoral Roster Download Modal */}
      {rosterModalDept && (
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '28px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                    Download Class Roster
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    {rosterModalDept.name} &middot; {rosterDeptStudents.length} Registered Voters
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRosterModalDept(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Whole Department Master Download */}
              <div style={{
                background: '#f0f9ff',
                border: '1.5px solid #bae6fd',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.92rem' }}>
                    Whole Department Master Roster
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    All 4 Years &amp; All Sections ({rosterDeptStudents.length} students)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadFilteredRoster('', '')}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', padding: '8px 14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download Master CSV</span>
                </button>
              </div>

              {/* By Separate Class / Year */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Download by Separate Academic Class / Year
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => {
                    const count = rosterDeptStudents.filter(s => s.year === yr).length;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => handleDownloadFilteredRoster(yr, '')}
                        className="btn btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          fontSize: '0.80rem',
                          fontWeight: 700
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Download size={13} color="#0284c7" />
                          <span>{yr}</span>
                        </span>
                        <span style={{ fontSize: '0.70rem', color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* By Section */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Download by Class Section (A, B, C)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['A', 'B', 'C'].map((sec) => {
                    const count = rosterDeptStudents.filter(s => s.section === sec).length;
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => handleDownloadFilteredRoster('', sec)}
                        className="btn btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        <span>Section {sec}</span>
                        <span style={{ fontSize: '0.70rem', color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setRosterModalDept(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Register Academic Department
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Configure roll identifier prefix and notification channel.
                </p>
              </div>
            </div>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Department Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIML, MECH, CIVIL, BT"
                  value={code}
                  onChange={(e) => {
                    const c = e.target.value.toUpperCase();
                    setCode(c);
                    if (!rollPrefix || rollPrefix.startsWith('STU2026')) {
                      setRollPrefix(`STU2026${c}`);
                    }
                  }}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Department Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dept of Artificial Intelligence & Machine Learning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Roll Number Unique Prefix *
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU2026AIML"
                  value={rollPrefix}
                  onChange={(e) => setRollPrefix(e.target.value.toUpperCase())}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Department Head / Notice Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. aiml.hod@abc.edu"
                  value={hodEmail}
                  onChange={(e) => setHodEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export default AdminDepartments;
