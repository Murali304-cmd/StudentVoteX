import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentVoiceXLoader } from '../../components/common/StudentVoiceXLoader';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Building2
} from 'lucide-react';

export function AdminVerification() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await api.verifications.list(statusFilter ? { status: statusFilter } : {});
      setRecords(data);
    } catch (e) {
      console.error("Error fetching verifications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const [autoVerifying, setAutoVerifying] = useState(false);
  const [autoSuccessMsg, setAutoSuccessMsg] = useState('');

  const handleAutoVerifyAllQR = async () => {
    setAutoVerifying(true);
    setAutoSuccessMsg('');
    try {
      const res = await api.verifications.autoVerifyQR();
      setAutoSuccessMsg(res.message || 'Auto-verification complete!');
      fetchRecords();
      setTimeout(() => setAutoSuccessMsg(''), 4000);
    } catch (e) {
      alert("Auto-verification failed: " + e.message);
    } finally {
      setAutoVerifying(false);
    }
  };

  const handleReview = async (newStatus) => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      await api.verifications.review(selectedRecord.id, {
        status: newStatus,
        admin_notes: reviewNotes || `Manually reviewed and marked as ${newStatus} by Administrator.`
      });
      setSelectedRecord(null);
      setReviewNotes('');
      fetchRecords();
    } catch (e) {
      alert("Error reviewing ID: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Institution ID Card Verification Review
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Verify uploaded & stored ABC Institution ID cards before students enter the controlled voting chamber.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleAutoVerifyAllQR}
            disabled={autoVerifying}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}
          >
            <ShieldCheck size={16} />
            <span>{autoVerifying ? 'Auto-Verifying QR...' : '⚡ Auto-Verify All (QR & Hash)'}</span>
          </button>

          <select
            className="input-field"
            style={{ width: '170px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {autoSuccessMsg && (
        <div className="badge-emerald" style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span style={{ fontWeight: 700 }}>{autoSuccessMsg}</span>
        </div>
      )}

      {/* Verification Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <StudentVoiceXLoader
              mode="card"
              label="Loading Student ID Verification Requests..."
              sublabel="Reading Stored Campus Badges & Cryptographic QR Codes..."
            />
          </div>
        ) : records.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }} className="glass-card">
            No ID card verification records found.
          </div>
        ) : (
          records.map((rec) => (
            <div key={rec.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      {rec.student_details?.full_name || 'Student'}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ID: <strong>{rec.student_details?.student_id}</strong> • {rec.student_details?.department}
                    </div>
                  </div>

                  <span className={`badge ${
                    rec.status === 'VERIFIED' ? 'badge-emerald' :
                    rec.status === 'UNDER_REVIEW' ? 'badge-indigo' :
                    rec.status === 'REJECTED' ? 'badge-rose' : 'badge-amber'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                {/* ID Card Graphic / Preview */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px',
                  marginBottom: '14px',
                  minHeight: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  {/* High-Tech Institutional Digital ID Badge */}
                  <div style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        ABC INSTITUTION
                      </div>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: '999px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }}></span>
                        SMART CARD ✓
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                      }}>
                        {(rec.student_details?.full_name || 'ST').split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {rec.student_details?.full_name || 'Registered Student'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                          Student ID: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>{rec.student_details?.student_id || rec.extracted_id_number}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Dept: {rec.student_details?.department || 'Information Technology'}
                        </div>
                      </div>

                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0284c7', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0
                      }}>
                        RFID
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>Document Hash: <code style={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>{rec.document_hash?.slice(0, 20)}...</code></div>
                  <div>Match Score: <strong>{rec.match_score}%</strong></div>
                  <div>Submitted: {new Date(rec.submitted_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => { setSelectedRecord(rec); setReviewNotes(rec.admin_notes || ''); }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Eye size={14} />
                  <span>Inspect & Review</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Review ID Card: {selectedRecord.student_details?.full_name}
              </h2>
              <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                <div><strong>Student Name:</strong> {selectedRecord.student_details?.full_name}</div>
                <div><strong>Student ID:</strong> {selectedRecord.student_details?.student_id}</div>
                <div><strong>Department:</strong> {selectedRecord.student_details?.department}</div>
                <div><strong>Year & Section:</strong> {selectedRecord.student_details?.year} - {selectedRecord.student_details?.section}</div>
                <div><strong>Extracted ID:</strong> {selectedRecord.extracted_id_number || 'N/A'}</div>
                <div><strong>Match Score:</strong> {selectedRecord.match_score}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Admin Review Notes & Audit Feedback
              </label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="Enter audit notes or reason for approval/rejection..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleReview('REJECTED')}
                disabled={submitting}
                className="btn btn-danger"
              >
                <XCircle size={16} />
                <span>Reject ID Card</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReview('VERIFIED')}
                  disabled={submitting}
                  className="btn btn-emerald"
                >
                  <CheckCircle2 size={16} />
                  <span>Approve & Verify ID</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
