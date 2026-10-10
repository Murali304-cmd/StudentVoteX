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
  ExternalLink
} from 'lucide-react';

export function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatedIdData, setGeneratedIdData] = useState(null);
  const [generatingForDept, setGeneratingForDept] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);

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
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Dept Mail Broadcast:</span>
                    <span style={{ color: '#0284c7', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} />
                      {dept.contact_email || dept.head_of_department_email || `${dept.code.toLowerCase()}.hod@abc.edu`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleGenerateStudentId(dept.code)}
                disabled={generatingForDept === dept.code}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd'
                }}
              >
                <Sparkles size={15} />
                <span>
                  {generatingForDept === dept.code ? 'Generating...' : `Generate Unique ${dept.code} Roll ID`}
                </span>
              </button>
            </div>
          ))}
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
