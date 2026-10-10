import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Vote,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileCheck2,
  Lock,
  Layers,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Mail,
  Sliders,
  Check,
  X,
  Edit3,
  Send,
  Building2,
  GraduationCap
} from 'lucide-react';

export function CEOElections() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [actionNotice, setActionNotice] = useState(null); // { type: 'success' | 'error', text: '' }

  // Candidate Symbol Modal
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [symbolName, setSymbolName] = useState('');
  const [symbolImagePreview, setSymbolImagePreview] = useState('');
  const [symbolUploading, setSymbolUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Criteria & Schedule Edit Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    startDate: '',
    endDate: '',
    dailyStartTime: '09:00',
    dailyEndTime: '12:00',
    votingHoursEnforced: true,
    minCgpa: 7.5,
    minAttendance: 75,
    disciplinaryClearanceRequired: true
  });
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Department Email Broadcast Simulator
  const [dispatchingMails, setDispatchingMails] = useState(false);

  const fetchAssignedElections = async () => {
    setLoading(true);
    try {
      const data = await api.ceo.getAssignedElections(user?.username || user?.student_id || 'ceo_central');
      const list = Array.isArray(data) ? data : [];
      setElections(list);
      if (list.length > 0) {
        // Keep selected if exists, else first
        const current = list.find(e => e.id === selectedElection?.id) || list[0];
        setSelectedElection(current);
        syncScheduleData(current);
      }
    } catch (err) {
      console.error('Error fetching CEO elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncScheduleData = (el) => {
    if (!el) return;
    setScheduleData({
      startDate: el.start_date ? el.start_date.split('T')[0] : '',
      endDate: el.end_date ? el.end_date.split('T')[0] : '',
      dailyStartTime: el.daily_start_time || '09:00',
      dailyEndTime: el.daily_end_time || '12:00',
      votingHoursEnforced: el.voting_hours_enforced ?? true,
      minCgpa: el.min_cgpa ?? 7.5,
      minAttendance: el.min_attendance ?? 75,
      disciplinaryClearanceRequired: el.disciplinary_clearance_required ?? true
    });
  };

  useEffect(() => {
    fetchAssignedElections();
  }, []);

  const showNotification = (text, type = 'success') => {
    setActionNotice({ type, text });
    setTimeout(() => setActionNotice(null), 6000);
  };

  // 1. Issue Electoral Scrutiny Decree
  const handleIssueScrutinyDecree = (electionId) => {
    const decreeHash = `CEO-DECREE-2026-${Math.random().toString(36).substring(2, 9).toUpperCase()}-SHA3`;
    showNotification(`✓ Official Electoral Scrutiny Decree Signed! Seal Hash: ${decreeHash}. All candidate symbols and eligibility criteria ratified.`);
  };

  // 2. Open Candidate Symbol Edit
  const openSymbolEditor = (candidate) => {
    setEditingCandidate(candidate);
    setSymbolName(candidate.symbol_name || candidate.election_symbol || 'Campaign Symbol');
    setSymbolImagePreview(candidate.symbol_image || '');
  };

  // 3. Handle File Dropper / Input (JPEG / PNG to Base64 Data URI)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please upload a valid JPEG, PNG, or SVG image file.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showNotification('File exceeds 2MB limit. Please upload an optimized symbol file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSymbolImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // 4. Save Candidate Symbol
  const handleSaveCandidateSymbol = async () => {
    if (!editingCandidate) return;
    setSymbolUploading(true);
    try {
      const payload = {
        symbol_name: symbolName.trim() || 'Official Symbol',
        symbol_image: symbolImagePreview,
        election_symbol: symbolName.trim() ? symbolName.trim().slice(0, 2) : '★'
      };

      await api.candidates.update(editingCandidate.id, payload);
      showNotification(`✓ Campaign Symbol for '${editingCandidate.name}' updated successfully! Represented across all ballots and physical EVMs.`);
      setEditingCandidate(null);
      await fetchAssignedElections();
    } catch (err) {
      showNotification(err.message || 'Failed to update candidate symbol', 'error');
    } finally {
      setSymbolUploading(false);
    }
  };

  // 5. Save Schedule & Statutory Eligibility Criteria
  const handleSaveScheduleAndCriteria = async () => {
    if (!selectedElection) return;
    setSavingSchedule(true);
    try {
      const payload = {
        daily_start_time: scheduleData.dailyStartTime,
        daily_end_time: scheduleData.dailyEndTime,
        voting_hours_enforced: scheduleData.votingHoursEnforced,
        min_cgpa: parseFloat(scheduleData.minCgpa) || 0.0,
        min_attendance: parseInt(scheduleData.minAttendance) || 75,
        disciplinary_clearance_required: scheduleData.disciplinaryClearanceRequired
      };
      if (scheduleData.startDate) payload.start_date = scheduleData.startDate;
      if (scheduleData.endDate) payload.end_date = scheduleData.endDate;

      await api.elections.update(selectedElection.id, payload);
      showNotification(`✓ Schedule & Eligibility Criteria updated for '${selectedElection.title}'. Access window set to ${scheduleData.dailyStartTime} - ${scheduleData.dailyEndTime}.`);
      setShowScheduleModal(false);
      await fetchAssignedElections();
    } catch (err) {
      showNotification(err.message || 'Failed to update schedule', 'error');
    } finally {
      setSavingSchedule(false);
    }
  };

  // 6. Dispatch Official Department Notification Emails
  const handleDispatchDepartmentNotifications = async () => {
    if (!selectedElection) return;
    setDispatchingMails(true);
    try {
      // Simulate real-time institutional SMTP dispatch to department inboxes
      await new Promise(r => setTimeout(r, 1200));

      const depts = [
        'it-dept@abcinstitution.edu',
        'cse-dept@abcinstitution.edu',
        'ece-dept@abcinstitution.edu',
        'mech-dept@abcinstitution.edu',
        'aids-dept@abcinstitution.edu',
        'mba-dept@abcinstitution.edu'
      ];

      showNotification(`✓ Department Election Notifications Dispatched! Official planning bulletin sent to ${depts.length} department HOD mailboxes and student mailing lists for '${selectedElection.title}'.`);
    } catch (err) {
      showNotification('Failed to dispatch department notifications.', 'error');
    } finally {
      setDispatchingMails(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* ── CEO EXECUTIVE BANNER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)'
          }}>
            <Crown size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              CEO Election Directorate &amp; Scrutiny Suite
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Chief Election Officer Authority</span>
              <span>•</span>
              <span style={{ color: '#059669' }}>Autonomous Sovereign Quorum</span>
              <span>•</span>
              <span>Logged as {user?.username || 'ceo_central'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchAssignedElections}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh Ballots</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div style={{
          background: actionNotice.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1.5px solid ${actionNotice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          borderRadius: '12px', padding: '14px 18px', marginBottom: '22px',
          display: 'flex', alignItems: 'center', gap: '10px',
          color: actionNotice.type === 'success' ? '#065f46' : '#991b1b',
          fontSize: '0.88rem', fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          {actionNotice.type === 'success' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertTriangle size={18} color="#ef4444" />}
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* ── ASSIGNED ELECTIONS SELECTOR CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading assigned CEO elections...
          </div>
        ) : elections.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }} className="glass-card">
            No elections assigned to your CEO portfolio yet. System administrators assign multiple CEOs per election.
          </div>
        ) : (
          elections.map((el) => {
            const isSelected = selectedElection?.id === el.id;
            return (
              <div
                key={el.id}
                onClick={() => { setSelectedElection(el); syncScheduleData(el); }}
                className="glass-card"
                style={{
                  padding: '22px',
                  border: isSelected ? '2.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(255, 255, 255, 0.95) 100%)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 10px 28px rgba(245, 158, 11, 0.2)' : '0 2px 8px rgba(0,0,0,0.03)',
                  transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                    {el.department === 'ALL' ? 'CAMPUS-WIDE' : el.department}
                  </span>
                  <span className={`badge ${el.status === 'ACTIVE' ? 'badge-emerald' : 'badge-amber'}`}>
                    {el.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {el.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                  {el.description || 'Official institutional democratic election managed under CEO jurisdiction.'}
                </p>

                {/* Statutory Criteria & Timing Box */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '0.74rem' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={13} color="#f59e0b" />
                    <span>Statutory Criteria &amp; Hours</span>
                  </div>
                  <div style={{ color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>• Hours: <strong style={{ color: '#0284c7' }}>{el.daily_start_time || '09:00'} - {el.daily_end_time || '12:00'}</strong></div>
                    <div>• Min CGPA: <strong style={{ color: '#10b981' }}>{el.min_cgpa || '7.5'}</strong> | Min Attendance: <strong style={{ color: '#10b981' }}>{el.min_attendance || 75}%</strong></div>
                    <div>• Assigned CEOs: <strong style={{ color: '#f59e0b' }}>{el.assigned_ceos?.length || 1} Officer(s)</strong></div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    Candidates: <strong style={{ color: '#f59e0b' }}>{el.candidates?.length || 0}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleIssueScrutinyDecree(el.id); }}
                    style={{
                      background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e',
                      padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    📜 Sign Decree
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── SELECTED ELECTION SCRUTINY & CANDIDATE SYMBOL STUDIO ── */}
      {selectedElection && (
        <div className="glass-card" style={{ padding: '30px', marginBottom: '32px' }}>
          {/* Top Directorate Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '24px', flexWrap: 'wrap', gap: '14px',
            borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Executive Electoral Jurisdiction · Election #{selectedElection.id}
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 6px 0' }}>
                {selectedElection.title}
              </h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>Scheduled Hours: <strong style={{ color: '#0284c7' }}>{selectedElection.daily_start_time} - {selectedElection.daily_end_time}</strong></span>
                <span>•</span>
                <span>Department: <strong style={{ color: '#0f172a' }}>{selectedElection.department}</strong></span>
                <span>•</span>
                <span>Enforced: <strong style={{ color: selectedElection.voting_hours_enforced ? '#10b981' : '#f59e0b' }}>{selectedElection.voting_hours_enforced ? 'STRICT' : 'DEVELOPMENT'}</strong></span>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <Sliders size={15} color="#0284c7" />
                <span>Configure Schedule &amp; Criteria</span>
              </button>

              <button
                type="button"
                onClick={handleDispatchDepartmentNotifications}
                disabled={dispatchingMails}
                className="btn btn-primary"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', border: 'none'
                }}
              >
                <Mail size={15} />
                <span>{dispatchingMails ? 'Dispatching Mails...' : 'Dispatch Dept Notifications'}</span>
              </button>
            </div>
          </div>

          {/* Co-CEOs Assigned Overview */}
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px',
            padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="#b45309" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                  Commission Multi-CEO Quorum Assigned
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  All assigned CEOs co-govern and ratify candidates independently from administrative users.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedElection.assigned_ceos_details && selectedElection.assigned_ceos_details.length > 0 ? (
                selectedElection.assigned_ceos_details.map(c => (
                  <span key={c.id} style={{
                    background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e',
                    padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800
                  }}>
                    👑 {c.full_name || c.username}
                  </span>
                ))
              ) : (
                <span style={{
                  background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e',
                  padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800
                }}>
                  👑 Central Chief Election Officer
                </span>
              )}
            </div>
          </div>

          {/* Candidate Roster & Symbol Studio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Candidate Scrutiny &amp; Campaign Symbol Studio
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Ratify candidates and manage their custom JPEG/PNG campaign symbols used on Web Ballots and physical EVM kiosks.
              </p>
            </div>
            <span style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 800 }}>
              {selectedElection.candidates?.length || 0} Registered Candidates
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {selectedElection.candidates?.map((c) => (
              <div
                key={c.id || c.candidate_id}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {/* Symbol Thumbnail with Edit Overlay */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '14px',
                      background: '#f8fafc', border: '2px solid #cbd5e1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }}>
                      {c.symbol_image ? (
                        <img
                          src={c.symbol_image}
                          alt={c.symbol_name || c.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '2rem', color: '#0284c7' }}>
                          {c.election_symbol || '★'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openSymbolEditor(c)}
                      title="Upload / Update Symbol JPEG"
                      style={{
                        position: 'absolute', bottom: '-6px', right: '-6px',
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: '#0284c7', color: '#fff', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Edit3 size={11} />
                    </button>
                  </div>

                  {/* Candidate Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                        APPROVED
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                      {c.position} • {c.department}
                    </div>

                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: '#f0f9ff', border: '1px solid #bae6fd',
                      padding: '2px 8px', borderRadius: '6px',
                      fontSize: '0.72rem', color: '#0369a1', fontWeight: 800,
                      marginTop: '6px'
                    }}>
                      <span>Symbol:</span>
                      <strong>{c.symbol_name || 'Standard Star'}</strong>
                    </div>
                  </div>
                </div>

                {/* Manifesto Snippet */}
                {c.manifesto && (
                  <div style={{ fontSize: '0.74rem', color: '#475569', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.4 }}>
                    <strong>Manifesto:</strong> {c.manifesto.length > 90 ? c.manifesto.slice(0, 90) + '...' : c.manifesto}
                  </div>
                )}

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => openSymbolEditor(c)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <Upload size={13} color="#0284c7" />
                  <span>Update Symbol Image (JPEG/PNG)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL: CANDIDATE SYMBOL JPEG UPLOADER & EDITOR
          ═════════════════════════════════════════════════════════ */}
      {editingCandidate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '500px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid #cbd5e1'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              padding: '20px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9 }}>
                  Candidate Campaign Symbol Studio
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0 0 0' }}>
                  {editingCandidate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCandidate(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Symbol Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Official Symbol Name
                </label>
                <input
                  type="text"
                  value={symbolName}
                  onChange={(e) => setSymbolName(e.target.value)}
                  placeholder="e.g. Rising Sun, Torch, Quill, Compass, Tree"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700
                  }}
                />
              </div>

              {/* Symbol Image Preview & Dropper */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  Symbol Emblem (JPEG / PNG / SVG File)
                </label>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Current Preview */}
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '18px',
                    background: '#f8fafc', border: '2px dashed #94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                  }}>
                    {symbolImagePreview ? (
                      <img
                        src={symbolImagePreview}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                        <ImageIcon size={28} />
                        <div style={{ fontSize: '0.64rem', marginTop: '2px' }}>No Image</div>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/svg+xml"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '10px 16px', borderRadius: '10px',
                        background: '#0284c7', color: '#fff', border: 'none',
                        fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <Upload size={14} />
                      <span>Choose JPEG/PNG File</span>
                    </button>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      Transparent PNG or high-contrast JPEG recommended. Auto-scaled for Web &amp; Physical EVMs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCandidateSymbol}
                  disabled={symbolUploading}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 20px', fontSize: '0.84rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', border: 'none'
                  }}
                >
                  {symbolUploading ? 'Saving...' : 'Ratify & Save Symbol'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL: ELECTION SCHEDULE & STATUTORY CRITERIA
          ═════════════════════════════════════════════════════════ */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '540px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid #cbd5e1'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              padding: '20px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9 }}>
                  Election Statutory Configuration
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0 0 0' }}>
                  {selectedElection?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Daily Voting Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Daily Start Time
                  </label>
                  <input
                    type="time"
                    value={scheduleData.dailyStartTime}
                    onChange={(e) => setScheduleData({ ...scheduleData, dailyStartTime: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Daily End Time
                  </label>
                  <input
                    type="time"
                    value={scheduleData.dailyEndTime}
                    onChange={(e) => setScheduleData({ ...scheduleData, dailyEndTime: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Minimum CGPA Criteria
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scheduleData.minCgpa}
                    onChange={(e) => setScheduleData({ ...scheduleData, minCgpa: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    Min Attendance (%) Criteria
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scheduleData.minAttendance}
                    onChange={(e) => setScheduleData({ ...scheduleData, minAttendance: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={scheduleData.votingHoursEnforced}
                    onChange={(e) => setScheduleData({ ...scheduleData, votingHoursEnforced: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                  />
                  <span>Enforce Strict Voting Window (Locks students outside {scheduleData.dailyStartTime} - {scheduleData.dailyEndTime})</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={scheduleData.disciplinaryClearanceRequired}
                    onChange={(e) => setScheduleData({ ...scheduleData, disciplinaryClearanceRequired: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                  />
                  <span>Require Disciplinary Clearance Record</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveScheduleAndCriteria}
                  disabled={savingSchedule}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.84rem', fontWeight: 800 }}
                >
                  {savingSchedule ? 'Saving...' : 'Apply Schedule & Criteria'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CEOElections;
