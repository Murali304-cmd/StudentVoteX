import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ElectionCountdownTimer } from '../../components/common/ElectionCountdownTimer';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  Vote,
  PlusCircle,
  Clock,
  Calendar,
  ShieldCheck,
  Camera,
  FileCheck2,
  Edit2,
  Users,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Globe,
  Radio,
  Sliders,
  Play,
  Pause,
  CheckCheck
} from 'lucide-react';

const DEPARTMENTS = [
  { id: 'ALL', label: '🌐 ALL (Campus-Wide Common)' },
  { id: 'Information Technology', label: '💻 Information Technology (IT)' },
  { id: 'Computer Science & Engineering', label: '🖥️ Computer Science & Engineering (CSE)' },
  { id: 'Electronics & Communication', label: '📡 Electronics & Communication (ECE)' },
  { id: 'Mechanical Engineering', label: '⚙️ Mechanical Engineering' },
  { id: 'Civil Engineering', label: '🏗️ Civil Engineering' },
  { id: 'MBA', label: '📊 Master of Business Administration (MBA)' }
];

export function AdminElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [filterDept, setFilterDept] = useState('ALL_FILTER');

  const nowIso = new Date().toISOString().slice(0, 16);
  const futureIso = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16);

  const initialForm = {
    title: '',
    description: '',
    department: 'ALL',
    status: 'ACTIVE',
    start_date: nowIso,
    end_date: futureIso,
    daily_start_time: '09:00',
    daily_end_time: '16:00',
    voting_hours_enforced: true,
    camera_required: true,
    id_verification_required: true,
    rules: '1. Controlled session required.\n2. Do not switch browser tabs.\n3. Single cryptographic vote per verified student.'
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const data = await api.elections.list();
      setElections(data);
    } catch (e) {
      console.error("Error fetching elections:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleOpenAdd = () => {
    setEditingElection(null);
    setFormData({
      ...initialForm,
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16)
    });
    setShowModal(true);
  };

  const handleOpenEdit = (el) => {
    setEditingElection(el);
    setFormData({
      title: el.title,
      description: el.description || '',
      department: el.department || 'ALL',
      status: el.status,
      start_date: el.start_date ? new Date(el.start_date).toISOString().slice(0, 16) : nowIso,
      end_date: el.end_date ? new Date(el.end_date).toISOString().slice(0, 16) : futureIso,
      daily_start_time: el.daily_start_time || '09:00',
      daily_end_time: el.daily_end_time || '16:00',
      voting_hours_enforced: el.voting_hours_enforced ?? true,
      camera_required: el.camera_required,
      id_verification_required: el.id_verification_required,
      rules: el.rules
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await api.elections.update(editingElection.id, formData);
      } else {
        await api.elections.create(formData);
      }
      setShowModal(false);
      fetchElections();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleQuickStatusChange = async (electionId, newStatus) => {
    try {
      await api.elections.update(electionId, { status: newStatus });
      fetchElections();
    } catch (e) {
      alert("Status update failed: " + e.message);
    }
  };

  const filteredElections = elections.filter((el) => {
    if (filterDept === 'ALL_FILTER') return true;
    if (filterDept === 'CAMPUS_ONLY') return el.department === 'ALL';
    return el.department === filterDept;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', color: '#fff', padding: '8px', borderRadius: '10px' }}>
              <Vote size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Election & Voting Schedule Management
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Configure election start/end windows, daily voting hours, and candidate positions for ABC Institution.
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={16} />
          <span>Create New Election</span>
        </button>
      </div>

      {/* Filter Department Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px'
      }}>
        <button
          type="button"
          onClick={() => setFilterDept('ALL_FILTER')}
          className={`btn ${filterDept === 'ALL_FILTER' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
        >
          All Departments ({elections.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterDept('CAMPUS_ONLY')}
          className={`btn ${filterDept === 'CAMPUS_ONLY' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
        >
          🌐 Campus-Wide
        </button>

        <button
          type="button"
          onClick={() => setFilterDept('Information Technology')}
          className={`btn ${filterDept === 'Information Technology' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
        >
          💻 IT Dept
        </button>

        <button
          type="button"
          onClick={() => setFilterDept('Computer Science & Engineering')}
          className={`btn ${filterDept === 'Computer Science & Engineering' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
        >
          🖥️ CSE Dept
        </button>

        <button
          type="button"
          onClick={() => setFilterDept('Electronics & Communication')}
          className={`btn ${filterDept === 'Electronics & Communication' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap' }}
        >
          📡 ECE Dept
        </button>
      </div>

      {/* Elections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '22px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <StudentVoiceXLoader
              mode="card"
              label="Loading Active & Scheduled Campus Elections..."
              sublabel="Syncing Blockchain Smart Contracts & Ballot Configurations..."
            />
          </div>
        ) : filteredElections.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
            <Layers size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              No Elections for this Department Filter
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Create a new election or switch the department filter above.
            </p>
          </div>
        ) : filteredElections.map((el) => {
          const isCommon = el.department === 'ALL';
          return (
            <div key={el.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Top Badge & Config Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className={`badge ${
                      el.status === 'ACTIVE' ? 'badge-emerald' :
                      el.status === 'COMPLETED' ? 'badge-indigo' :
                      el.status === 'PAUSED' ? 'badge-amber' : 'badge-slate'
                    }`}>
                      {el.status}
                    </span>
                    <span className={`badge ${isCommon ? 'badge-purple' : 'badge-cyan'}`} style={{ fontWeight: 800 }}>
                      {isCommon ? '🌐 Campus-Wide' : `🏢 ${el.department}`}
                    </span>
                  </div>

                  <button onClick={() => handleOpenEdit(el)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                    <Edit2 size={13} />
                    <span>Configure</span>
                  </button>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {el.title}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {el.description || 'Institutional election for ABC Institution.'}
                </p>

                {/* Embedded Live Countdown Timer */}
                <div style={{ marginBottom: '14px' }}>
                  <ElectionCountdownTimer election={el} compact={true} />
                </div>

                {/* Details Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#0284c7" />
                    <span>Daily Voting Hours: <strong>{el.daily_start_time || '09:00'} - {el.daily_end_time || '16:00'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#6366f1" />
                    <span>Window: <strong>{new Date(el.start_date).toLocaleDateString()} - {new Date(el.end_date).toLocaleDateString()}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#0284c7" />
                    <span>Candidates Registered: <strong>{el.candidates?.length || 0}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Vote size={14} color="#10b981" />
                    <span>Total Ballots Finalized: <strong>{el.total_votes || 0}</strong></span>
                  </div>
                </div>
              </div>

              {/* Quick Status Control Bar */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {el.status !== 'ACTIVE' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(el.id, 'ACTIVE')}
                      className="btn btn-sm"
                      style={{ background: '#10b981', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}
                      title="Open Polls & Accept Ballots"
                    >
                      <Play size={12} />
                      <span>Open Polls</span>
                    </button>
                  )}
                  {el.status === 'ACTIVE' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(el.id, 'PAUSED')}
                      className="btn btn-sm"
                      style={{ background: '#f59e0b', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}
                      title="Pause Voting Session"
                    >
                      <Pause size={12} />
                      <span>Pause</span>
                    </button>
                  )}
                  {el.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(el.id, 'COMPLETED')}
                      className="btn btn-sm"
                      style={{ background: '#4f46e5', color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}
                      title="Close Polls & Certify Final Results"
                    >
                      <CheckCheck size={12} />
                      <span>Certify</span>
                    </button>
                  )}
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ABC Institution
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Configure / Create Election */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '28px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              {editingElection ? 'Configure Election & Timing Window' : 'Create New Institutional Election'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Election Title *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. IT Department Representative Election 2026"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Department Scope *
                </label>
                <select
                  className="input-field"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Timing Windows */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Daily Hours Window */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Daily Voting Start (HH:MM)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.daily_start_time}
                    onChange={(e) => setFormData({ ...formData, daily_start_time: e.target.value })}
                    placeholder="09:00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Daily Voting End (HH:MM)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.daily_end_time}
                    onChange={(e) => setFormData({ ...formData, daily_end_time: e.target.value })}
                    placeholder="16:00"
                  />
                </div>
              </div>

              {/* Status and Camera */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Election Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="UPCOMING">Upcoming (Scheduled)</option>
                    <option value="ACTIVE">Active (Voting Open)</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed (Certified)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Camera Verification
                  </label>
                  <select
                    className="input-field"
                    value={formData.camera_required ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, camera_required: e.target.value === 'true' })}
                  >
                    <option value="true">Enforce Live Camera</option>
                    <option value="false">Optional</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  className="input-field"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this election's context and purpose"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Election Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminElections;
